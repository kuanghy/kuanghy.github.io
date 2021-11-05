---
layout: post
title: "Python3 的一些新特性"
keywords: Python3  Python3新特性 Python解包 Python迭代器
description: "Python3 加入了很多新的特性，使得代码更加简洁，以及运行起来更加高效"
category: Python
tags: python
---

Python 3 加入了很多新的特性，使得代码更加简洁，以及运行起来更加高效。这里收集一些很棒的、用得上的新特性。

## 高级解包

对解包功能进行了增强：

```python
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

体现在函数关键参数上了：

```python
def foo(a, *args, b=10):  # 在 python2 中为无效的语法
    print(a, args, b)
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

```python
>>> def f(x:int) -> float:
...     pass
>>> f.__annotations__
{'x': <class 'int'>, 'return': <class 'float'>}
```

## 强制关键字参数

[PEP 3102](https://www.python.org/dev/peps/pep-3102/) 提供了一种强制使用关键字参数的方案，即在函数参数列表中，在 `*` 后的参数必须使用关键参数传递：

```python
>>> def foo(a, b, *, c, d=10):
...     print(f"a={a}, b={b}, c={c}, d={d}")
...
>>> foo(1, 2, 3)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: foo() takes 2 positional arguments but 3 were given
>>> foo(1, 2, c=3)
a=1, b=2, c=3, d=10
>>> foo(1, 2, c=3, d=4)
a=1, b=2, c=3, d=4
```

## 强制位置参数

在 Python 3.8 中引入了 [PEP 0570](https://www.python.org/dev/peps/pep-0570/) 强制位置参数的方案。新增了一个函数形参语法 `/` 用来指明某些函数形参必须使用仅限位置而非关键字参数的形式：

```python
>>> def foo(a, b, /, c, d, *, e, f=10):
...     print(f"a={a}, b={b}, c={c}, d={d}, e={e}, f={f}")
...
>>> foo(10, 20, 30, d=40, e=50)
a=10, b=20, c=30, d=40, e=50, f=10
>>> foo(10, b=20, c=30, d=40, e=50, f=60)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: foo() got some positional-only arguments passed as keyword arguments: 'b'
>>> foo(10, 20, 30, 40, 50, f=60)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: foo() takes 4 positional arguments but 5 positional arguments (and 1 keyword-only argument) were given
```

## 异常捕获 as 关键字

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

## 追溯异常栈

如果在一个捕获了一个，然后又抛出一个新的异常，有时如果能一并知道旧异常则更容易定位问题。Python3 支持用 raise ... from ... 语法来追溯最初出发的异常：

```python
>>> try:
...     1/0
... except Exception as e:
...     raise Exception("value error") from e
...
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
ZeroDivisionError: division by zero

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
Exception: value error
```

有时，解释器可能会默认使用 form 来追溯，但可以使用 raise ... from None 来明确禁止异常追溯：

```python
>>> try:
...     1/0
... except Exception:
...     raise Exception("value error") from None
...
Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
Exception: value error
```

## 新的字符串格式化方式

```python
>>> name = "Huoty"
>>> f"{name!r}"
"'Huoty'"
>>> f'My name is {name}'
'My name is Huoty'
>>> width = 10
>>> precision = 4
>>> import decimal
>>> value = decimal.Decimal("12.34567")
>>> f"result: {value:{width}.{precision}}"  # nested fields
'result:      12.35'
>>> price = 5.18362
>>> f'{price:.2f}'
'5.18'
>>> f'{price % 2 = }'
'price % 2 = 1.1836200000000003'
>>> import datetime
>>> now = datetime.datetime.now()
>>> f'{now} was on a {now:%A}'
'2018-01-18 11:21:58.444054 was on a Thursday'
>>> f'{now = :%Y-%m-%d}'
'now = 2021-10-11'
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

## 列表推导式优化

在 Python2 中，列表推导式会有变量泄露问题：

```python
>>> x = 1
>>> [x for x in "abc"]
['a', 'b', 'c']
>>> x  # x 变量被推导式修改
'c'
```

在 Python3 中该问题得到修复。列表推导、集合推导、字典推导、生成器表达式，在 Python3 中都有自己的局部作用域，就像函数一样。

```python
>>> x = 1
>>> [x for x in 'ABC']
['A', 'B', 'C']
>>> x
1
```

## 不是一切都能比较

在 Python2 中，可以将不同类型的值进行比较，例如 `不是一切都能比较`， 但在 Python3 中则不能：

```
>>> "one" > 1
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: unorderable types: str() > int()
```

## 一切皆迭代器

在 Python3 中 range, zip, map, dict.values 等全会返回一个迭代器。如果你想要一个列表，仅需要使用 list() 将其包起来。

## 名字空间包

从 Pyython 3.3 开始，Python 加入了 **名字空间包** 的概念。此后，包中即使没有 `__init__.py` 文件，也能被导入。
名字空间包主要应用于导入目录分散的代码。其搜索 sys.path 中所有相同的包名，将它们视为同一个命名空间。名字空间包有一个缺点是导入的模块或包有可能存在冲突。关于名字空间包的详细描述，可以参见 [PEP 420](https://www.python.org/dev/peps/pep-0420/)。

## 非局部变量声明

在闭包中，有时可能需要在内层函数中修改外层函数中的变量，如：

```python
def outer():
    x = 1
    def inner():
        x += 2
        print("inner:", x)
    inner()
    print("outer:", x)
```

以上代码运行会出现 UnboundLocalError 错误。原因是在 inner 函数中，x 在赋值之前被引用（因为与外层函数中的 x 冲突了）。

Python 3 中引入了 **nonlocal** 关键字来解决以上问题，即声明 **非局部变量**。以上代码如果在 Python 3 中，进行如下修改后可以正常运行：

```python
def outer():
    x = 1
    def inner():
        nonlocal x
        x += 2
        print("inner:", x)
    inner()
    print("outer:", x)
```

这有点像 global，但 nonlocal 声明的变量只对局部起作用，离开封装函数（闭包环境），则无效。非局部声明不像全局声明，必须在封装函数前面事先声明该变量。非局部声明不能与局部范围的声明冲突

## 默认使用绝对导入

绝对导入可以避免导入子包覆盖掉标准库模块。也就是说，如果你编写了一个 string.py 模块，在 Python2 中尝试用 `import string` 时导入的是你自己编写的模块，但是在 Python3 中导入的则是标准库的 string 模块。

## 定制模块属性访问

从 Python 3.7 开始允许在模块上定义 `__getattr__()` 函数，其用法与类相同，当以其他方式找不到模块属性时该函数会被调用。 还可以在模块上定义 `__dir__()` 函数。

## 赋值表达式

从 Python 3.8 开始，新增语法 `:=` 用来在表达式内部为变量赋值：

```
if (n := len(a)) > 10:
    print(f"List is too long ({n} elements, expected <= 10)")

discount = 0.0
if (mo := re.search(r'(\d+)% discount', advertisement)):
    discount = float(mo.group(1)) / 100.0

while (block := f.read(256)) != '':
    process(block)

[
    clean_name.title() for name in names
    if (clean_name := normalize('NFC', name)) in allowed_names
]
```

## 一些新的标准库

- **asyncio**： 原生的异步 IO (协程) 实现
- **faulthandler**：可用于查看进程的 traceback 信息
- **ipaddress**：处理 IP 地址信息
- **functools.lru_cache**：LRU 缓存实现
- **enum**：枚举模块
- **pathlib**：更好的路径处理库
