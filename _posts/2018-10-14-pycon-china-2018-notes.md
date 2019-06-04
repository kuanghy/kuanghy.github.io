---
layout: post
title: "PYCON中国(2018)听讲笔记"
keywords: python pycon
description: "简单记录参加2018年PYCON中国大会的听过内容"
category: Python
tags: python
---

今年去参加了下国内的 PyCon 大会，想着这类活动还是应该多支持下。此次大会的分享者们分享了 Python 的语言特性、Python 创新应用（人工智能，大数据，区块链专场）、Python 工程化应用（架构，Web后端，运维专场）以及一些从业经验。其中还有 CPython 的核心开发者 Ezio Melotti 介绍了 CPython 幕后的开发过程，并分享了如何为 CPython 贡献代码。以下为我在与会过程中做的笔记，内容有些散乱，所涉及的内容也没有详细描述，仅作记录用。

## Python 语言特性

### 三元运算符

在 Python 2.5 之前，没有三元运算符，但可以用 `and or` 表达式代替：

```python
a = cond and foo or bar
```

以上语句利用逻辑运算符的短路特性来模仿三元运算符。但这个表达式有一个缺陷，只有 foo 为真时才能达到想要的效果，否则 a 将永远等于 bar。Python 2.5 之后，使用写在一行的 `if else` 语句实现三元运算符的功能：

```python
a = foo if cond else bar
```

### 字符串格式化

