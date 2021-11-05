---
layout: post
title: "Python 对象属性的访问"
keywords: Python dict attribute 描述符 属性
description: "Python 访问属性时会按照优先级链的顺序取搜索属性"
category: Python
tags: python
---

在 Python 中，一切皆对象。属性访问可以理解为是从一个已有的对象中获得另一个对象的方法。对象属性的访问涉及到对象的 `__dict__` 属性、描述符等概念，以及 `__getattribute__`、`__getattr__` 等方法。

## 对象字典属性

Python 中的对象有一个 `__dict__` 属性，其是一个字典类型，对象当前可用的属性和方法都保存在合格字典中。它存储着对象属性的名称与值的键值对。示例(在 Python 2.7 环境测试)：

```python
>>> class C(object):
...     x = 1
...
>>> C.__dict__
dict_proxy({
    '__dict__': <attribute '__dict__' of 'C' objects>,
    'x': 1, '__module__': '__console__',
    '__weakref__': <attribute '__weakref__' of 'C' objects>,
    '__doc__': None
})
>>> c = C()
>>> c.__dict__
{}
>>> c.y = 1
>>> c.__dict__
{'y': 1}
>>> c.x
1
>>> c.x = 2
>>> c.x
2
>>> C.x
1
>>> c.__dict__
{'y': 1, 'x': 2}
```

由上例应该注意到，类变量 x 存储在类 C 的 dict 属性中，而由 C 初始化的对象 c 的属性 y 则在 c 的 dict 中。对象 c 仍然可以访问其类型 C 中的类变量 x。但是，如果在对象 c 中重新设置属性 x 之后，则 C 与 c 中各自有自己的 x 属性，此时 c.x 不再访问其类的属性，而是访问自己的 x 属性。

还应注意到，类对象的 `__dict__` 属性为普通的 dict 类型，而类定义的 `__dict__` 则为 dict_proxy 类型（在 Python3 中为 mappingproxy 类型）。类对象的该属性是可以被直接修改的，而类的却不行。因为类的 `__dict__` 是只读的，所以其命名中被加入了 proxy 字眼，这样做的目的是为了防止其被意外修改而导致意想不到的错误发生。

```python
>>> c.__dict__['x'] = 5
>>> C.__dict__['x'] = 6
Traceback (most recent call last):
  File "<input>", line 1, in <module>
    C.__dict__['x'] = 6
TypeError: 'dictproxy' object does not support item assignment
>>> c.x
5
>>> C.x
1
>>> c.__dict__ = {}
>>> C.__dict__ = {}
Traceback (most recent call last):
  File "<input>", line 1, in <module>
    C.__dict__ = {}
AttributeError: attribute '__dict__' of 'type' objects is not writable
>>> c.__dict__
{}
>>> c.x
1
>>> C.x
1
```

并不是所有的对象都有 `__dict__` 这个属性，例如实现了 `__slots__` 属性的类的对象。拥有 `__slots__` 属性的类在实例化对象时不会自动分配 `__dict__`， 只有在 `__slots__` 中的属性才能被使用，但它的设置只对对象真正的属性有限制作用。如果是用 property 修饰的属性以及属性是一个描述符对象时是不受限制的。

## 描述符

描述符是实现了描述符协议的对象，本质上是一种拥有绑定行为的对象属性。描述符的访问行为被如下的描述符协议方法覆盖：

```python
__get__(self, obj, type=None) --> value

__set__(self, obj, value) --> None

__delete__(self, obj) --> None
```

描述符协议只是一种在模型中引用属性时指定将要发生事件的方法。实现了以上描述符协议三个方法中任意一个的对象即是描述符。同时定义了 `__get__` 和 `__set__` 方法的对象就叫作 **数据描述符(Data Descriptor)**，也被成为资源描述符。而只定义了 `__get__` 方法的对象被叫做 **非数据描述符(Non-data Descriptor)**。实际上类方法(classmethod)即为一个非数据描述符。数据描述符与非数据描述会影响其被访问的顺序。如果实例中存在与数据描述符同名的属性，则会优先访问数据描述符。如果实例中存在与非数据描述符同名的属性，则优先访问实例属性。一个描述符的定义类似如下形式：

```python
class Descriptor(object):  

    def __init__(slef):
        pass

    def __get__(self, instance, owner):
        """用于访问属性

        返回属性的值，或者在所请求的属性不存在的情况下出现 AttributeError 异常
        """
        pass

    def __set__(self, instance, value):
        """用于设置属性值

        将在属性分配操作中调用，不会返回任何内容
        """
        pass

    def __delete__(self, instance):
        """用于删除属性

        控制删除操作，不会返回内容
        """
        pass
```

描述符将某种特殊类型的类的`实例`指派给另一个类的`属性`(**注意：** 这里是类属性，而不是对象属性，即描述符被分配给一个类，而不是实例)。**描述符相当于是一种创建托管属性的方法**。托管属性可以用于保护属性不受修改，对传递的值做检查，或自动更新某个依赖属性的值。下面是一个简单的示例：

