---
layout: post
title: "Python 对象属性的访问"
keywords: Python dict attribute 描述符
description: "Python 访问属性时会按照优先级链的顺序取搜索属性"
category: Python
tags: Python 属性
---

在 Python 中，解释器将按照如下的优先级顺序在对象中搜索属性:

- 1. 类属性
- 2. 数据描述符（也被称为资料描述符，data desctiptor）
- 3. 实例属性
- 4. 非数据描述符

Python 对象当前可用的属性和方法都保存在 `__dict__` 字典中。但并不是所有的对象都有 `__dict__` 这个属性，例如实现了 `__slots__` 属性的类的对象则就没，拥有 `__slots__` 属性的类在实例化对象时不会自动分配 `__dict__`， 只有在 `__slots__` 中的属性才能被之用， 但它的设置只对对象真正的属性有限制作用，如果是用 property 修饰的属性以及属性是一个描述符对象时是不受限制的。

下面来了解下与对象属性访问有关的几个方法：

- `__get__`

该方法用来实现 Python 的描述器，与 `__set__`、`__delete__` 一样属于描述符协议的一员。同时实现了 `__get__` 和 `__set__` 的称之为资料描述器（data descriptor），仅仅实现 `__get__` 的则为非描述器，这两个概念涉及到属性的搜索优先级顺序问题。

- `__getattr__`

在访问对象的属性时，首先需要从 `object.__dict__` 属性中搜索该属性，再从 `__getattr__` 方法中查找。该方法与 `__setattr__`、`__delattr__` 方法一样，在访问的属性不存在时被调用。这是 Python 动态语言特性的体现。可以对这三个方法进行重载来实现一些特殊的需求。例如：

```python
class Foo(object):
    def __init__(self):
        pass

    def __getattr__(self, key):
        try:
            return self.__dict__[key]
        except KeyError:
            return None

    def __setattr__(self, key, value):
        self.__dict__[key] = value

    def __delattr__(self, key):
        try:
            del self.__dict__[key]
        except KeyError:
            return None


# Script starts from here

if __name__ == "__main__":
    f = Foo()
    print f.bar
    f.bar = 10
    print f.bar
    del f.bar

# 执行结果：
#   None
#   10
```

- `__getattribute__`

该方法会在每次查找属性和方法时无条件的被调用。在优先级链中，类字典中发现的数据描述符的优先级高于实例变量，实例变量优先级高于非数据描述符，如果提供了 `__getattr__()`，优先级链会为 `__getattr__()` 分配最低优先级。

还有一个与字典相关的方法，这个方法虽然与属性访问无关，这里也做一下简单的介绍。

- `__missing__`

这个方法属于字典，当访问的键不存在时，`dict.__getitem__()` 方法会自动调用该方法。需要注意的是 dict 中并没这个方法，需要在子类中实现。示例：

```python
class FooDict(dict):
    def __missing__(self, key):
        self[key] = "Yes"
        return "Yes"

if __name__ == "__main__":
    fdict = FooDict()
    print fdict
    print fdict["bar"]

# 执行结果：
#   {}
#   Yes
```

可以用该方法来实现一个缺省字典：

```python
class defaultdict(dict):
    def __init__(self, default_factory=None, *a, **kw):
      dict.__init__(self, *a, **kw)
      self.default_factory = default_factory

    def __missing__(self, key):
      self[key] = value = self.default_factory()
      return value
```
