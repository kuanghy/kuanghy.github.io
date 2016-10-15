---
layout: post
title: "Python 自省相关的内建函数和属性"
keywords: python 自省
description: "缓存是一种将定量数据加以保存以备迎合后续请求的处理方式，旨在加快数据的检索速度。"
category: Python
tags: python 自省
---

> 见贤思齐焉，见不贤而内自省也。  --《论语·里仁》

在计算机编程中，自省是指这种能力：检查某些事物以确定它是什么、它知道什么以及它能做什么。这里简单列举和介绍 Python 自省相关的内建函数。

#### issubclass

> issubclass(sub, sup) 

如果给出的子类 sub 确定是父类 sup 的一个子类，则返回 True ，反之则返回 False。这个函数也允许“不严格”的子类，意味着，一个类可视为其自身的子类。issubclass() 的第二个参数可以是可能的父类组成的元组（tuple），这时，只要第一个参数是给定元组中任何一个候选类的子类时，就会返回 True。

#### isinstance

> isinstance(object, class-or-type-or-tuple)

判断 object 对象是否是 class 的一个实例，或者是否属于 type 类型，如果是返回 True， 否则返回 False。第二个参数可以是一个元组，如果第一个参数是第二个参数中给定元组的任何一个候选类型或类的实例时，就会返回 True。

#### hasatrr

> hasattr(object, name)

检查 object 是否有一个名为 name 的值的属性，返回一个布尔值。 第二个参数，即属性名字符串的方式提供。该函数一般用于访问某属性前先做一个检查。

#### getattr

> getattr(object, name[, default])

返回 object 中名为 name 值的属性的值，例如如果属性名为 'bar'，则返回 obj.bar。 该函数会在试图获取一个不存在的属性时，引发 AttributeError 异常，除非可选的默认参数 defualt。

#### setattr

> setattr(object, name, value)

将给 object 对象中名为 name 的值的属性赋值为 val。例如如果 name 为 'bar'，则相当于 obj.bar = val。 如果 object 中有 name 的属性则重新设置其值，如果没有则添加一个名为 name 的属性。

#### delattr

> delattr(object, name)

从 object 中删除名为 name 的属性。

#### callable

> callable(object)

检查对象object是否可调用。如果返回True，object仍然可能调用失败；但如果返回False，调用对象ojbect绝对不会成功。需要注意的是，类是可调用的，而类的实例实现了`__call__()`方法才可调用。该函数在python2.x版本中都可用。但是在python3.0版本中被移除，而在python3.2以后版本中被重新添加。

#### dir

> dir([object])

不带参数时，返回当前范围内的变量、方法和定义的类型列表；带参数时，返回参数的属性、方法列表。如果参数包含方法\_\_dir\_\_()，该方法将被调用。如果参数不包含\_\_dir\_\_()，该方法将最大限度地收集参数信息。参数可以是对象、变量、类型。

#### sys 模块

- sys.executable

当前 Python 解释器路径：

```
>>> sys.executable
'/usr/bin/python3'
```

- sys.platform

当前系统平类型：

```
>>> sys.platform
'linux'
```

`platform` 可以获取给多平台相关的信息。

- sys.version

当前 Python 解释器程序的版本信息，该属性是一个字符串。

```
>>> sys.version
'3.4.3 (default, Oct 14 2015, 20:28:29) \n[GCC 4.8.4]'
```

- sys.version_info

当前 Python 解释器程序的版本信息，该属性是一个类似于元组的类型。

```
>>> sys.version_info
sys.version_info(major=3, minor=4, micro=3, releaselevel='final', serial=0)
>>> sys.version_info >= (3, 0)
True
```

#### buitins

内建模块在 Python2.x 中为 `__builtin__`，在 Python3.x 中为 `builtins`。而`__builtins__`是内建模块的引用，它和内建模块一样，在程序运行之前被加载到内存。内建模块与`__builtins__`的区别如下：

- (1)无论任何地方要想使用内建模块，都必须在该位置所处的作用域中导入\_\_builtin\_\_内建模块;而对于\_\_builtins\_\_却不用导入，它在任何模块都直接可见

- (2)\_\_builtins\_\_虽是对内建模块的引用，但这个引用要看是使用\_\_builtins\_\_的模块是哪个模块:
    - 在主模块\_\_main\_\_中：\_\_builtins\_\_是对内建模块\_\_builtin\_\_本身的引用，即\_\_builtins\_\_完全等价于\_\_builtin\_\_，二者完全是一个东西，不分彼此。
    - 在非\_\_main\_\_模块中：\_\_builtins\_\_仅是对\_\_builtin\_\_.\_\_dict\_\_的引用，而非\_\_builtin\_\_本身。它在任何地方都可见。此时\_\_builtins\_\_的类型是字典。