Python 最初使用类 C 风格的字符串格式化方式，即使用 `%` 操作符来支持字符串格式化。之后又加入了 Template 来支持字符串格式化，见 [PEP 292](https://www.python.org/dev/peps/pep-0292/)，示例：

```python
>>> from string import Template
>>> tpl = Template('$who likes $what')
>>> tpl.substitute(who='I', what='WangQing')
'I likes WangQing'
>>> tpl.substitute(who='I')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/local/lib/python3.6/string.py", line 126, in substitute
    return self.pattern.sub(convert, self.template)
  File "/usr/local/lib/python3.6/string.py", line 119, in convert
    return str(mapping[named])
KeyError: 'what'
>>> tpl.safe_substitute(who='I')
'I likes $what'
```

再之后，字符串对象有了 format 方法实现更高级的字符串格式化，见 [PEP 3101](https://www.python.org/dev/peps/pep-3101/)，示例：

```python
>>> "{0} {1}".format("hello", "world")
'hello world'
>>> "{} {}".format("hello", "world")
'hello world'
>>> "{1} {0} {1}".format("hello", "world")
'world hello world'
```

Python 3.6 开始对 format 字符串格式化方式进行了增强，即 **f-strings**。其支持自动从当前名字空间中查找值，且支持函数调用。见 [PEP 498 – Literal String Interpolation](https://www.python.org/dev/peps/pep-0498/)。示例：

```python
>>> name = "Huoty"
>>> f'My name is {name}'
'My name is Huoty'
>>> width = 10
>>> precision = 4
>>> import decimal
>>> value = decimal.Decimal("12.34567")
>>> f"result: {value:{width}.{precision}}"  # nested fields
'result:      12.35'
>>> import datetime
>>> now = datetime.datetime.now()
>>> f'{now} was on a {now:%A}'
'2018-01-18 11:21:58.444054 was on a Thursday'
>>> def foo():
...     return 18
...
>>> f'result={foo()}'
'result=18'
```

## 语言高级特性

### 增强可读性的特性

代码通常都会被反复阅读（Readability counts），所以在编写代码时应考虑其可读性、可维护性、可持续性。

**“工程师要有文化，Write Beautiful Code.”**

以下列举了 Python 一些能增强代码可读性的特性，这些特性应该多用：

- 装饰器
- 生成器
- 上下文管理器、
- 关键字参数
- f-string、
- 协程支持（yield）
- 函数式编程（map、reduce、filter）
- ...

### 提高语言能力的特性

- inspect
- metaclass
- 描述符
- \_\_getattribution__
- import hook
- ...

这些特性非常强大，但其会使得代码难以理解，降低了可读性，所以不建议在业务代码中使用，而应该在更为底层的代码中使用。

### 使用新特性

- 能增强可读性的特性就大胆去用
- Know why, know how -- Read PEP

## 架构设计

什么是架构？架构包括：1、动的部分；2、不动的部分。

Python 的骨架：[Everything is a dict](https://argumate.tumblr.com/post/159341161378/python-what-if-everything-was-a-dict-java-what)（赋值只是在 dict 中增加 k-v 对）

架构设计的三个关键点：抽象、分层、接口，下层是上层的服务提供者。

架构调整要慎之又慎，选型时要在 **保守** 和 **激进** 之间进行权衡，最主要的一点是要保证 **易维护性**。

时下关键词：

- Cloud
- SaaS
- Docker / Kubernetes Microservice
- FaaS / Serverless


## 进程调试与监控

对进程的调试和监控主要为了解决如下问题：

- 为什么我的 Python 进程运行结果不符合预期？
- 为什么我的 Python 进程卡住了？
- 为什么我的 Python 进程消耗这么多的内存？
- 为什么我的 Python 进程占用这么多的 CPU？

### 基本调试方法

- print & log
- pdb，breakpoint(new in python3.7)
- sys.excepthook and more ...
- gc
- tracemalloc (new in python3.4)

优点：解释器器⾃自带，完善的⽂文档和社区⽀支持，功能更更强⼤大。缺点：需要添加、删除、重启。

```python
# sys

sys.excepthook
sys.getallocatedblocks
sys.setprofile
sys.settrace
sys.set_asyncgen_hooks
sys.set_coroutine_wrapper
sys._current_frames
sys._getframe
more ...

import sys, traceback
for frames in sys._current_frames().values():
    traceback.print_stack(frames)
def print_stack()
    traceback.print_stack(sys._getframe(1))
```

```python
# gc

gc.get_objects
gc.get_referrers
gc.get_referents

import gc, greenlet, traceback
for obj in gc.get_objects():
    if instance(obj, greenlet.greenlet):
        traceback.print_stack(obj.gr_frame)
```

```python
# tracemalloc

import tracemalloc
tracemalloc.start()
# ... run your application ...
snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')
print("[ Top 10 ]")
for stat in top_stats[:10]:
    print(stat)

import tracemalloc
tracemalloc.start()
# ... start your application ...
snapshot1 = tracemalloc.take_snapshot()
# ... call the function leaking memory ...
snapshot2 = tracemalloc.take_snapshot()
top_stats = snapshot2.compare_to(snapshot1, 'lineno')
print("[ Top 10 differences ]")
for stat in top_stats[:10]:
    print(stat)
```

### 高级调试工具

- heapy
- objgraph
- pyflame
- py-spy
- pyrasite
- pyderd
- pyrings
- pytools
- dtrace、systermtap
- strace （Linux 命令工具）

## 元编程

**什么是元编程?**

【[维基百科](https://en.wikipedia.org/wiki/Metaprogramming)】Metaprogramming is a programming technique in which computer programs have the ability to treat programs as their data

即对程序有更高的控制权，可改变代码现有的行为。

元编程在 Python 中，简单的理解就是关于创建操作源代码(比如修改、生成或包装原来的代码)的函数和类。主要技术是使用装饰器、类装饰器和元类。另外还有一些其他技术，如签名对象、使用 **exec()** 执行代码以及对内部函数和类的反射技术等。

**为什么需要元编程?**

有人认为“元编程花哨，破坏抽象封装，降低可维护性和可读性”。

在 Python 中存在一些没有元编程就难以解决的问题:

- 1. 代码热更新
- 2. 对未知的数据结构做特定优化(regex, json load/dump)
- 3. 各种高级的抽象方式(generic, trait)
- 4. 更为全面的静态检查支持

**为什么需要安全高效的元编程？**

元编程本身并不和“邪恶”挂钩。合理的使用它，能够极大地提高代码的可读性、可靠性、可维护性、执行效率，并增强抽象封装，还能提高开发者的编写效率：

- 1、支持静态检查。用代码生成扩展 python type hinting，获得强力补全和编译期错误检查，实现面向合同编程
- 2、支持声明式编程。开发者之处必要信息，用 DSL 对此信息进行分析，生成可读并安全可靠的静态优化程序
- 3、为运行时增加程序监控器，收集信息，对部分程序进行多种优化。将运行时拆分为过个时期，应用优化技术

## 其他

### GIL

GIL(Global Interpreter Lock)，即全局解释器锁。其是进程内的全局锁，用于保护共享变量。常见的 IO 会释放 GIL。

Python 在调用其他语言时会释放 GIL，如 ctypes 调用动态库时会释放 GIL

### MRO

MRO(Method Resolution Order)，即方法解析顺序。旧式的 MRO 已经很好解决的继承的二义性问题：

```python
>>> class A: pass
>>> class B(A): pass
>>> class C(A): pass
>>> class D(B, C): pass
>>> import inspect
>>> inspect.getmro(D)  # 输出结果经过人工美化
(D, B, A, C)
```

解决完了二义性问题，那么还有什么问题?

- 本地优先级:根据声明顺序查找类，比如 D(B, C)，那么要先找 B 然后找 C
- 单调性:如果类 C 的解释顺序在 A 之后，那么在所有子类中也要保证这个顺序

新式的 MRO 采用 **C3 线性算法实现**。基于 C3 线性化算法的 MRO 要解决的就是本地优先级和单调性的问题。C3 线性算法的其他应用：singledispatch。

**总结与建议：**

- 从 Python 2.3 以后已经完美的解决了二义性、本地优先级、单调性
- 你需要理解 MRO ，但是不要刻意为了炫技去使用它，除非你在写一个框架
- 无论在任何时候不要使用多继承，C++ 已经用历史证明，这并不好用
- 不浪费多继承功能，应该多使用 Mixin 去替代多继承，比如 Django

### 编程原则

- 好代码应有的特点：可读性高，逻辑清晰，高内聚，低耦合，易测试
- 尽量使用组合而不是继承 （如在类中直接使用其他类的实例，尽量使用 Mixin）
- 使用 abc 模块
- 每一个代码块、函数、类、模块都只做单一的事情
- 先把业务模块划分清楚，而不是一上来就考虑技术细节（使用什么设计模式、存储等等）


**Huoty**  2018.10.14
