---
layout: post
title: Python上下文管理器与with语句
category: Python
tags: python with 上下文管理器
---

## 什么是上下文管理器
上下文管理器顾名思义是管理上下文的,也就是负责冲锋和垫后,而让主人专心完成自己的事情。我们在编写程序的时候，通常会将一系列操作放到一个语句块中，当某一条件为真时执行该语句快。有时候，我们需要再执行一个语句块时保持某种状态，并且在离开语句块后结束这种状态。例如对文件的操作，我们在打开一个文件进行读写操作时需要保持文件处于打开状态，而等操作完成之后要将文件关闭。所以，上下文管理器的任务是：**代码块执行前准备，代码块执行后收拾**。上下文管理器是在Python2.5加入的功能，它能够让你的代码可读性更强并且错误更少。

## 需求的产生
在正常的管理各种系统资源(文件、锁定和连接)，在涉及到异常时通常是个棘手的问题。异常很可能导致控制流跳过负责释放关键资源的语句。例如打开一个文件进行操作时，如果意外情况发生（磁盘已满、特殊的终端信号让其终止等），就会抛出异常，这样可能最后的文件关闭操作就不会执行。如果这样的问题频繁出现，则可能耗尽系统资源。

是的，这样的问题并不是不可避免。在没有接触到上下文管理器之前，我们可以用`“try/finally”`语句来解决这样的问题。或许在有些人看来，“try/finally”语句显得有些繁琐。上下文管理器就是被设计用来简化“try/finally”语句的，这样可以让程序更加简洁。

## With语句
With语句用于执行上下文操作，它也是复合语句的一种，其基本语法如下所示：

```python
with context_expr [as var]:
    with_suite
```

With 语句仅能工作于支持上下文管理协议(context management
protocol)的对象。也就是说只有内建了"上下文管理"的对象才能和 with 一起工作。Python内置了一些支持该协议的对象，如下所列是一个简短列表：

- file
- decimal.Context
- thread.LockType
- threading.Lock
- threading.RLock
- threading.Condition
- threading.Semaphore
- threading.BoundedSemaphore

由以上列表可以看出，file 是已经内置了对上下文管理协议的支持。所以我们可以用下边的方法来操作文件：

```python
with open('/etc/passwd', 'r') as f:
    for eachLine in f:
        # ...do stuff with eachLine or f...
```

上边的代码试图打开一个文件,如果一切正常,把文件对象赋值给 f。然后用迭代器遍历文件中的每一行,当
完成时,关闭文件。无论是在这一段代码的开始,中间,还是结束时发生异常,会执行清理的代码,此
外文件仍会被自动的关闭。

## 自定义上下文管理器
要实现上下文管理器，必须实现两个方法：一个负责进入语句块的准备操作，另一个负责离开语句块的善后操作。Python类包含两个特殊的方法，分别名为：`__enter__` 和 `__exit__`。

- \_\_enter\_\_: 该方法进入运行时上下文环境，并返回自身或另一个与运行时上下文相关的对象。返回值会赋给 as 从句后面的变量，as 从句是可选的。

- \_\_exit\_\_: 该方法退出当前运行时上下文并返回一个布尔值，该布尔值标明了“如果 with_suit 的退出是由异常引发的，该异常是否须要被忽略”。如果 \_\_exit\_\_() 的返回值等于 False，那么这个异常将被重新引发一次；如果 \_\_exit\_\_() 的返回值等于 True，那么这个异常就被无视掉，继续执行后面的代码。

With 语句的实际执行流程是这样的：
<div class="hblock"><pre>
1. 执行 context_exp 以获取上下文管理器
2. 加载上下文管理器的 __exit__() 方法以备稍后调用
3. 调用上下文管理器的 __enter__() 方法
4. 如果有 as var 从句，则将 __enter__() 方法的返回值赋给 var
5. 执行子代码块 with_suit
6. 调用上下文管理器的 __exit__() 方法，如果 with_suit 的退出是由异常引发的，那么该异常的 type、value 和 traceback 会作为参数传给 __exit__()，否则传三个 None
7. 如果 with_suit 的退出由异常引发，并且 __exit__() 的返回值等于 False，那么这个异常将被重新引发一次；如果 __exit__() 的返回值等于 True，那么这个异常就被无视掉，继续执行后面的代码
</pre></div>

下面我们自己来实现一个支持上下文管理协议的文件操作：

```python
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  contextfile.py
#       Author @  Huoty
#  Create date @  2015-08-08 17:02:13
#  Description @  
# *************************************************************

filename = 'my_file.txt'
mode = 'w' # Mode that allows to write to the file
writer = open(filename, mode)

class PypixOpen(object):
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode

    def __enter__(self):
        self.openedFile = open(self.filename, self.mode)
        return self.openedFile

    def __exit__(self, *unused):
        self.openedFile.close()

# Script starts from here

with PypixOpen(filename, mode) as writer:
    writer.write("Hello World from our new Context Manager!")
```

<br/>
## 更加优雅的上下文管理（contextlib模块）

`contextlib`模块提供更易用的上下文管理器。

#### contextlib.closing

`contextlib.closing` 方法在语句块结束后调用对象的 close 方法。

```python
from contextlib import closing
import urllib

with closing(urllib.urlopen('http://www.python.org')) as page:
    for line in page:
        print line
```

#### contextlib.nested

`contextlib.nested` 方法用于替换嵌套的 with 语句。例如，有两个文件，一个读一个写，即进行拷贝。以下是不提倡的用法：

```python
with open('toReadFile', 'r') as reader:
    with open('toWriteFile', 'w') as writer:
        writer.writer(reader.read())
```

这里可以用 contextlib.nested 进行优化：

```python
with contextlib.nested(open('fileToRead.txt', 'r'), \
           open('fileToWrite.txt', 'w')) as (reader, writer):
    writer.write(reader.read())
```

#### contextlib.contextmanager

`contextlib.contextmanager` 是一个装饰器，它可以用来装饰被 yield 语句分割成两部分的函数，以此进行上下文管理。任何在yield之前的内容都可以看做在代码块执行前的操作，而任何yield之后的操作都可以看做是代码块结束后要做的操作。如果希望在上下文管理器中使用 “as” 关键字，那么就用 yield 返回你需要的值，它将通过 as 关键字赋值给新的变量。

```python
from contextlib import contextmanager

@contextmanager
def tag(name):
    print "<%s>" % name
    yield
    print "</%s>" % name
```

使用 contextlib.contextmanager 时，可以大致套用如下的框架：

```python
from contextlib import contextmanager

@contextmanager
def closing(thing):
    try:
        yield thing
    finally:
        thing.close()
```
