---
layout: post
title: "RabbitMQ 消息中间件使用简介"
keywords: RabbitMQ AMQP 消息中间件 消息队列
category: 计算机科学
tags: rabbitmq
---

`RabbitMQ` 是一个用 Erlang 开发的 AMQP（Advanced Message Queue, 高级消息队列协议）的开源实现。AMQP 是应用层协议的一个开放标准，为面向消息的中间件设计。消息中间件主要用于组件之间的解耦，消息的发送者无需知道消息使用者的存在，反之亦然。

AMQP 的主要特征是面向消息、队列、路由（包括点对点和发布/订阅）、可靠性、安全。消息服务擅长于解决多系统、异构系统间的数据交换（消息通知/通讯）问题，也可以用于系统间服务的相互调用（RPC）。AMQP 模型定义了一系列模块化组件和标准规则来进行协作. 有三种类型的组件可以连接服务器处理链来创建预期的功能，包括交换器(exchange)、消息队列(message queue)、绑定(binding)。

RabbitMQ 的核心功能就是接收和发送消息，它的应用是一个典型的生产者和消费者模型。RabbitMQ 中的消息都只能存储在 Queue 中，生产者生产消息并最终投递到 Queue 中，消费者可以从 Queue 中获取消息并消费。多个消费者可以订阅同一个 Queue，这时 Queue 中的消息会被平均分摊给多个消费者进行处理，而不是每个消费者都收到所有的消息并处理。

