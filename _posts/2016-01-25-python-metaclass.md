---
layout: post
title: "Python 元类简述"
keywords: Python 元类 metaclass
description: "在 Python 中，类也是对象，元类就是用来创建类的工具"
category: Python
tags: python
---

在大多数编程语言中，类就是一组用来描述如何生成一个对象的代码段，在 Python 中也是如此。但在 Python 中，类也是对象，只要使用 class 关键字，Python 就会创建一个对象，这个对象（类）自身拥有创建对象（类实例）的能力。而且可以对它做如下操作：

- 1、将它赋值给一个变量

- 2、拷贝它

- 3、为它增加属性

- 4、将它作为函数参数进行传递

由于类也是对象，所以可以在运行时动态的创建类。例如在函数中创建类，在类中创建类，这样的类通常被称之为内部类。

在 Python 中，`type` 函数除了获取对象的类型外，还有一个完全不同的能力，用于动态的创建类。`type` 可以接受一个类的描述作为参数，然后返回一个类。如下所示

> type(类名, 父类的元组（针对继承的情况，可以为空），包含属性的字典（名称和值）)

在 Python 中，类也是对象，你可以动态的创建类。这就是当你使用关键字class时Python在幕后做的事情，而这就是通过元类来实现的。

所以，元类就是用来创建类的“东西”。可以这样理解，元类就是用来创建这些类（对象）的工具，即元类就是类的类。

函数 `type`实际上是一个元类。`type` 就是 Python 在背后用来创建所有类的元类。`type` 实际上是 Python 的内建元类，当然，你也可以创建自己的元类。

Python 通过 `__metaclass__` 属性来自定义元类。可以在写一个类的时候为其添加 \_\_metaclass__ 属性，这样 Python 会在内存中通过 \_\_metaclass__ 创建一个类对象。如果 Python 没有找到 \_\_metaclass__ ，它会继续在父类中寻找 \_\_metaclass__ 属性，并尝试做和前面同样的操作。如果Python在任何父类中都找不到 \_\_metaclass__ ，它就会在模块层次中去寻找 \_\_metaclass__ ，并尝试做同样的操作。如果还是找不到 \_\_metaclass__ ，Python就会用内置的 `type` 来创建这个类对象。

元类的主要用途是创建API。一个典型的例子是Django ORM。一般情况我们不需要对此作了解，所以这里只是做一个简单的描述。如果实际需要，则必须对其中的原理非常了解。

### 参考资料

- [http://blog.jobbole.com/21351/](http://blog.jobbole.com/21351/)

- [http://stackoverflow.com/questions/100003/what-is-a-metaclass-in-python](http://stackoverflow.com/questions/100003/what-is-a-metaclass-in-python)
