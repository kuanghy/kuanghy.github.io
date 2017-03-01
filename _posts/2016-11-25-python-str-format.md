---
layout: post
title: "Python 字符串格式化 str.format 简介"
keywords: Python 字符串格式化 format str.format
description: "Python 在 2.6 版本中新加了一个字符串格式化方法 str.format"
category: Python
tags: Python format
---

Python 在 2.6 版本中新加了一个字符串格式化方法： `str.format()`。它的基本语法是通过 `{}` 和 `:` 来代替以前的 `%.`。格式化时的占位符语法：

```
replacement_field ::= "{" [field_name] ["!" conversion] [":" format_spec] "}"
```

## “映射”规则

#### 通过位置

`str.format()` 可以接受不限个参数，位置可以不按顺序:

```python
>>> "{0} {1}".format("hello", "world")
'hello world'
>>> "{} {}".format("hello", "world")
'hello world'
>>> "{1} {0} {1}".format("hello", "world")
'world hello world'
```

#### 通过关键字参数

使用关键参数时字符串中需要提供参数名：

```python
>>> "I am {name}, age is {age}".format(name="huoty", age=18)
'I am huoty, age is 18'
>>> user = {"name": "huoty", "age": 18}
>>> "I am {name}, age is {age}".format(**user)
'I am huoty, age is 18'
```

#### 通过对象属性

`str.format()` 可以直接读取用户属性:

```python
>>> class User(object):
...     def __init__(self, name, age):
...         self.name = name
...         self.age = age
...         
...     def __str__(self):
...         return "{self.name}({self.age})".format(self=self)
...     
...     def __repr__(self):
...         return self.__str__()
...     
...
>>> user = User("huoty", 18)
>>> user
huoty(18)
>>> "I am {user.name}, age is {user.age}".format(user=user)
'I am huoty, age is 18'
```

#### 通过下标

在需要格式化的字符串内部可以通过下标来访问元素：

```python
>>> names, ages = ["huoty", "esenich", "anan"], [18, 16, 8]
>>> "I am {0[0]}, age is {1[2]}".format(names, ages)
'I am huoty, age is 8'
>>> users = {"names": ["huoty", "esenich", "anan"], "ages": [18, 16, 8]}
>>> "I am {names[0]}, age is {ages[0]}".format(**users)
```

#### 指定转化

可以指定字符串的转化类型：

```
 conversion ::= "r" | "s" | "a"
```

其中 "!r" 对应 repr()； "!s" 对应 str(); "!a" 对应 ascii()。 示例：

```python
>>> "repr() shows quotes: {!r}; str() doesn't: {!s}".format('test1', 'test2')
"repr() shows quotes: 'test1'; str() doesn't: test2"
```

## 格式限定符

#### 填充与对齐

填充常跟对齐一起使用。`^, <, >` 分别是居中、左对齐、右对齐，后面带宽度， `:` 号后面带填充的字符，只能是一个字符，不指定则默认是用空格填充。

```python
>>> "{:>8}".format("181716")
'  181716'
>>> "{:0>8}".format("181716")
'00181716'
>>> "{:->8}".format("181716")
'--181716'
>>> "{:-<8}".format("181716")
'181716--'
>>> "{:-^8}".format("181716")
'-181716-'
>>> "{:-<25}>".format("Here ")
'Here -------------------->'
```
#### 浮点精度

用 f 表示浮点类型，并可以在其前边加上精度控制：

```python
>>> "[ {:.2f} ]".format(321.33345)
'[ 321.33 ]'
>>> "[ {:.1f} ]".format(321.33345)
'[ 321.3 ]'
>>> "[ {:.4f} ]".format(321.33345)
'[ 321.3335 ]'
>>> "[ {:.4f} ]".format(321)
'[ 321.0000 ]'
```

还可以为浮点数指定符号，`+` 表示在正数前显示 +，负数前显示 -；` ` （空格）表示在正数前加空格，在幅负数前加 -；`-` 与什么都不加（{:f}）时一致：

```python
>>> '{:+f}; {:+f}'.format(3.141592657, -3.141592657)
'+3.141593; -3.141593'
>>> '{: f}; {: f}'.format(3.141592657, -3.141592657)
' 3.141593; -3.141593'
>>> '{:f}; {:f}'.format(3.141592657, -3.141592657)
'3.141593; -3.141593'
>>> '{:-f}; {:-f}'.format(3.141592657, -3.141592657)
'3.141593; -3.141593'
>>> '{:+.4f}; {:+.4f}'.format(3.141592657, -3.141592657)
'+3.1416; -3.1416'
```

#### 指定进制

```python
>>> "int: {0:d};  hex: {0:x};  oct: {0:o};  bin: {0:b}".format(18)
'int: 18;  hex: 12;  oct: 22;  bin: 10010'
>>> "int: {0:d};  hex: {0:#x};  oct: {0:#o};  bin: {0:#b}".format(18)
'int: 18;  hex: 0x12;  oct: 0o22;  bin: 0b10010'
```

#### 千位分隔符

可以使用 "," 来作为千位分隔符：

```python
>>> '{:,}'.format(1234567890)
'1,234,567,890'
```

#### 百分数显示

```python
>>> "progress: {:.2%}".format(19.88/22)
'progress: 90.36%'
```

事实上，format 还支持更多的类型符号：

```
type ::= "b" | "c" | "d" | "e" | "E" | "f" | "F" | "g" | "G" | "n" | "o" | "s" | "x" | "X" | "%"
```

## 其他技巧

#### 占位符嵌套

某些时候占位符嵌套还是很有用的：

```python
>>> '{0:{fill}{align}16}'.format("hello", fill='*', align='^')
'*****hello******'
>>>
>>> for num in range(5,12):
...     for base in "dXob":
...         print("{0:{width}{base}}".format(num, base=base, width=5), end=' ')
...     print()
...     
...
    5     5     5   101
    6     6     6   110
    7     7     7   111
    8     8    10  1000
    9     9    11  1001
   10     A    12  1010
   11     B    13  1011
```

#### 作为函数使用

可以先不指定格式化参数，而是在不要的地方作为函数来调用：

```python
>>> email_f = "Your email address was {email}".format
>>> print(email_f(email="suodhuoty@gmail.com"))
Your email address was sudohuoty@gmail.com
```

#### 转义大括号

当在字符串中需要使用大括号时可以用大括号转义：

```python
>>> " The {} set is often represented as { {0} } ".format("empty")
' The empty set is often represented as {0} '
```

