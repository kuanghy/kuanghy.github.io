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

## 标准库添加

- 异步IO(asyncio)
- faulthandler
- ipaddress
- functools.lru_cache
- enum
