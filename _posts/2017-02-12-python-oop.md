---
layout: post
title: "Python 面向对象编程的一些知识点总结"
keywords: Python 面向对象 属性 方法 私有化 绑定方法 属性 slots
description: "Python 面向对象编程的一些知识点总结"
category: Python
tags: python
---

### 类与实例

类是对象的定义，而实例是"真正的实物"，它存放了类中所定义的对象的具体信息。

### 类、属性和方法命名规范

类名通常由大写字母打头。这是标准惯例，可以帮助你识别类，特别是在实例化过程中（有时看起来像函数调用）。还有，数据属性（变量或常量）听起来应当是数据值的名字，方法名应当指出对应对象或值的行为。

另一种表达方式是：数据值应该使用名词作为名字，方法使用谓词（动词加对象）。数据项是操作的对象、方法应当表明程序员想要在对象进行什么操作。

在定义的类中，大致遵循这样的方针，数据值像 “name”， “phone” 和 “email”，行为如 “updatePhone”，“updateEmail”。这就是常说的 “混合记法(mixedCase)” 或 “骆驼记法(camelCase)”。Python 规范推荐使用骆驼记法的下划线方式，比如， “update_phone”，“update_email”。类也要细致命名，像 “AddrBookEntry”， “RepairShop” 等等就是很好的名字。

```python
class AddrBookEntry(object):

    def __init__(self, name, phone, email):
        self.name = name
        self.phone = phone
        self.email = email

    def update_phone(self, phone):
        self.phone = phone

    def update_email(self. email):
        self.email = email
```

### 新式类与旧式类

新式类和经典类声明的最大不同在于，所有新式类必须继承至少一个父类。如果没有可继承的类，则可继承 object 类。object 是“所有类之母” ，它位于所有类继承结构的最上层。如果没有直接或间接的子类化一个对象，那么就定义了一个经典类。即如果没有指定一个父类，或者如果所子类化的基本类没有父类，这样就是创建了一个经典类。

在 Python3 中定义的类，默认就是新式类，而在 Python2 中要定义一个新式类则必须继承 object 或者继承一个新式类。

### self 变量

类的方法与普通的函数只有一个特别的区别，即它们必须有一个额外的第一个参数名称，但是在调用这个方法的时候你不必为这个参数赋值，Python 会提供这个值。这个特别的变量指对象本身，按照惯例它的名称是 self。虽然可以给这个参数任何名称，但是强烈建议使用 self 这个名称，其他名称都是不赞成使用的。

### `__init__()` 方法

`__init__()` 类似于类构造器，但实际上并不是一个构造器。Python 创建实例后，在实例化过程中，调用 `__init__()` 方法，当一个类被实例化时，就可以定义额外的行为，比如，设定初始值或者运行一些初步诊断代码，这主要是在实例被创建后，实例化调用返回这个实例之前，去执行某些特定的任务或设置。

### 绑定及非绑定方法

在 Python 中，访问类的方法可以通过实例也可以通过类来直接访问。但是 Python 严格要求，没有实例，方法是不能被调用的。这种限制即 Python 所描述的绑定概念(binding)，在此，方法必须绑定（到一个实例）才能直接被调用。非绑定的方法可能可以被调用，但实例对象一定要明确给出，才能确保调用成功。然而，不管是否绑定，方法都是它所在的类的固有属性，即使它们几乎总是通过实例来调用的。在 Python 中的类方法也是一种对象。可以简单的理解就是，通过类直接访问的方法称为“未绑定的方法”，而通过实例访问的方法称为“绑定的方法”：

**1. 未绑定的类方法：**没有 self

通过类来引用方法返回一个未绑定方法对象。要调用它，你必须显示地提供一个实例作为第一个参数。

**2. 绑定的实例方法：**有 self

通过实例访问方法返回一个绑定的方法对象。Python 自动地给方法绑定一个实例，所以我们调用它时不用再传一个实例参数。

示例：

```python
class Test:
    def func(self, message):
        print message

object1 = Test()
x = object1.func
x("绑定方法对象，实例是隐藏的")

t = Test.func
t(object1, "未绑定方法对象，需要传递一个实例")
# t("未绑定方法对象，需要传递一个实例")  # 错误的调用
```

### 类属性与实例属性

