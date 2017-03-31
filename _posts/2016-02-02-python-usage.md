---
layout: post
title: "Python 独特用法总结(map、reduce、filter等)"
keywords: Python map reduce filter lambda
description: "总结 Python 的一些高级的、独特的用法，例如 map、reduce、filter、lambda、列表推导式等"
category: Python
tags: python lambda
---

## Map 函数

原型：

> map(function, sequence)

作用是将一个序列通过分 function 映射到另一个序列。即对可迭代对象中的每一个元素应用`function`方法，将结果作为 list 返回。如下所示：

<pre>
>>> def add100(x):
...     return x+100
...
>>> hh = [11,22,33]
>>> map(add100,hh)
[111, 122, 133]
</pre>

如果给出了额外的可迭代参数，则对每个可迭代参数中的元素‘并行’的应用‘function’。如下所示：

<pre>
>>> def abc(a, b, c):
...     return a*10000 + b*100 + c
...
>>> list1 = [11,22,33]
>>> list2 = [44,55,66]
>>> list3 = [77,88,99]
>>> map(abc,list1,list2,list3)
[114477, 225588, 336699]
</pre>

如果`function`给出的是`None`，自动假定一个‘identity’函数:

<pre>
>>> list1 = [11,22,33]
>>> map(None,list1)
[11, 22, 33]
>>> list1 = [11,22,33]
>>> list2 = [44,55,66]
>>> list3 = [77,88,99]
>>> map(None,list1,list2,list3)
[(11, 44, 77), (22, 55, 88), (33, 66, 99)]
</pre>

实际上，map 函数类似于列表解析式：

> [ function(x) for x in sequence ]

## Reduce 函数

原型：

> reduce(function, sequence, startValue)

作用是将一个列表归纳为一个输出。具体是将一个可迭代的对象应用到一个带有两个参数的方法上，遍历这个可迭代对象，将其中的元素依次作为 function 的参数。如果给定 `startValue` 值，则第一次传入的是 startValue 和可迭代对象的第一个元素；如果没有给定，则传入可迭代对象的前两个参数。

<pre>
>>> def foo(x, y):
...     return x + y
...
>>> l = range(1, 10)
>>> reduce(foo, l)
45
>>> reduce(foo, l, 10)
55
</pre>

## Filter 函数

原型：

> filter(function, sequence)

作用是按照所定义的函数过滤掉列表中的一些元素。如下所示：

<pre>
>>> def foo(x):
...     return x % 2 != 0
...
>>> def hoo(x):
...     if x > 5 and x < 10:
...         return x
...     
...
>>> l = range(1, 10)
>>> filter(foo, l)
[1, 3, 5, 7, 9]
>>> filter(hoo, l)
[6, 7, 8, 9]
</pre>

## Lambda 函数

原型：

> lambda &lt;参数>: 函数体

定义匿名函数，即函数没有具体的名称，也被称之为隐函数，主要用于实现一些简单的操作：

<pre>
>>> foo = lambda x: x**2
>>> foo(2)
4
>>> foo(4)
16
>>>
</pre>

##  列表推导式

基本形式：

> [x for item in sequence <if (conditions)>]

列表推导式又称列表解析，是一个非常有用, 简单, 而且灵活的工具, 可以用来动态地创建列表。例如获得`1~10`中所有奇数平方的列表：

<pre>
[x ** 2 for x in range(1, 10) if x % 2 == 1 ]
</pre>

## 生成器表达式

基本语法：

> (x for item in sequence <if (conditions)>)

生成器表达式是列表解析的一个扩展。列表解析的一个不足就是必要生成所有的数据, 用以创建整个列表。这可能对有大量数据的迭代器有负面效应。生成器表达式通过结合列表解析和生成器解决了这个问题。它与列表解析非常相似，而且它们的基本语法基本相同，只不过生成器表达式是被（）括起来的，而不是[]，它并不真正创建数字列表, 而是返回一个生成器。

<pre>
>>> item = ( x ** 2 for x in range(10) if x % 2 )
>>> item
<generator object <genexpr> at 0xb6900e64>
>>> for i in item:
...     print i
...     
...
1
9
25
49
81
</pre>
