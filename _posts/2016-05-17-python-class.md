---
layout: post
title: "Python 面向对象编程概要"
keywords: python class
description: "面向对象的三大特性是指：封装、继承和多态"
category: Python
tags: python
---

## 面向对象三大特性

面向对象的三大特性是指：封装、继承和多态。

#### 封装

封装，顾名思义就是将内容封装到某个地方，以后再去调用被封装在某处的内容。

所以，在使用面向对象的封装特性时，需要：

- 将内容封装到某处
- 从某处调用被封装的内容

#### 继承

继承，面向对象中的继承和现实生活中的继承相同，即：子可以继承父的内容。对于面向对象的继承来说，其实就是将多个类共有的方法提取到父类中，子类仅需继承父类而不必一一实现每个方法。

Python的类如果继承了多个类，那么其寻找方法的方式有两种，分别是：深度优先和广度优先

- 当类是经典类时，多继承情况下，会按照深度优先方式查找
- 当类是新式类时，多继承情况下，会按照广度优先方式查找

旧式类示例：

```python
# coding=utf-8

class D:

    def bar(self):
        print 'D.bar'

class C(D):

    def bar(self):
        print 'C.bar'

class B(D):

    def bar(self):
        print 'B.bar'

class A(B, C):

    def bar(self):
        print 'A.bar'

a = A()
# 执行bar方法时
# 首先去A类中查找，如果A类中没有，则继续去B类中找，如果B类中么有，则继续去D类中找，如果D类中么有，则继续去C类中找，如果还是未找到，则报错
# 所以，查找顺序：A --> B --> D --> C
# 在上述查找bar方法的过程中，一旦找到，则寻找过程立即中断，便不会再继续找了
a.bar()
```

新式类示例：

```python
class D(object):

    def bar(self):
        print 'D.bar'

class C(D):

    def bar(self):
        print 'C.bar'

class B(D):

    def bar(self):
        print 'B.bar'

class A(B, C):

    def bar(self):
        print 'A.bar'

a = A()
# 执行bar方法时
# 首先去A类中查找，如果A类中没有，则继续去B类中找，如果B类中么有，则继续去C类中找，如果C类中么有，则继续去D类中找，如果还是未找到，则报错
# 所以，查找顺序：A --> B --> C --> D
# 在上述查找bar方法的过程中，一旦找到，则寻找过程立即中断，便不会再继续找了
a.bar()
```

经典类：首先去A类中查找，如果A类中没有，则继续去B类中找，如果B类中么有，则继续去D类中找，如果D类中么有，则继续去C类中找，如果还是未找到，则报错

新式类：首先去A类中查找，如果A类中没有，则继续去B类中找，如果B类中么有，则继续去C类中找，如果C类中么有，则继续去D类中找，如果还是未找到，则报错

注意：在上述查找过程中，一旦找到，则寻找过程立即中断，便不会再继续找了

#### 多态

Pyhon不支持多态并且也用不到多态，而Python崇尚“鸭子类型”。也就是说 Python 的鸭子类型相当于其他语言的多态。鸭子类型（英语：duck typing）是动态类型的一种风格。可以这样来描述鸭子模型：

> “当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。”


## self 变量

类方法的第一个参数必须是 `self`，这是类方法与普通函数的区别。`self` 变量指对象本身，虽然可以对这个变量做任意的命名，但不建议这么做，self 是一个约定俗成的用法。实例变量就是一个用 self 修饰的变量。self 将一个变量绑定到一个特定的实例上，这样它就属于这个实例自己。

## 类成员

在面向对象编程中，类的成员一般分为方法和属性，在 Python 中也可以这样来分，但鉴于 Python 类特殊的设计，以及便于理解，这里将类成员分为三大类：**字段**、**方法**和**属性**.

- 字段：
    - 普通字段
    - 静态字段

- 方法：
    - 普通方法
    - 类方法
    - 静态方法

- 属性：
    - 普通属性

这里的字段实际上就是其他编程语言中所谓的属性，因为 python 面向对象编程中有一个 property 装饰器能够将普通方法变成属性来使用，所以为了便于区别，将通俗意义上的属性称之为字段。

#### 字段

字段包括：普通字段和静态字段，实际上普通字段就是实例变量，静态字段就是类变量。他们在定义和使用中有所区别，而最本质的区别是内存中保存的位置不同：

- 静态字段在内存中只保存一份
- 普通字段在每个对象中都要保存一份

#### 方法

方法包括：普通方法、静态方法和类方法，三种方法在内存中都归属于类，区别在于调用方式不同。

- 普通方法：由对象调用；至少一个self参数；执行普通方法时，自动将调用该方法的对象赋值给self；
- 类方法：由类调用； 至少一个cls参数；执行类方法时，自动将调用该方法的类复制给cls；
- 静态方法：由类调用；无默认参数

静态方法是被`@staticmethod`装饰器修饰的方法；类方法是被`@classmethod`装饰器修饰的方法，其第一个参数是类，约定写为cls，就像实例方法的self参数一样，类对象和实例都可以调用类方法。

#### 属性　　

Python中有一个被称为属性函数(property)的小概念，它能够将类中的方法转化为只读属性。例如在需要做某些之的合并时，这个特性是非常有用的：

```python
class Person(object):
    def __init__(self, first_name, last_name):
        """Constructor"""
        self.first_name = first_name
        self.last_name = last_name

    @property
    def full_name(self):
        """
        Return the full name
        """
        return "%s %s" % (self.first_name, self.last_name)
```

由属性的定义和调用要注意一下几点：

- 定义时，在普通方法的基础上添加 @property 装饰器；
- 定义时，属性仅有一个self参数
- 调用时，无需括号

