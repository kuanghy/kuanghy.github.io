---
layout: post
title: "Python new 类方法和 init 实例方法以及单例模式的简单讨论"
keywords: new init singleton 单例模式 实例 构造方法 元类
description: "Python new 类方法和 init 实例方法以及单例模式的简单讨论"
category: Python
tags: python
---

**Python 中的类都是单例模式？** 有些人肯定会对这个问题感到奇怪，这里先不做回答，我们先来看看 `__new__` 和 `__init__` 方法。

`__new__` 属于新式类，即属于object 类。它是一个静态方法，但是其第一个参数必须是一个类(cls)，这有点像一个 classmethod。该特殊方法被调用时，会创建类(cls)的一个新实例并返回，实例被创建后解释器会将该实例以及其它的参数传递给该实例的初始化函数 `__init__`，以对实例进行初始化。

所以，`__new__` 方法是一个类方法，用于创建一个实例，而 `__init__` 方法是一个实例方法，用于初始化一个实例。

`__new__` 方法在实例化一个类时被调用，重写该方法应该像如下的形式：

```python
class A(object):

    def __new__(self, cls, *args, **kwargs)
        return super(A, cls).__new__(cls, *args, **kwargs)
```

如果 `__new__` 方法不返回 cls 的一个实例，那么新的实例的 `__init__` 方法不会被调用。

`__init__` 方法在实例被创建之后被调用，该方法仅仅是对 `__new__` 方法创建的实例进行一些初始化操作。

可以来做一下验证：

```python
class Foo(object):

    def __new__(cls, m, n):
        print "__new__ is called"
        return super(Foo, cls).__new__(cls, m, n)

    def __init__(self, m, n):
        print "__init__ is called"
        self.m = m
        self.n = n

    def __repr__(self):
        return "Foo(m={self.m}, n={self.n})".format(self=self)

    def __str__(self):
        return self.__repr__()


if __name__ == "__main__":
    f = Foo(1, 2)
    print f
```

输出结果：

```
__new__ is called
__init__ is called
Foo(m=1, n=2)
```

于是可以得出结论：

- 1、 `__new__` 属于类级别的方法，即使没有被 classmethod 装饰，其决定生成实例的过程。
- 2、 `__init__` 属于实例级别的方法，决定实例初始化的过程，比如添加属性，对初始化参数进行判断，转换等。

`__init__` 方法，在定义一个 class 的时候一般都会涉及到，也是比较常用。而 `__new__` 方法则很少会用到，那么它到底有什么用途呢？

`__new__` 方法比较常用的作用大概是：

- 1、 继承内建不可变类型时(比如int, str, tuple)，提供自定义实例化过程。因为如果在 `__init__` 方法中做都写操作可能会无效。例如：

```python
class CustomInt(int):

    def __init__(self, v):
        super(CustomInt, self).__init__(self, abs(v))

print CustomInt(-1)

# 输出：-1
```

这可能没有达到期望的效果。但可以通过重写 `__new__` 方法来实现：

```python
class CustomInt(int):

    def __new__(cls, v):
        return super(CustomInt, cls).__new__(cls, abs(v))

print CustomInt(-1)

# 输出：1
```

- 2、 实现自定义的元类(metaclass)。元类就是用来定义如何创建类，它的概念可能稍微复杂些，这里不做详细讨论。

- 3、 实现单例。由于类产生实例的过程是通过 `__new__` 方法来控制的，因此重写该方法来单例模式是非常方便的:

```python
class Singleton(object):

    def __new__(cls):
        if not hasattr(cls, "_instance"):
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

assert Singleton() is Singleton()  # 断言成功
```

所谓单例模式就是每次初始化都返回同一个实例，所以两次初始化得到的对象的内存地址应该是一样的：

```python
print Singleton(), Singleton()
```

结果应该是显而易见的：

```
<__main__.Singleton object at 0x10d698650> <__main__.Singleton object at 0x10d698650>
```

那么我们再来看一个“奇怪”的现象：

```python
>>> class A(object):
...     pass
...
>>> print A(), A()
<__main__.A object at 0x104765450> <__main__.A object at 0x104765450>
>>> print A(), A()
<__main__.A object at 0x104765450> <__main__.A object at 0x104765450>
>>> print A(), A()
<__main__.A object at 0x104765450> <__main__.A object at 0x104765450>
```

是不是感觉有些难以置信，print 语句后两次创建的对象应该是不一样的，而他们却莫名奇妙的一样。这就是我讨论本文内容的原因。

一次同事问我，Python 中的类都是单例模式？我当时一脸懵逼，听了他的描述，我自己也试了下，果然存在如上所示的“奇怪”现象。于是我就去了解了 Python 单例模式的实现，在了解到 `__new__` 的实现方式时，就 想对 `__new__` 和 `__init__` 有一个更加深入的了解。于是就有了本文所讨论的内容。

接着，我想着用 is 来判断下他们是否真的是同一个实例：

```
>>> A() is A()
False
```

我没有对 CPython 的源码进行过全面的阅读，所以对其很多内部的实现机制不是太了解。我猜 Python 解释器在内部可能做了优化，像 `print A(), A()` 这样的语句，解释器认为没有必要创建不同的对象，直接返回同一个实例的引用得了。是不是觉得解释器有些自作聪明！而当 `A() is A()` 这样的表达式出现时，解释器想，我不能再自作聪明，那样可能会误导别人。可是，在 print 语句那样的用法时，就已经误导我了，我都差点开始怀疑人生了！

从语法来看，大家应该知道，我在测试时使用的 Python 2。我后来也试了下 Python 3：

```python
>>> class A():
...     pass
...
>>> print(A(), A())
<__console__.A object at 0x10fe7afd0> <__console__.A object at 0x10fed79e8>
>>> print(A(), A())
<__console__.A object at 0x10fec0cc0> <__console__.A object at 0x10feda160>
>>> print(A(), A())
<__console__.A object at 0x10fe7afd0> <__console__.A object at 0x10fed7940>
>>> A() is A()
False
```

我想，这样的结果才是不会让人困惑的。可能是 Python 社区意识到了这个问题并在 Python3 中进行了修正。这样的修正是好的，否则对于像我同事那样初次使用 Python 的人来说是很困惑的。

个人认为，Python3 对过去的一些“错误”的修正是好的。例如将 print 改为函数，提供了丰富的参数来控制输出的样式；对编码的调整等等。

Python 中还有很多令人“匪夷所思”的“奇怪”现象，感兴趣可以看看这篇博客：[Python Oddity](https://oswalpalash.com/python-oddity/)。例如其中提到的对整数的对比，其就是因为 Python 对小整数对象([-5,256])进行了缓存，对于这个问题也有人进行了详细的描述：[Python解惑：整数比较](https://foofish.net/python-int-mystery.html)。

## 参考资料

- [https://docs.python.org/2/reference/datamodel.html](https://docs.python.org/2/reference/datamodel.html#object.__new__)
