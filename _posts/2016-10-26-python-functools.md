---
layout: post
title: "Python 模块简介 -- functools"
keywords: Python functools 装饰器
description: "Python的functools模块可以说主要是为函数式编程而设计，用于增强函数功能"
category: Python
tags: python
---

Python 的 functools 模块可以说主要是为函数式编程而设计，用于增强函数功能。

#### functools.partial

用于创建一个偏函数，它用一些默认参数包装一个可调用对象，返回结果是可调用对象，并且可以像原始对象一样对待，这样可以简化函数调用。实际上 partial 相当于一个高阶函数，其大致的实现如下（实际在标准库中它是用 C 实现的）：

```python
def partial(func, *args, **keywords):
    def newfunc(*fargs, **fkeywords):
        newkeywords = keywords.copy()
        newkeywords.update(fkeywords)
        return func(*(args + fargs), **newkeywords)
    newfunc.func = func
    newfunc.args = args
    newfunc.keywords = keywords
    return newfunc
```

一个简单的使用示例：

```python
from functools import partial

def add(x, y):
    return x + y

add_y = partial(add, 3)  # add_y 是一个新的函数
add_y(4)
```

一个很实用的例子：

```python
def json_serial_fallback(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, (datetime.datetime, datetime.date)):
        return str(obj)
    if isinstance(obj, bytes):
        return obj.decode("utf-8")
    raise TypeError ("%s is not JSON serializable" % obj)

json_dumps = partial(json.dumps, default=json_serial_fallback)
```

可以在 `json_serial_fallback` 函数中添加类型判断来指定如何 json 序列化一个 Python 对象

#### functools.update_wrapper

用 partial 包装的函数是没有 `__name__` 和 `__doc__`，这使得依赖于这些属性的代码可能无法正常工作。`update_wrapper` 可以拷贝被包装函数的 `__name__`、`__module__`、`__doc__` 和 `__dict__` 属性到新的封装函数中去，其实现也非常简单：

```python
WRAPPER_ASSIGNMENTS = ('__module__', '__name__', '__doc__')
WRAPPER_UPDATES = ('__dict__',)
def update_wrapper(wrapper,
                   wrapped,
                   assigned = WRAPPER_ASSIGNMENTS,
                   updated = WRAPPER_UPDATES):

    for attr in assigned:
        setattr(wrapper, attr, getattr(wrapped, attr))
    for attr in updated:
        getattr(wrapper, attr).update(getattr(wrapped, attr, {}))

    return wrapper
```

`update_wrapper` 主要用在装饰器函数中，以确保被装饰的保留原理的属性。示例：

```python
def wrap(func):
    def call_it(*args, **kwargs):
        print "calling", func.__name__
        return func(*args, **kwargs)
    return call_it

@wrap
def hello():
    print "hello"

from functools import update_wrapper
def wrap2(func):
    def call_it(*args, **kwargs):
        print "calling", func.__name__
        return func(*args, **kwargs)
    return update_wrapper(call_it, func)

@wrap2
def hello2():
    print "hello2"


# Script starts from here

if __name__ == '__main__':
    print hello.__name__  # call_it
    print hello2.__name__  # hello2
```

#### functool.wraps

`wraps` 函数是为了在装饰器中方便的拷贝被装饰函数的签名，而对 `update_wrapper` 做的一个包装，其实现如下：

```python
def wraps(wrapped,
          assigned = WRAPPER_ASSIGNMENTS,
          updated = WRAPPER_UPDATES):

    return partial(update_wrapper, wrapped=wrapped,
                   assigned=assigned, updated=updated)
```

示例：

```python
from functools import wraps
def wrap3(func):
    @wraps(func)
    def call_it(*args, **kwargs):
        print "calling", func.__name__
        return func(*args, **kwargs)
    return call_it

@wrap3
def hello3(func):
    print "hello3"

print hello3.__name__  # hello3
```

#### functools.reduce

在 Python2 中等同于内建函数 reduce，但是在 Python3 中内建的 reduce 函数被移除，只能使用 `functools.reduce`。该函数的作用是将一个序列归纳为一个输出，其原型如下：

```python
reduce(function, sequence, startValue)
```

使用示例：

```python
>>> def foo(x, y):
...     return x + y
...
>>> l = range(1, 10)
>>> reduce(foo, l)
45
>>> reduce(foo, l, 10)
55
```

#### functools.cmp_to_key

在 list.sort 和 内建函数 sorted 中都有一个 key 参数，这个参数用来指定取元素的什么值进行比较，例如按字符串元素的长度进行比较：

```python
>>> x = ['hello','abc','iplaypython.com']
>>> x.sort(key=len)
>>> x
['abc', 'hello', 'iplaypython.com']
```

也就是说排序时会先对每个元素调用 key 所指定的函数，然后再排序。同时，sorted 和 list.sort 还提供了 cmp 参数来指定如何比较两个元素，但是在 Python 3 中该参数被去掉了。`cmp_to_key` 函数就是用来将老式的比较函数转化为 key 函数。用到 key 参数的函数还有 sorted(), min(), max(), heapq.nlargest(), itertools.groupby() 等。

#### functools.total_ordering

这个一个类装饰器，如果一个类实现了 `__lt__`、`__le__`、`__gt__`、`__ge__` 这些方法中的至少一个，该装饰器会自动实现其他几个方法。示例：

```python
from functools import total_ordering
@total_ordering
class Student:
    def __init__(self, firstname, lastname):
        self.firstname = firstname
        self.lastname = lastname

    def __eq__(self, other):
        return ((self.lastname.lower(), self.firstname.lower()) ==
                (other.lastname.lower(), other.firstname.lower()))

    def __lt__(self, other):
        return ((self.lastname.lower(), self.firstname.lower()) <
                (other.lastname.lower(), other.firstname.lower()))

print dir(Student)

stu = Student("Huoty", "Kong")
stu2 = Student("Huoty", "Kong")
stu3 = Student("Qing", "Lu")

print stu == stu2
print stu > stu3
```

输出结果：

```
['__doc__', '__eq__', '__ge__', '__gt__', '__init__', '__le__', '__lt__', '__module__']
True
False
```

#### functools.lru_cache

这个装饰器是在 Python3 中新加的，在 Python2 中如果想要使用可以安装第三方库 `functools32`。该装饰器用于缓存函数的调用结果，对于需要多次调用的函数，而且每次调用参数都相同，则可以用该装饰器缓存调用结果，从而加快程序运行。示例：

```python
from functools import lru_cache
@lru_cache(None)
def add(x, y):
    print("calculating: %s + %s" % (x, y))
    return x + y

print(add(1, 2))
print(add(1, 2))  # 直接返回缓存信息
print(add(2, 3))
```

输出结果：

```
calculating: 1 + 2
3
3
calculating: 2 + 3
5
```

由于该装饰器会将不同的调用结果缓存在内存中，因此需要注意内存占用问题，避免占用过多内存，从而影响系统性能。
