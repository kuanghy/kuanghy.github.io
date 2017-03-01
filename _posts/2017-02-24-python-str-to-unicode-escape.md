---
layout: post
title: "Python 解码 Unicode 转义字符串"
keywords: Python 字符串 unicode escape 解码
description: "Unicode的转义字符串可以通过解码为escape编码类型来查看其要表示的类型"
category: Python
tags: Python unicode escape
---

其实，这里要讨论的内容是针对 Python2 的，实际上也是 Python2 中让人头疼的编码问题，而 Python3 则好处理得多。

先来看看例子：

```python
>>> s = "我正在学Python"
>>> s
'\xe6\x88\x91\xe6\xad\xa3\xe5\x9c\xa8\xe5\xad\xa6Python'
>>> s_u = u"我正在学Python"
>>> s_u
u'\u6211\u6b63\u5728\u5b66Python'
>>> print s
我正在学Python
>>> print s_u
我正在学Python
```

在 Python2 中，有两种类型的字符编码，即 str 和 unicode。而 str 是字节字符串，也就二进制数据；unicode 是文本字符串，是字节序列通过编码后的文本类型。

从上例可以看出，我们直接运行 s 或者 s_u 与用 print 打印输出是不一样的。直接运行实际上解释器是调用的 `repr` 方法，这样的输出表示是计算机可读的形式，也就在 Python 解释器内部是这么存储的；而用 print 输出的字符串则是人可读的，它的目的就是让人能够读懂。

那么，问题就来了，如果你得到这样的字符串：

```
\xe6\x88\x91\xe6\xad\xa3\xe5\x9c\xa8\xe5\xad\xa6Python

\u6211\u6b63\u5728\u5b66Python
```

通过肉眼，肯定是没人能直接看出它们是什么东西的。再来看下示例：

```python
>>> ss = "\xe6\x88\x91\xe6\xad\xa3\xe5\x9c\xa8\xe5\xad\xa6Python"
>>> ss
'\xe6\x88\x91\xe6\xad\xa3\xe5\x9c\xa8\xe5\xad\xa6Python'
>>> print ss
我正在学Python
>>> ss_u = "\u6211\u6b63\u5728\u5b66Python"
>>> ss_u
'\\u6211\\u6b63\\u5728\\u5b66Python'
>>> print ss_u
\u6211\u6b63\u5728\u5b66Python
```

也就是说，`\x` 开头的这种字符串与直接写中文的字符串是一样的，没有什么区别。因为它是二进制的表示，解释器可以直接表示它，输入中文的时候，解释器内部也是这么存储的。而 `\u` 开头的字符串解释器则不认识，因为这是一种编码，人们通过约定，用这个编码来表示这个汉字。

通常，我们在网络中接收到的字符串很多都是 `\u` 开头的，当我们拿到这种字符串的时候，看不出它是些什么东西，是不是很焦虑呢。实际上，这种字符串可以理解为是一种 escape 编码的字符串，也就是便于网络传输的字符串。能进行传输的，一般都是 ASCII 字符集，汉字是没法直接传输的，要传输汉字就需要把它转化成 ASCII 字符串。

要怎样才能让 `\u` 字符串的意思显而易见呢？我们先来分析一下，要看懂它肯定是要做一些编码转换的。首先你要清楚，你现在拿到的用双引号括起来的字符串一个 str 类型，而 str 类型是二进制的。我把这种字符串称之为 **转义字符串**，也就是通过汉字转义后得到的字符串，这种叫法不一定正确，只是为了便于理解。那么，我们把它转化为文本字符串是不是就可以了呢。从二进制字符串到文件字符，一般被称之为 **解码**，也就是 **decode**。这里，我们把它解码为 `unicode-escape` 编码的字符串：

```python
decode("unicode-escape")
```

继续上边的例子：

```python
>>> ss_uu = ss_u.decode("unicode-escape")
>>> ss_uu
u'\u6211\u6b63\u5728\u5b66Python'
>>> print ss_uu
我正在学Python
```

在 Python3 中，则不再会出现这样的问题。Python3 中不再有 str 和 unicode 字符类型的概念，取而代之的是 `str` 和 `bytes` 两种字符类型。`str` 是编码过的 unicode 文本字符，`bytes` 是编码前的字节序列。Python3 在编码的处理上要简单得多，它不再有所谓 unicode 字符串的概念，虽然也兼容 `u""` 这样的写法，但这实际上也是一个 str 类型。如示例：

```python
>>> s = "我正在学Python"
>>> s
'我正在学Python'
>>> print(s)
我正在学Python
>>> s_u = u"我正在学Python"
>>> s_u
'我正在学Python'
>>> print(s_u)
我正在学Python
>>> type(s)
<class 'str'>
>>> type(s_u)
<class 'str'>
>>> ss_u = "\u6211\u6b63\u5728\u5b66Python"
>>> ss_u
'我正在学Python'
>>> print(ss_u)
我正在学Python
```