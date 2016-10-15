---
layout: post
title: "非关系性数据库 MongoDB 简介"
keywords: nosql mongodb
description: "MongoDB 是一个基于分布式文档存储的数据库，由 C++ 语言编写。"
category: 数据库
tags: nosql mongodb
---

MongoDB 是一个基于分布式文档存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

## 非关系性数据库（NoSQL）

非关系性数据库，NoSQL(NoSQL = Not Only SQL )，意即"不仅仅是SQL"。是对不同于传统的关系型数据库的数据库管理系统的统称。NoSQL用于超大规模数据的存储。（例如谷歌或Facebook每天为他们的用户收集万亿比特的数据）。这些类型的数据存储不需要固定的模式，无需多余操作就可以横向扩展。

#### NoSQL特点

- 代表着不仅仅是SQL
- 没有声明性查询语言
- 没有预定义的模式
-键 - 值对存储，列存储，文档存储，图形数据库
- 最终一致性，而非ACID属性
- 非结构化和不可预知的数据
- CAP定理
- 高性能，高可用性和可伸缩性

#### NoSQL的优点/缺点

**优点:**

- 高可扩展性
- 分布式计算
- 低成本
- 架构的灵活性，半结构化数据
- 没有复杂的关系 

**缺点:**

- 没有标准化
- 有限的查询功能（到目前为止）
- 最终一致是不直观的程序
    
## 安装

Ubuntu 系统直接安装：

> apt-get install mongodb

或者官网下载安装：[https://www.mongodb.com/download-center#community](https://www.mongodb.com/download-center#community)

## MongoDB 一些基本概念

#### 数据库

一个mongodb中可以建立多个数据库。`show dbs` 命令可以显示所有数据的列表:

```
> show dbs
local	0.078125GB
```

执行 `db` 命令可以显示当前数据库对象或集合:

```
> db
test
```

运行 `use` 命令，可以连接到一个指定的数据库:

```
> use local
switched to db local
> db
local
```

#### 文档

文档是一个键值(key-value)对(即BSON)。MongoDB 的文档不需要设置相同的字段，并且相同的字段不需要相同的数据类型，这与关系型数据库有很大的区别，也是 MongoDB 非常突出的特点。

一个简单的文档例子如下：

```
{"name":"huoty", "age":"25"}
```

下表列出了 RDBMS(关系数据库管理系统：Relational Database Management System) 与 MongoDB 对应的术语：

|RDBMS|MongoDB|
|:---|:---|
|数据库|数据库|
|表格|集合|
|行|文档|
|列|字段|
|表联合|嵌入文档|
|主键|主键 (MongoDB 提供了 key 为 _id )|

需要注意的是：

-    文档中的键/值对是有序的。
-    文档中的值不仅可以是在双引号里面的字符串，还可以是其他几种数据类型（甚至可以是整个嵌入的文档)。
-    MongoDB区分类型和大小写。
-    MongoDB的文档不能有重复的键。
-    文档的键是字符串。除了少数例外情况，键可以使用任意UTF-8字符。

#### 集合

集合就是 MongoDB 文档组，类似于 RDBMS 中的表格。集合存在于数据库中，集合没有固定的结构，这意味着你可以在集合中插入不同格式和类型的数据，但通常情况下我们插入集合的数据都会有一定的关联性。

比如，我们可以将以下不同数据结构的文档插入到集合中：

```
{"name":"huoty"}
{"name":"esenich","name":"kalu"}
{"name":"kong","name":"hylin","num":2}
```

当第一个文档插入时，集合就会被创建。

#### 元数据

数据库的信息是存储在集合中。它们使用了系统的命名空间：

> dbname.system.*

## MongoDB 数据类型

下表为MongoDB中常用的几种数据类型：

|数据类型|描述|
|:---|:---|
|String|字符串。存储数据常用的数据类型。在 MongoDB 中，UTF-8 编码的字符串才是合法的。|
|Integer|整型数值。用于存储数值。根据你所采用的服务器，可分为 32 位或 64 位。|
|Boolean|布尔值。用于存储布尔值（真/假）。|
|Double|双精度浮点值。用于存储浮点值。|
|Min/Max keys|将一个值与 BSON（二进制的 JSON）元素的最低值和最高值相对比。|
|Arrays|用于将数组或列表或多个值存储为一个键。|
|Timestamp|时间戳。记录文档修改或添加的具体时间。|
|Object|用于内嵌文档。|
|Null|用于创建空值。|
|Symbol|符号。该数据类型基本上等同于字符串类型，但不同的是，它一般用于采用特殊符号类型的语言。|
|Date|日期时间。用 UNIX 时间格式来存储当前日期或时间。你可以指定自己的日期时间：创建 Date 对象，传入年月日信息。|
|Object ID|对象 ID。用于创建文档的 ID。|
|Binary Data|二进制数据。用于存储二进制数据。|
|Code|代码类型。用于在文档中存储 JavaScript 代码。|
|Regular expression|正则表达式类型。用于存储正则表达式。|


## 使用

MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

图形客户端推荐：[robomongo](https://robomongo.org/)

#### MongoDb web 用户界面

MongoDB 提供了简单的 HTTP 用户界面。 如果你想启用该功能，需要在启动的时候指定参数 --rest :

> $ ./mongod --rest

MongoDB 的 Web 界面访问端口比服务的端口多1000。如果你的MongoDB运行端口使用默认的27017，你可以在端口号为28017访问web用户界面，即地址为：http://localhost:28017。