```python
class Descriptor(object):

    def __init__(self, m):
        self.m = m

    def __get__(self, instance, owner):
        return instance.n * self.m

    def __set__(self, instance, value):
        if value < 0:
            raise ValueError("Negative value not allowed: %s" % value)
        instance.n = value


class Foo(object):

    bar = Descriptor(0)
    har = Descriptor(1)
    tar = Descriptor(2)
    yar = Descriptor(3)

    def __init__(self, n):
        self.n = n

"""
>>> f = Foo(10)
>>> f.bar
0
>>> f.bar = 100
>>> f.bar
0
>>> f.har
100
>>> f.har = 10
>>> f.har
10
>>> f.yar
30
>>> f.yar = 12345
>>> f.yar
37035
"""
```

Python 中的类方法装饰器 classmethod、staticmethod 实际上是一个非数据描述符，下面是他们的纯 Python 实现示例：

```python
class StaticMethod(object):

    def __init__(self, f):
        self.f = f

    def __get__(self, instance, owner):
        return self.f


class ClassMethod(object):

    def __init__(self, f):
        self.f = f

    def __get__(self, instance, owner):
        if owner is None:
            owner = type(instance)

        def _func(*args):
            return self.f(owner, *args)

        return _func
```

此外，Python 的 property 则是一个非数据描述符，它将对象属性的访问转化为方法调用。类中的 property 装饰器有一个缺陷，每次试图访问 property 属性时其装饰的函数都会被调用，而有时候可能只希望函数被调用一次。于是，可以模仿 property 来实现一个惰性属性(lazy property)，即在必要的时候（属性被真正访问到时）才初始化属性。以下是惰性属性描述符的实现示例：

```python
class lazy_property(object):

    def __init__(self, func):
        self.func = func

    def __get__(self, obj, cls):
        if obj is None:
            return self
        value = obj.__dict__[self.func.__name__] = self.func(obj)
        return value
```

上例中实现一个非数据描述来达到惰性初始化属性的目的。对象惰性属性在被访问时会调用 func 初始化得到 value，然后再在对象的 `__dict__` 中设置同名的属性，下一次再访问属性时，会直接返回 `__dict__` 中保存的值，而不再去访问描述符。这里涉及到了对象属性的访问优先级顺序问题。

## 属性访问顺序

Python 在对象属性访问时会无条件调用 `__getttribute__()` 方法。在属性搜索的优先级链中，**类字典中发现的数据描述符的优先级高于实例变量，实例变量优先级高于非数据描述符**。如果提供了 `__getattr__()`，优先级链会为 `__getattr__()` 分配最低优先级。除非 `__getttribute__()` 显示调用或者抛出 AttributeError 异常，否则 `__getattr__()` 将不会被调用。

描述符的调用是通过 `_getattribute__()` 方法实现的，**重写该方法可以阻止描述符的自动调用**。数据描述符总是覆盖类实例的 `__dict__`，而非数据描述符可能会被类实例的 `__dict__` 覆盖。`_getattribute__()` 方法的实现大概类似如下形式：

```python
def __getattribute__(self, key):
    "Emulate type_getattro() in Objects/typeobject.c"
    v = object.__getattribute__(self, key)
    if hasattr(v, '__get__'):
        return v.__get__(None, self)
    return v
```

需要注意的是，重写 `__getttribute__()` 方法时，不能在其实现中使用 `self.xxx` 的形式访问自己的属性，这样会导致无限递归。而需要访问自己的属性时，应该调用基类的方法。如 `object.__getattribute__(self, name)`。

下面详细描述下对象属性的访问顺序。假设有 class C, c = C(), 那么 c.x 的执行顺序为：

- （1）如果 x 是出现在 C 或其基类的 `__dict__` 中，且是数据描述符， 那么调用其 `__get__` 方法，否则
- （2）如果 x 出现在 c 的 `__dict__` 中，那么直接返回 `c.__dict__['x']`，否则
- （3）如果 x 出现在 C 或其基类的 `__dict__` 中，那么
    - （3.1）如果 x 是非数据描述符，那么调用其 `__get__` 方法，否则
    - （3.2）返回 `__dict__['x']`
- （4）如果 C 有 `__getattr__` 方法，调用 `__getattr__` 方法，否则
- （5）抛出 AttributeError

## 处理缺失值

默认情况下，当访问的属性在对象中不存在时，会抛出 AttributeError 异常。而在有些场景中我们并不希望这样，比如在我工作的项目中，当访问一项配置时，如果该配置项不存在，我们希望其返回 None，而不是发生异常。这用 `__getattr__` 方法很容易实现，该方法通常与 `__setattr__`、`__delattr__` 方法配合使用，`__setattr__` 方法会改变属性的复制行为：

```python
class Foo(object):

    def __init__(self):
        self.x = 1

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
```

如果对象是一个字典，则当访问一个不存在的 key 时，会发生 KeyError 异常。字典也有一个方法可以用来处理缺失值，即 `__missing__`。这个方法虽然与属性访问无关，这里也做一下简单的介绍。当访问的键不存在时，`dict.__getitem__()` 方法会自动调用该方法。需要注意的是 dict 中并没这个方法，需要在子类中实现。示例：

```python
class FooDict(dict):

    def __missing__(self, key):
        self[key] = "hello"
        return "hello"

fdict = FooDict()
print fdict
print fdict["bar"]

# 执行结果：
# {}
# hello
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

## 参考资料

- [https://docs.python.org/3/howto/descriptor.html](https://docs.python.org/3/howto/descriptor.html)
- [http://python.jobbole.com/83562/](http://python.jobbole.com/83562/)
- [http://python.jobbole.com/88937/](http://python.jobbole.com/88937/)