属性存在意义就是访问属性时可以制造出和访问字段完全相同的假象。但是这样创建的属性是只读的，实例无法修改其值。在新式类中提供了`@方法名.setter`装饰器来改属性的值：

```python
class Goods(object):

    @property
    def price(self):
        print '@property'

    @price.setter
    def price(self, value):
        print '@price.setter'

    @price.deleter
    def price(self):
        print '@price.deleter'

obj = Goods()
obj.price          # 自动执行 @property 修饰的 price 方法，并获取方法的返回值
obj.price = 123    # 自动执行 @price.setter 修饰的 price 方法，并将  123 赋值给方法的参数
del obj.price      # 自动执行 @price.deleter 修饰的 price 方法
```

新式类中还有一个 `@方法名.deleter` 装饰器，该装饰器在属性被 del 时被调用。

注：

> 经典类中的属性只有一种访问方式，其对应被 @property 修饰的方法
>
>新式类中的属性有三种访问方式，并分别对应了三个被@property、@方法名.setter、@方法名.deleter修饰的方法

由于新式类中具有三种访问方式，我们可以根据他们几个属性的访问特点，分别将三个方法定义为对同一个属性：获取、修改、删除:

```python
class Goods(object):

    def __init__(self):
        # 原价
        self.original_price = 100
        # 折扣
        self.discount = 0.8

    @property
    def price(self):
        # 实际价格 = 原价 * 折扣
        new_price = self.original_price * self.discount
        return new_price

    @price.setter
    def price(self, value):
        self.original_price = value

    @price.deleter
    def price(self):
        del self.original_price

obj = Goods()
obj.price         # 获取商品价格
obj.price = 200   # 修改商品原价
del obj.price     # 删除商品原价
```

属性还可以用静态字段的方法来创建，即创建值为 property 对象的静态字段：

```python
class Foo:

    def get_bar(self):
        return 'wupeiqi'

    BAR = property(get_bar)

obj = Foo()
reuslt = obj.BAR        # 自动调用get_bar方法，并获取方法的返回值
print reuslt
```

property 的构造方法中有个四个参数：

- 第一个参数是方法名，调用 对象.属性 时自动触发执行方法
- 第二个参数是方法名，调用 对象.属性 ＝ XXX 时自动触发执行方法
- 第三个参数是方法名，调用 del 对象.属性 时自动触发执行方法
- 第四个参数是字符串，调用 对象.属性.\_\_doc\_\_ ，此参数是该属性的描述信息

## 类和对象在内存中的存储

类以及类中的方法在内存中只有一份，而根据类创建的每一个对象都在内存中需要存一份。根据类创建对象时，会保存一个类对象指针，该值指向当前对象的类。对象只保存实例变量，当调用类方法时会将对象作为参数传递给方法的第一个参数 self 。

> 所有成员中，只有普通字段的内容保存对象中，即：根据此类创建了多少对象，在内存中就有多少个普通字段。而其他的成员，则都是保存在类中，即：无论对象的多少，在内存中只创建一份。

![类与对象在内存中的存储](http://static.konghy.cn/xlwb/imgs/wx2/mw690/c3c88275gw1f3p8ggdep6j21kw0ro42d.jpg)


## 类成员修饰符

类的成员从访问权限来分有两种形式：

- 公有成员，在任何地方都能访问
- 私有成员，只有在类的内部才能方法

私有成员命名时，前两个字符是下划线（特殊成员除外，例如：`__init__`、`__call__`、`__dict__`等）。在 Python 中私有变量并不是真正的私有，如果想要强制访问私有字段，可以通过 【`对象._类名__私有字段名` 】访问（如：`obj._C__foo`），不建议强制访问私有成员。


## 类的特殊成员

#### 1. `__doc__`

类的描述信息，即文档字符串。

#### 2. `__module__` 和 `__class__`

- `__module__` 表示当前操作的对象所属模块
- `__class__`     表示当前操作的对象所属的类

#### 3. `__init__`

构造方法，初始化实例，通过类创建对象时，自动触发执行。

#### 4. ` __del__`

析构方法，当对象在内存中被释放时，自动触发执行。

#### 5. `__call__`

让实例对象可调用，也就是如果类中定义了该方法，则可以将实例作为函数使用。

#### 6. `__dict__`

类或对象中的所有成员。

#### 7. `__setattr__`、 `__getattr__`、 ` __delattr__`

用于动态的向实例中添加、获取、删除属性。

#### 8.  `__str__`、 `__repr__`

- `__str__`：返回一个可以用来表示对象的可打印的对人友好的字符串；
- `__repr__`：返回一个可以用来表示对象的可打印的对 Python 友好的字符串。

#### 9. `__getitem__`、`__setitem__`、`__delitem__`

创建类似于映射的类时用于索引操作，如实现一个类字典的数据结构。以上分别表示获取、设置、删除数据。

#### 10. `__getslice__`、`__setslice__`、`__delslice__`

创建类似于序列的类时这三个方法用于切片操作，如实现一个类序列的数据结构。

#### 11. `__iter__`

用于创建迭代器。

#### 12. `__slots__`

在动态语言中，可以随意给一个实例绑定任何的属性和方法，Python 也是如此。在面向对象编程中，为了限制 class 的属性，可使用特殊的`__slots__`变量来声明可添加的属性。使用 `__slots__` 要注意，其定义的属性仅对当前类起作用，对继承的子类不起作用。

#### 13. `__new__`

新式类中添加的方法，用于生成实例，在类准备将自身实例化时调用。至少要有一个参数cls，代表要实例化的类，其始终都是类的静态方法，即使没有被加上静态方法装饰器。必须要有返回值，返回实例化出来的实例，可以 return 父类 `__new__` 出来的实例，或者直接是 object 的 `__new__` 出来的实例。

#### 14. `__metaclass__`

用于自定义元类。
