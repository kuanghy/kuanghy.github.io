---
layout: post
title: "Python 变量赋值问题"
keywords: Python 变量赋值 assign
description: "如果仅改变对象的属性（或者说成是改变结构），所有指向该对象的变量都会随之改变"
category: Python
tags: python
---

我们先看一下如下代码:

```python
c = {}

def foo():
    f = dict(zip(list("abcd"), [1, 2 ,3 ,4]))
    c.update(f)

if __name__ == "__main__":
    a = b = d = c

    b['e'] = 5
    d['f'] = 6

    foo()

    print(a)
    print(b)
    print(c)
    print(d)
```

输入结果：

```
{'a': 1, 'c': 3, 'b': 2, 'e': 5, 'd': 4, 'f': 6}
{'a': 1, 'c': 3, 'b': 2, 'e': 5, 'd': 4, 'f': 6}
{'a': 1, 'c': 3, 'b': 2, 'e': 5, 'd': 4, 'f': 6}
{'a': 1, 'c': 3, 'b': 2, 'e': 5, 'd': 4, 'f': 6}
```

如果你对以上输出结果不感到奇怪，那么就不必往下看了。实际上本文要讨论的内容非常简单，不要为此浪费您宝贵的时间。

Python 属于动态语言，程序的结构可以在运行的过程中随时改变，而且 python 还是弱类型的语言，所以如果你是从静态、强类型编程语言转过来的，理解起 Python 的赋值，刚开始可能会感觉有些代码有点莫名其妙。可能你会以为上面代码的输出会是这样的：

```
{}
{'e': 5}
{}
{'f': 6}
```

你可能认为 a 没有被改变，因为没有看到哪里对它做了改变；b 和 d 的改变是和明显的；c 呢，因为是在函数内被改变的，你可能认为 c 会是一个局部变量，所以全局的 c 不会被改变。

实际上，这里的 a, b, c, d 同时指向了一块内存空间，这可内存空间保存的是一个字典对象。这有点像 c 语言的指针，a, b, c, d 四个指针指向同一个内存地址，也就是给这块内存其了 4 个笔名。所以，不管你改变谁，其他三个变量都会跟着变化。那为什么 c 在函数内部被改变，而且没有用 global 申明，但全局的 c 去被改变了呢？我们再来看一个例子：

```
>>>a = {1:1, 2:2}
>>>b = a
>>>a[3] = 3
>>>b
{1: 1, 2: 2, 3: 3}
>>>a = 4
>>>b
{1: 1, 2: 2, 3: 3}
>>>a
4
```

当 `b = a` 时，a 与 b 指向同一个对象，所以在 a 中添加一个元素时，b 也发生变化。而当 `a = 4` 时， a 就已经不再指向字典对象了，而是指向一个新的 int 对象（python 中整数也是对象），这时只有 b 指向字典，所以 a 改变时 b 没有跟着变化。这是只是说明了什么时候赋值变量会发生质的改变，而以上的问题还没有被解决。那么，我么再来看一个例子：

```python
class TestObj(object):
    pass

x = TestObj()
x.x = 8
d = {"a": 1, "b": 2, "g": x}
xx = d.get("g", None)
xx.x = 10
print("x.x:%s" % x.x)
print("xx.x: %s" % xx.x)
print("d['g'].x: %s" % d['g'].x)

# Out:
# x.x:10
# xx.x: 10
# d['g'].x: 10
```

由以上的实例可以了解到，**如果仅改变对象的属性（或者说成是改变结构），所有指向该对象的变量都会随之改变**。但是如果一个变量重新指向了一个对象，那么其他指向该对象的变量不会随之变化。所以，最开始的例子中，c 虽然在函数内部被改变，但是 c 是全局的变量，我们只是在 c 所指向的内存中添加了一个值，而没有将 c 指向另外的变量。

需要注意的是，有人可能会认为上例中的最后一个输出应该是 `d['g'].x: 8`。 这样理解的原因可能是觉得已经把字典中 'g' 所对应的值取出来了，并重新命名为 xx，那么 xx 就与字典无关了。其实际并不是这样的，字典中的 key 所对应的 value 就像是一个指针指向了一片内存区域，访问字典中 key 时就是去该区域取值，如果将值取出来赋值给另外一个变量，例如 `xx = d['g']` 或者 `xx = d.get("g", None)`，这样只是让 xx 这个变量也指向了该区域，也就是说字典中的键 'g' 和 xx 对象指向了同一片内存空间，当我们只改变 xx 的属性时，字典也会发生变化。下例更加直观的展示了这一点：

```python
class TestObj(object):
    pass

x = TestObj()
x.x = 8
d = {"a": 1, "b": 2, "g": x}
print(d['g'].x)
xx = d["g"]
xx.x = 10
print(d['g'].x)
xx = 20
print(d['g'].x)

# Out:
# 8
# 10
# 10
```

这个知识点非常简单，但如果没有理解，可能无法看明白别人的代码。这一点有时候会给程序设计带来很大的便利，例如设计一个在整个程序中保存状态的上下文：

```python
class Context(object):
    pass


def foo(context):
    context.a = 10
    context.b = 20
    x = 1

def hoo(context):
    context.c = 30
    context.d = 40
    x = 1

if __name__ == "__main__":
    context = Context()
    x = None
    foo(context)
    hoo(context)
    print(x)
    print(context.a)
    print(context.b)
    print(context.c)
    print(context.d)

# Out：
# None
# 10
# 20
# 30
# 40
```

示例中我们可以把需要保存的状态添加到 context 中，这样在整个程序的运行过程中这些状态能够被任何位置被使用。

在来一个终结的例子，执行外部代码：

- outer_code.py

```python
from __future__ import print_function

def initialize(context):
    g.a = 333
    g.b = 666
    context.x = 888

def handle_data(context, data):
    g.c = g.a + g.b + context.x + context.y
    a = np.array([1, 2, 3, 4, 5, 6])
    print("outer space: a is %s" % a)
    print("outer space: context is %s" % context)
```

- main_exec.py

```python
from __future__ import print_function

import sys
import imp
from pprint import pprint

class Context(object):
    pass

class PersistentState(object):
    pass


# Script starts from here

if __name__ == "__main__":
    outer_code_moudle = imp.new_module('outer_code')
    outer_code_moudle.__file__ = 'outer_code.py'
    sys.modules["outer_code"] = outer_code_moudle
    outer_code_scope = code_scope = outer_code_moudle.__dict__

    head_code = "import numpy as np\nfrom main_exec import PersistentState\ng=PersistentState()"
    exec(head_code, code_scope)
    origin_global_names = set(code_scope.keys())

    with open("outer_code.py", "rb") as f:
        outer_code = f.read()

    import __future__
    code_obj = compile(outer_code, "outer_code.py", "exec", flags=__future__.unicode_literals.compiler_flag)
    exec(code_obj, code_scope)
    # 去除掉内建名字空间的属性，仅保留外部代码中添加的属性
    outer_code_global_names = set(outer_code_scope.keys()) - origin_global_names

    outer_func_initialize = code_scope.get("initialize", None)
    outer_func_handle_data = code_scope.get("handle_data", None)

    context = Context()
    context.y = 999
    outer_func_initialize(context)
    outer_func_handle_data(context, None)

    g = outer_code_scope["g"]
    assert g.c == 2886
    print("g.c: %s" % g.c)
    print(dir(g))
    print(dir(context))
    pprint(outer_code_moudle.__dict__)
```
