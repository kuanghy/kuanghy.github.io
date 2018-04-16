---
layout: post
title: "Python3 的一些新特性"
keywords: Python3  Python3新特性 Python解包 Python迭代器
description: "Python3 加入了很多新的特性，使得代码更加简洁，以及运行起来更加高效"
category: Python
tags: python
---

Python3 加入了很多新的特性，使得代码更加简洁，以及运行起来更加高效。这里收集一些很棒的、用得上的新特性。

## 高级解包

```
>>> a, b, *rest = range(10)
>>> a
0
>>> b
1
>>> rest
[2, 3, 4, 5, 6, 7, 8, 9]
>>> a, *rest, b = range(10)
>>> rest
[1, 2, 3, 4, 5, 6, 7, 8]
>>> *rest, a, b = range(10)
>>> rest
[0, 1, 2, 3, 4, 5, 6, 7]
```

## 一切皆迭代器

在 Python3 中 range, zip, map, dict.values 等全是迭代器。如果你想要一个列表，仅需要使用 list() 将其包起来。

## 不是一切都能比较

在 Python2 中，可以将不同类型的值进行比较，例如 `不是一切都能比较`， 但在 Python3 中则不能：

```
>>> "one" > 1
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: unorderable types: str() > int()
```

## yield from

将一切转换成生成器， 后跟一个可迭代对象。示例：

```python
for i in gen()
    yield i
```

以上代码可以这样实现：

```python
yield from gen()
```

## 函数注释(Function Annotations)

注释的一般规则是参数名后跟一个冒号(:)，然后再跟一个expression，这个expression可以是任何形式。示例：

```
>>> def f(x:int) -> float:
...     pass
>>> f.__annotations__
{'x': <class 'int'>, 'return': <class 'float'>}
```

## 默认使用绝对导入

绝对导入可以避免导入子包覆盖掉标准库模块。也就是说，如果你编写了一个 string.py 模块，在 Python2 中尝试用 `import string` 时导入的是你自己编写的模块，但是在 Python3 中导入的则是标准库的 string 模块。

## 使用 as 关键字捕获异常信息

在 python2 中可以用以下两种信息捕获异常信息：

```python
try:
    do_something()
except Exception, e:
    print e

# or

try:
    do_something()
except Exception as e:
    print e
```

而在 Python3 中不再支持逗号的形式，只有 as 关键字捕获异常信息。

## 新的字符串格式化方式

```python
>>> name = "Huoty"
>>> f'My name is {name}'
'My name is Huoty'
>>> width = 10
>>> precision = 4
>>> import decimal
>>> value = decimal.Decimal("12.34567")
>>> f"result: {value:{width}.{precision}}"  # nested fields
'result:      12.35'
>>> import datetime
>>> now = datetime.datetime.now()
>>> f'{now} was on a {now:%A}'
'2018-01-18 11:21:58.444054 was on a Thursday'
>>> def foo():
...     return 18
...
>>> f'result={foo()}'
'result=18'
```

以上特性在 Python3.6 中添加，参考：[PEP 498: Formatted string literals](https://docs.python.org/3/whatsnew/3.6.html#pep-498-formatted-string-literals)

## 合并字典

在 Python2 中合并两个字段需要使用如下形势：

```python
>>> x = dict(a=1, b=2)
>>> y = dict(b=3, d=4)
>>> dict(x, **y)
{'a': 1, 'b': 3, 'd': 4}
```

在 Python3.5 之后的版本可以这样：

```python
>>> x = dict(a=1, b=2)
>>> y = dict(b=3, d=4)
>>> {**x, **y}
{'a': 1, 'b': 3, 'd': 4}
```

该功能得益于更高级的解包方式：[PEP 448 - Additional Unpacking Generalizations](https://docs.python.org/3/whatsnew/3.5.html#pep-448-additional-unpacking-generalizations)

## 标准库添加

- asyncio（异步IO）
- faulthandler
- ipaddress
- functools.lru_cache
- enum
- pathlib