类属性仅是与类相关的数据值，和实例属性不同，类属性和实例无关。这些值像静态成员那样被引用，即使在多次实例化中调用类，它们的值都保持不变。不管如何，静态成员不会因为实例而改变它们的值，除非实例中显式改变它们的值。 实例属性与类属性的比较，类似于自动变量和静态变量，但这只是笼统的类推。在你对自动变量和静态变量还不是很熟的情况下，不要深究这些。

类和实例都是名字空间。类是类属性的名字空间，实例则是实例属性的。

可采用类来访问类属性，如果实例没有同名的属性的话，也可以用实例来访问。

### 私有化

Python并不直接支持私有方式，而要靠程序员自己把握在外部进行特性修改的时机。

为了让方法或者特性变为私有（从外部无法访问），只要在它的名字前面加上双下划线即可。由双下划线 `__` 开始的属性在运行时被“混淆”，所以直接访问是不允许的。

实际上，在 Python 带有双下划线的属性或方法并非正真意义上的私有，它们仍然可以被访问。在类的内部定义中，所有以双下划线开始的名字都被“翻译”成前面加上单下划线和类名的形式：

```python
>>> class TestObj(object):
...     __war = "world"
...     
...     def __init__(self):
...         self.__har = "hello"
...         
...     def __foo(self):
...         print(self.__har + self.__war)
...         
...     
...
>>> t = TestObj()
>>> dir(t)
['_TestObj__foo', '_TestObj__har', '_TestObj__war', '__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getat
tribute__', '__gt__', '__hash__', '__init__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__
', '__sizeof__', '__str__', '__subclasshook__', '__weakref__']
>>> t.__war
Traceback (most recent call last):
  File "<input>", line 1, in <module>
    t.__war
AttributeError: 'TestObj' object has no attribute '__war'
>>> t.__har
Traceback (most recent call last):
  File "<input>", line 1, in <module>
    t.__har
AttributeError: 'TestObj' object has no attribute '__har'
>>> t.foo()
Traceback (most recent call last):
  File "<input>", line 1, in <module>
    t.foo()
AttributeError: 'TestObj' object has no attribute 'foo'
>>> t._TestObj__war
'world'
>>> t._TestObj__har
'hello'
>>> t._TestObj__foo()
helloworld
```

### `__slots__` 类属性

正常情况下，当我们定义了一个 class，创建了一个 class 的实例后，我们可以给该实例绑定任何属性和方法，这就是动态语言的灵活性。在 Python 中默认用字典来存储实例的属性。示例：

```
>>> class A():
...     pass
...
>>> a = A()
>>> a.name = "huoty"
>>> a.age = 25
>>> print a.name
huoty
>>> print a.age
25
>>> a.__dict__
{'age': 25, 'name': 'huoty'}
```

字典位于实例的“心脏” 。`__dict__`属性跟踪所有实例属性。举例来说，你有一个实例 inst，它有一个属性 foo，那使用 inst.foo 来访问它与使用 `inst.__dict__['foo']` 来访问是一致的。

字典会占据大量内存，如果你有一个属性数量很少的类，但有很多实例，那么正好是这种情况。为内存上的考虑，可以使用 `__slots__` 属性来替代 `__dict__`。

，`__slots__` 是新式类的特性。基本上，`__slots__` 是一个类变量，由一序列对象组成，由所有合法标识构成的实例属性的集合来表示。它可以是一个列表，元组或可迭代对象。也可以是标识实例能拥有的唯一的属性的简单字符串。任何试图创建一个其名不在 `__slots__` 中的名字的实例属性都将导致 AttributeError 异常：

```python
>>> class SlotedClass(object):
...     __slots__ = ("foo", "bar")
...     
...
>>> c = SlotedClass()
>>> c.foo = 42
>>> c.bar = "hello"
>>> c.goo = "don't think so"
Traceback (most recent call last):
  File "&lt;input>", line 1, in &lt;module>
AttributeError: 'SlotedClass' object has no attribute 'goo'
```

这种特性的主要目的是节约内存。其副作用是某种类型的"安全",它能防止用户随心所欲的动态增加实例属性。带 `__slots__` 属性的类定义不会存在 `__dict__` 了（除非你在 `__slots__` 中增加 `__dict__` 元素）。