![RabbitMQ 工作流程图](https://raw.githubusercontent.com/kuanghy/pichub/master/2020/04/23cdfa87bf743e209305cf304fe44239.jpg)


## 基础概念

**RabbitMQ Server:**

Server 所扮演的角色是维护一条从 Producer 到 Consumer 的路线，保证数据能够按照指定的方式进行传输，同时还可以将 Producer 发送的消息持久化。RabbitMQ Server 也可叫作 Broker Server，是一种传输服务。

**Producer:**

数据(message)的发送方，负责创建消息并发送到 Server。 一个消息(message)包含两部分内容：`payload`（有效载荷）和 `label`（标签）。payload 即要传输的数据，label 是交换器(exchange)的名字，它描述了 payload，而且 RabbitMQ 也是通过这个 label 来决定把消息发给哪个 Consumer。AMQP 仅仅描述了 label，而 RabbitMQ 决定了如何使用这个 label 的规则。

**Consumer:**

数据(message)的接收方，它连接到 Server，并订阅相应 Queue 中的消息。可以把 Queue 比作是一个有名字的邮箱，当有消息到达某个邮箱后，RabbitMQ 把它发送给它的某个订阅者即Consumer。当然也可能会把同一个消息发送给很多的 Consumer。在这个消息中，只有payload，而 label 已经被删掉了。对于 Consumer 来说，其不知道谁发送的这个信息，除非在消息体中携带发送者信息。

**Connection:**

是 RabbitMQ 的 socket 连接，它封装了 socket 协议相关部分逻辑。Producer 和 Consumer 都是通过 socket 连接到 RabbitMQ Server 的。

**Channel:**

是操作 RabbitMQ 的最重要的一个接口，是进行消息读写的通道。它建立在上述的 socket 连接中。数据流动都是在 Channel 中进行的。也就是说，一般情况是程序起始建立 socket 连接，第二步就是建立这个 Channel。大部分的业务操作是在 Channel 这个接口中完成的，包括定义 Queue、定义 Exchange、绑定 Queue 与 Exchange、发布消息等。在客户端的每个连接里，可建立多个 Channel，每个 Channel 代表一个会话任务。

那么，为什么使用 Channel，而不是直接使用 socket 连接呢？对于 OS 来说，建立和关闭socket 连接是有代价的，频繁的建立关闭 socket 连接对于系统的性能有很大的影响，而且 socket 的连接数也有限制，这也限制了系统处理高并发的能力。但是，在 socket 连接中建立 Channel 是没有上述代价的。对于 Producer 或者 Consumer 来说，可以并发的使用多个 Channel 进行 Publish 或者 Receive。

**Exchange:**

交换机是发送消息的实体。在接受到生产者发来的的消息后，会转发消息到绑定的队列。也就是说生产者的消息并不是直接发送到队列中的，而是先发送到交换器，交换器通过指定的路由规则再将这个消息路由到相应的队列中。交换器到队列的映射可以是一对一、一对多或多对多的。交换机具有如下几种类型：

- **Direct Exchange（直连交换机）：** 把消息投递到那些 binding key 与 routing key 完全匹配的队列中
- **Fanout Exchange（扇型交换机）：** 把消息路由给绑定到它身上的所有队列，而不理会绑定的路由键
- **Topic Exchange（主题交换机）：** 通过消息的路由键和队列到交换机的绑定模式之间的匹配，将消息路由给一个或多个队列
- **Headers Exchange（头交换机）：** 通过判断消息头的值能否与指定的绑定相匹配来确立路由规则

交换机可以有两个状态：持久（durable）、暂存（transient）。持久化的交换机会在消息代理（broker）重启后依旧存在，而暂存的交换机则不会（它们需要在代理再次上线后重新被声明）。然而并不是所有的应用场景都需要持久化的交换机。

除了显式声明交换机外，RabbitMQ 预先声明好了一个默认交换机（default exchange），它是一个没有名字（名字为空字符串）的直连交换机（direct exchange）。它有一个特殊的属性使得它对于简单应用特别有用处：那就是每个新建 Queue 都会自动绑定到默认交换机上，绑定的路由键（routing key）名称与队列名称相同。

**Queue:**

是接收消息的实体，是 RabbitMQ 内部对象，存储交换器发来的消息。相同属性的 Queue 可以重复定义。消息在队列中保存，以轮询的方式将消息发送给监听消息队列的消费者，可以动态的增加消费者以提高消息的处理能力。如果希望实现负载均衡，可以在消费者端通知 RabbitMQ，一个消息处理完之后才会接受下一个消息。消息有很多可设置的属性，最常用的有如下几个：

- **deliveryMode：** 持久化属性
- **contentType：** 编码
- **replyTo：** 指定一个回调队列
- **correlationId：** 消息 ID

**Banding:**

绑定（Binding）是交换机（exchange）将消息（message）路由给队列（queue）所需遵循的规则。如果要指示交换机 “E” 将消息路由给队列 “Q”，那么 “Q” 就需要与 “E” 进行绑定。绑定操作需要定义一个可选的路由键（routing key）属性给某些类型的交换机。路由键的意义在于从发送给交换机的众多消息中选择出某些消息，将其路由给绑定的队列。

如果消息无法路由到队列（例如，发送到的交换机没有绑定队列），消息会被就地销毁或者返还给发布者。如何处理取决于发布者设置的消息属性。

**Virtual Host:**

虚拟主机，一个 Server 里可以开设多个虚拟主机，用作不同用户的权限分离。本质上可以将每个 virtual host 看做是一个单独 RabbitMQ Server，它拥有自己的 queue，exchagne，和 bings rule 等（类似于 Web Server 虚拟主机的概念）。

## 使用流程

在 AMQP 模型中，消息在 Producer 中产生，发送到 RabbitMQ Server 的 Exchange
上，Exchange 根据配置的路由方式投递到相应的 Queue 上，Queue 又将消息发送给已经连接到该 Queue 上 Consumer。RabbitMQ 消息队列的使用过程大概如下：

- 1、客户端连接到消息队列服务器，并打开一个 Channel
- 2、客户端声明一个 Exchange，并设置相关属性
- 3、客户端声明一个 Queue，并设置相关属性
- 4、客户端使用 Routing key，在 Exchange 和 Queue 之间建立好 Binding 关系
- 5、生产者客户端投递消息到 Exchange
- 6、Exchange 接收到消息后，就根据消息的 RoutingKey 和已经设置的 Binding，进行消息路由（投递），将消息投递到一个或多个队列里
- 7、消费者客户端从对应的队列中获取并处理消息

注意，由于 Exchange 和 Queue 都必须先存在，所以一般情况下建议 Producer 与 Customer 都应先尝试申明 Exchange 和 Queue，以确保都被成功创建。

下面使用 Python 语言，并用 pika 包来实现一个简单的例子(本文所有的使用示例都将使用 Python 实现)。

消息发送端（Producor）：

```python
# send.py

import pika

# 使用的第一步是创建连接并打开一个 Channel
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# 接着应该声明一个 Exchange，因为这里是一个简单的示例
# 我们使用默认的 Exchange，所以不用声明
# 使用默认的 Exchange 时，不需要执行绑定步骤
# 此时 routing_key 即为 queue 的名字
# 消息会被路由到与 routing_key 名字相同的 queue 中

# 下一步是声明一个 Queue，这里声明了一个名为 hello 的 Queue
channel.queue_declare(queue='hello')

# 接下来就是发布消息
channel.basic_publish(exchange='',
                      routing_key='hello',
                      body='Hello World!')

print " [x] Sent 'Hello World!'"
connection.close()
```

消息的接收端（Customer）：

```python
receive.py

import pika

# 首先应该创建一个连接并打开一个 Channel
connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))
channel = connection.channel()

# 不声明 Exchange，使用默认的 Exchange

# 声明名为 hello 的 queue
channel.queue_declare(queue='hello')

print ' [*] Waiting for messages. To exit press CTRL+C'

# 定义回调函数
def callback(ch, method, properties, body):
    print " [x] Received %r" % (body,)

# 订阅消息
channel.basic_consume(callback,
                      queue='hello',
                      no_ack=True)

# 循环等待消息到达
channel.start_consuming()
```

## 高级用法

### 消息确认/持久化/预取

Consumer 收到消息后，处理这个消息可能需要一段时间。如果在这段时间中 Consumer 出错异常退出了，而数据还没有被正确处理完，那么数据就丢失了。在之前的示例中，订阅 Queue 时将 `no-ack` 设置成了 True，这表示不进行 消息确认（acknowledgment）。这样，每次 Consumer 接到数据后，不管是否处理完成，RabbitMQ Server 会立即把这个 Message 标记为完成，然后从 Queue 中删除。

为了保证数据不被丢失，**RabbitMQ 支持消息确认机制**，即 acknowledgment。这种机制是，在 Consumer 处理完数据后向 Server 发送 ack，以告诉 RabbitMQ 数据已经被接收并处理完成，此时 RabbitMQ 并可以安全的删除消息。这样，如果一个 Consumer 异常退出了但是没有发送 ack，它处理的数据能够被另外的 Consumer 处理。

为了保证数据能被正确处理而不仅仅是被 Consumer 收到，需要在订阅消息时指定 no-ack 参数为 False，这是默认的行为，可以不必显示设置。

需要注意的是， 如果忘记了 ack，那么后果很严重。因为消息会一直得不到删除，然后 RabbitMQ 会占用越来越多的内存，由于 RabbitMQ 会长时间运行，因此这个 “内存泄漏” 是致命的。

默认情况下，生产者发布的消息是存到内存中的。如果 RabbitMQ Server 退出，而消息又没有正确处理，那么当 Server 重启时，消息就会丢失。**RabbitMQ 支持将 Queue 和 Message 持久化到硬盘**，这样当 Server 退出后又重启时，未被处理的数据会重新从磁盘上读取出来。

持久化 Queue 需要在声明时指定 durable=True，持久化 Message 需要在 Publish 时指定 properties=pika.BasicProperties(delivery_mode=2)。

RabbitMQ 默认将收到的消息持续的发给一个或者多个 Consumer，如果需要负载均衡，这样则达不到效果。因为有的 Consumer 主机可能正在处理繁重的任务，而有些机器则很空闲。可以在打开一个 Channel 后，通过其 basic_qos 方法设置 prefetch_count=1，即 **消息预取**。这样 RabbitMQ 就会使得每个 Consumer 在同一个时间点最多处理一个 Message，即 RabbitMQ 在接收到 Consumer 的 ack 前，不会将新的 Message 分发给它。

以下是上述功能的一个完整示例。首先是生产者：

```python
# new_task.py

import sys
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# 声明 queue，并指定持久化
channel.queue_declare(queue='task_queue', durable=True)

# 从命令行读取参数作为消息
message = ' '.join(sys.argv[1:]) or "Hello World!"

# 发布消息，并指定将消息持久存储
channel.basic_publish(exchange='',
                      routing_key='task_queue',
                      body=message,
                      properties=pika.BasicProperties(
                         delivery_mode=2, # 让消息被持久存储
                      ))

print " [x] Sent %r" % (message,)
```

消费者（这里的示例可以同时起多个消费者）：

```python
# worker.py

import time
import pika


connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# 声明 queue，并指定持久存储
channel.queue_declare(queue='task_queue', durable=True)
print ' [*] Waiting for messages. To exit press CTRL+C'

# 定义回调函数，该函数会在退出前向 Server 发送 ack
def callback(ch, method, properties, body):
    print " [x] Received %r" % (body,)
    time.sleep( body.count('.') )
    print " [x] Done"
    ch.basic_ack(delivery_tag=method.delivery_tag)  # 消息确认

# 指定消息预取
channel.basic_qos(prefetch_count=1)

# 订阅消息
channel.basic_consume(callback, queue='task_queue')

channel.start_consuming()
```

### 消息广播/临时队列

在 RabbitMQ 中 Producer 并不是直接将 Message 发送到 Queue 中，而是发到 Exchange 中。实际上，Producer 并不知道发送的 Message 是否已经到达 Queue。Exchange 负责从 Producer 接收 Message，然后投递到 Queue 中，它需要知道如何处理 Message。是将 Message 放到哪个 Queue 中，还是放到多个 Queue 中，这取决于 Exchange 的类型。

`fanout` 类型的 Exchange 会将所有的 Message 都放到它所知道的 Queue 中，这就是 **广播模式**。可以在声明 Exchange 的时候指定其类型，如：

```python
channel.exchange_declare(exchange='logs', exchange_type='fanout')

# exchange_type 的取值可以为：direct, topic, headers, fanout
# 注：在之前的示例中使用的是默认的 Exchange，并没有显示的声明
```

在声明 Queue 时，可以不指定其名字，这样 RabbitMQ 会随机为其生成一个名字：

```python
# 让 RabbitMQ 随机生成 queue 的名字
result = channel.queue_declare()

# 通过 result.method.queue 可以取得 queue 的名字
```

有时候，可能需要一个新的、空的 Queue，且当 Consumer 关闭连接时，希望 Queue 被自动删除。这种类型的 Queue，可以称其为 **临时 Queue**。自动删除 Queue 可以在声明时指定 exclusive=True 实现：

```python
result = channel.queue_declare(exclusive=True)
```

在之前的示例中，由于使用了默认的 Exchange，RabbitMQ 会默认将 Message 路由到名字与 routing_key 相同的 Queue 中。而现在，由于我们自已声明了 Exchange，所以也需要自己将 Exchange 与 Queue 绑定。如：

```python
channel.queue_bind(exchange='logs', queue=result.method.queue)
```

以下列举一个示例，创建一个日志系统，它包含两个部分：Producer 发出 log，Consumer 接收到并打印，消息采用广播的形式，当有多个 Consumer 存在时都会受到 Producer 发出的 log。

生产者：

```python
# emit_log.py

import sys
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# 声明 Exchange，并指定其类型为广播
channel.exchange_declare(exchange='logs', exchange_type='fanout')

# 注意这里不再声明和绑定 Queue，这些工作在 Consumer 中做，
# 因为现在需要一个临时的 Queue，在 Consumer 关闭连接时自动销毁，
# 这就要求 Consumer 端必须在 Producer 端之前启动

message = ' '.join(sys.argv[1:]) or "info: Hello World!"

# 发布消息，注意这里的 routing_key 为空字符串
# 因为在广播模式下，指定 routing_key 是没有意义的
channel.basic_publish(exchange='logs',
                      routing_key='',
                      body=message)

print " [x] Sent %r" % (message,)
connection.close()
```

消费者：

```python
# receive_logs.py

import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# 声明 Exchange
channel.exchange_declare(exchange='logs', exchange_type='fanout')

# 声明临时队列
result = channel.queue_declare(exclusive=True)

# 将临时 Queue 与 Exchange 绑定
queue_name = result.method.queue
channel.queue_bind(exchange='logs', queue=queue_name)

print ' [*] Waiting for logs. To exit press CTRL+C'

def callback(ch, method, properties, body):
    print " [x] %r" % (body,)

channel.basic_consume(callback,
                      queue=queue_name,
                      no_ack=True)

channel.start_consuming()
```

### 消息路由

在上面的例子中，通过将 Exchange 和生成的临时 Queue 绑定在一起，能够把生产者发布的消息路由到指定的 Queue 中。这就是之前提到的 **绑定(binding)** 的概念。所谓绑定就是关联了 Exchange 和 Queue，让 Exchange 能够把 Message 路由到预期的 Queue 中。绑定还可以带 routing_key 参数，设置这个参数后，同一个 Exchange 可以根据不同的 routing_key 把消息路由到不同的 Queue 中。这便是 `direct` 模式下的 Exchange， 如下图所示：

![direct exchange](https://raw.githubusercontent.com/kuanghy/pichub/master/2020/04/d5fb282d7def512ee6452b0138520328.jpg)

多个 Queue 也可以使用同一个 routing_key 绑定在一个 Exchange 上，这就类似于 fanout 模式下的 Exchange 。如下图的示例，Q1 和 Q2 都绑定了 black。也就是说，对于 routing_key 是 black 的 Message，会被 deliver 到 Q1 和 Q2，其余的 Message 都会被丢弃。

![multiple bindings](https://raw.githubusercontent.com/kuanghy/pichub/master/2020/04/3012c7d2470e9c40d44bc6566fb39cb0.jpg)

下面的示例尝试实现一个简单的日志系统，将不同级别的日志路由到不同的 Queue 中。生产者：

```python
# emit_log_direct.py

import sys
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.exchange_declare(exchange='direct_logs', exchange_type='direct')

severity = sys.argv[1] if len(sys.argv) > 1 else 'info'
message = ' '.join(sys.argv[2:]) or 'Hello World!'

# 发布消息，并指定 routing_key 为以上从命令行获取的 serverity
channel.basic_publish(exchange='direct_logs',
                      routing_key=severity,
                      body=message)

print " [x] Sent %r:%r" % (severity, message)
connection.close()
```

消费者：

```python
# receive_logs_direct.py

import sys
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.exchange_declare(exchange='direct_logs', exchange_type='direct')

# 声明临时队列
result = channel.queue_declare(exclusive=True)
queue_name = result.method.queue

# 从命令行中读取日志级别
severities = sys.argv[1:]
if not severities:
    print >> sys.stderr, "Usage: %s [info] [warning] [error]" % \
                         (sys.argv[0],)
    sys.exit(1)

# 将读取到的日志级别绑定到申明的临时 Queue 上
# 这个虽然使用的是 direct 类型的 Exchange
# 但这里的应用却类似于 fanout 类型
for severity in severities:
    channel.queue_bind(exchange='direct_logs',
                       queue=queue_name,
                       routing_key=severity)

print ' [*] Waiting for logs. To exit press CTRL+C'

def callback(ch, method, properties, body):
    print " [x] %r:%r" % (method.routing_key, body,)

channel.basic_consume(callback,
                      queue=queue_name,
                      no_ack=True)

channel.start_consuming()
```

### 主题交换机

`主题交换机(Topic Exchange)` 可以理解为是一种模糊匹配 Queue 的 Exchange。前面提到的 direct 类型的 Exchange 必须是生产者发布消息时指定的 routing_key 和消费者在队列绑定时指定的 routing_key 完全相等时才能匹配到队列上。与 direct 类型的 Exchange 不同，topic 类型的 Exchange 可以进行模糊匹配，可以使用星号 `*` 和井号 `#`通配符来进行模糊匹配，这两个通配符的含义：

- `*` (星号) 匹配任意一个单词
- `#` (井号) 匹配 0 个或者多个单词

主题类型的交换机的消息不能随意的设置 routing_key，必须由点隔开的一系列的标识符组成。标识符可以任意命名，但一般都与消息的某些特性相关，标识符的长度限制在 255 字节以内。一个合法的 routing_key 示例："quick.orange.rabbit"。当一个 Exchange 与 Queue 绑定的 routing_key 为 # 时，交换机会将所有消息路由到队列中，其就类似于 fanout 类型的 Exchange。而当主题交换机没有使用通配符时，其又类似于 direct 类型的 Exchange。

可以用 Topic Exchange 来改善上例中的日志系统，让其除了可以区分日志级别外还可以区分不同的模块，routing_key 使用形如 `<facility>.<severity>` 的形式。生产者：

```python
# emit_log_topic.py

import sys
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# 声明 topic 类型的 Exchange
channel.exchange_declare(exchange='topic_logs', exchange_type='topic')

# 从命令行读取 routing_key 和 message 并发布
routing_key = sys.argv[1] if len(sys.argv) > 1 else 'anonymous.info'
message = ' '.join(sys.argv[2:]) or 'Hello World!'
channel.basic_publish(exchange='topic_logs',
                      routing_key=routing_key,
                      body=message)

print " [x] Sent %r:%r" % (routing_key, message)
connection.close()
```

消费者：

```python
# receive_logs_topic.py

import sys
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# 声明 topic 类型的 Exchange
channel.exchange_declare(exchange='topic_logs', exchange_type='topic')

# 声明临时 Queue
result = channel.queue_declare(exclusive=True)
queue_name = result.method.queue

# 从命令行读取绑定键
binding_keys = sys.argv[1:]
if not binding_keys:
    print >> sys.stderr, "Usage: %s [binding_key]..." % (sys.argv[0],)
    sys.exit(1)

for binding_key in binding_keys:
    channel.queue_bind(exchange='topic_logs',
                       queue=queue_name,
                       routing_key=binding_key)

print ' [*] Waiting for logs. To exit press CTRL+C'

def callback(ch, method, properties, body):
    print " [x] %r:%r" % (method.routing_key, body,)

channel.basic_consume(callback,
                      queue=queue_name,
                      no_ack=True)

channel.start_consuming()
```

运行示例：

```
# 接收所有的 log:
python receive_logs_topic.py "#"

# 接收所有 kern facility 的 log：
python receive_logs_topic.py "kern.*"

# 仅仅接收 critical 的 log：
python receive_logs_topic.py "*.critical"

# 可以创建多个绑定：
python receive_logs_topic.py "kern.*" "*.critical"

# 生产者产生一个 log：
python emit_log_topic.py "kern.critical" "A critical kernel error"
```

### 头交换机

头交换机(Headers Exchange)是忽略 routing_key 的一种路由方式，其和 fanout 类型的交换机一样都不需要 routing_key。头交换机通过 Headers 信息来与 Queue 绑定，类似于 HTTP 中的 Headers。Headers 一个 Hash 的数据结构，消息发送的时候，需要携带一组 Hash 数据结构的信息，当 Hash 的内容匹配上时，消息被写入对应的队列。

Exchange 与 Queue 绑定时，Hash 结构中要求额外指定一个键 `x-match`，其取值为 any 或 all，其含义是：

- any: 仅匹配一个键值对即可
- all：需要所有的键值对都匹配上

```python
channel.queue_bind(exchange='testing',
                   queue=queue_name,
                   routing_key='',
                   arguments={'ham': 'good', 'x-match':'any'})

# 通过 arguments 参数指定 x-match 和需要匹配的键值对
```

相比于 direct 类型的 Exchange，Headers Exchage 的优势是匹配的规则不被限定为字符串(string)类型而可以是 Object 类型。

下面的示例使用头交换机来重写一个简单的日志系统，仅接受 warning 和 error 级别的日志并打印。生产者：

```python
# emit_log_headers.py

import sys
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))
channel = connection.channel()

# 声明 headers 类型的 Exchange
channel.exchange_declare(exchange='headers_logs', exchange_type='headers')

severity = sys.argv[1] if len(sys.argv) > 1 else 'warning'
message = ' '.join(sys.argv[2:]) or 'Hello World!'
headers = {severity: severity}
channel.basic_publish(
    exchange='headers_logs',
    routing_key='',
    body=message,
    properties=pika.BasicProperties(headers=headers)
)

print ' [x] Send {0} with headers: {1}'.format(message, headers)
connection.close()
```

消费者：

```python
# receive_logs_headers.py

import sys
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.exchange_declare(exchange='headers_logs', exchange_type='headers')

result = channel.queue_declare(exclusive=True)
queue_name = result.method.queue

arguments = {
    "error": "error",
    "warning": "warning",
    "x-match": "any"  # 仅匹配一个日志级别即可
}
channel.queue_bind(exchange='headers_logs',
                   queue=queue_name,
                   routing_key='',
                   arguments=arguments)

print ' [*] Waiting for logs. To exit press CTRL+C'

def callback(ch, method, properties, body):
    print " [x] {headers}:{body}".format(headers=properties.headers,
                                         body=body)

channel.basic_consume(callback,
                      queue=queue_name,
                      no_ack=True)

channel.start_consuming()
```

<!--

### 远程过程调用

-->

### 要点总结

- 1. 在 fanout 模式中，指定 routing_key 是无效的
- 2. Exchange 有预先声明好的默认 exchange（名字为空字符串），其类型为 direct exchange（直连交换机）
- 3. Queue 可以由 Server 随机生成并返回一个名字，可以设置这个 Queue 在 Consumer 断开连接时被自动销毁，即临时的 Queue
- 4. 无论是生产者还是消费者，在尝试连接 Server 是都应该尝试先声明 exchange，以确保其被创建
- 5. 大多数情况下，生产者和消费者都应该尝试先创建 Queue，但有时候也有例外，比如使用临时 Queue 的时候，Queue 应该由消费者去创建

## 服务部署与维护

Ubuntu 系统安装：

> sudo apt-get install rabbitmq-server

三个基本命令：

- **rabbitmqctl：** 管理工具
- **rabbitmq-plugins：** 插件管理工具
- **rabbitmq-server：** 服务器

```
rabbitmqctl status //显示RabbitMQ中间件的所有信息
rabbitmqctl stop //停止RabbitMQ应用，关闭节点
rabbitmqctl stop_app //停止RabbitMQ应用
rabbitmqctl start_app //启动RabbitMQ应用
rabbitmqctl restart //重置RabbitMQ节点
rabbitmqctl force_restart //强制重置RabbitMQ节点
```

```
rabbitmqctl list_exchanges [-p <vhostpath>] //查看所有交换机
rabbitmqctl list_bindings [-p <vhostpath>] //查看所有绑定
rabbitmqctl list_connections //查看所有连接
rabbitmqctl list_channels //查看所有信道
rabbitmqctl list_consumers //查看所有消费者信息
```

也可以开启 Web 管理工具：

```
sudo rabbitmq-plugins enable rabbitmq_management

sudo service rabbitmq-server restart
```

然后浏览器访问：http://localhost:15672/ 进行管理。

还有扩展管理工具 rabbitmqadmin 可供使用，其增强了 RabbitMQ 的管理功能。


## 优缺点

优点：

- 1、由 Erlang 语言开发，支持大量协议：AMQP、XMPP、SMTP、STOMP
- 2、支持消息的持久化、负载均衡和集群，且集群易扩展
- 3、具有一个 Web 监控界面，易于管理
- 4、安装部署简单，上手容易，功能丰富，强大的社区支持
- 5、支持消息确认机制、灵活的消息分发机制

缺点：

- 1、由于牺牲了部分性能来换取稳定性，比如消息的持久化功能，使得 RabbitMQ 在大吞吐量性能方面不及 Kafka 和 ZeroMQ
- 2、由于支持多种协议，使 RabbitMQ 非常重量级，比较适合企业级开发

与其他的消息中间件相比，RabbitMQ 在优先级队列、延迟队列和多用户虚拟机等诸多特性的支持上比 kafka 更强，金融行业的使用历史较长，所以在金融行业普遍使用。但 kafka 高并发，高性能, 延迟低, 在互联网企业应用较多。ActiveMQ 性能不好，高并发场景问题多。RocketMQ 可靠，高吞吐，可水平扩展，但某些特性需要付费。ZeroMQ 则仅仅是一个消息处理队列库，属于一组底层网络通讯库，很多功能都需要自己扩展实现，但其可定制能力强。


## 参考资料

- [https://blog.csdn.net/column/details/rabbitmq.html](https://blog.csdn.net/column/details/rabbitmq.html)
- [https://techietweak.wordpress.com/tag/rabbitmq/](https://techietweak.wordpress.com/tag/rabbitmq/)
- [https://www.infoq.cn/article/kafka-vs-rabbitmq/](https://www.infoq.cn/article/kafka-vs-rabbitmq/)
