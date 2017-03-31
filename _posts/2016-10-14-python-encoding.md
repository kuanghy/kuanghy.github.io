---
layout: post
title: "Python 字符编码"
keywords: python 字符编码 decode encode ASCII GBK UTF-8 Unicode
description: "Python中的str是字节序列,而unicode则是文本字符串"
category: Python
tags: python
---

字符串也是一种数据类型，但比较特殊的是字符串存在一个编码问题，也就是我们怎么用计算机来表示相应的字符并存储。在编程语言中，我们经常会处理文本编码之间的转化问题，因为文本可能存在不同的编码，比如 ASCII、GBK、UTF-8 等等。

如果希望正确的处理文本，就必须了解`字符`的抽象概念。我们可以认为字符表示的是文本中的单个符号。更重要的是，一个字符不是一个字节。比如，"中"在文本中是一个字符，但它存储在计算机中时却不是一个字节。一个字符有许多表示方法，不同的表示方法会使用不同的字节数，这就是所谓的编码。**字符就是文本中最小的单元**。

由于计算机是美国人发明的，因此，最早只有 127 个字母被编码到计算机里，也就是大小写英文字母、数字和一些符号，这个编码表被称为 ASCII 编码。但是计算机被广泛应用之后，ASCII 编码已经不足以表示世界上的各种语言，于是后来便出现了 Unicode 编码。

`Unicode` 是一种编码规范， 用来统一表示世界上的各种语言。Unicode 只是规定如何编码，并没有规定如何传输和保存等等，因此 Unicode 编码有不同的实现方式，比如：UTF-8、UTF-16 。`UTF-8` 编码把一个 Unicode 字符根据不同的数字大小编码成 1-6 个字节，常用的英文字母被编码成 1 个字节，汉字通常是 3 个字节，只有很生僻的字符才会被编码成 4-6 个字节。Unicode 以大家都认可的方式定义了一系列的字符，可以将其理解成一个字符数据库，每个字符都与唯一的数字关联，称为 `code point`。这样，英文大写字母 A 的 codepoint 是 U+0041，而欧元符号的 codepoint 是 U+20A0。一个文本字符串就是一系列的 `code point`，表示字符串中每个字符元素。

Python 由荷兰人 `Guido van Rossum` 于 1989 年发明，第一个公开发行版发行于 1991 年。Guido 在设计之初并没有关心编码问题（当时他也不知道后来会出现编码问题）, 而且 Python 的诞生比 Unicode 标准发布的时间要早，因此 Python 默认编码在 Python3 之前是 ASCII。查看 Python 的默认编码:

```python
>>> import sys
>>> sys.getdefaultencoding()
'ascii'
```

这么默认编码有什么用呢？如果你在 Python 中进行编码和解码的时候，不指定编码方式，那么 Python 就会使用 `defaultencoding`。

字符串在 Python 内部的表示是 Unicode 编码, 在 Python 内部使用两个字节来存储一个 Unicode。也就是 Python 在内存中统一使用 Unicode 编码存储字符数据，当需要保存到硬盘或者需要传输的时候，就转换为其他编码，比如 UTF-8。

在 Python2 中，字符串的类型有两种，即 str 和 unicode，他们都是 basestring 的子类。`unicode` 表示 Unicode 字符串（文本字符串），`str` 表示**字节**字符串（二进制数据），由 unicode 经过编码后的字节组成。也就是说：

- **str** 存储的是已经编码后的字节序列，输出时看到每个字节用 16 进制表示，以`\x`开头。每个汉字会占用3个字节的长度。
- **unicode** 是“字符”串，存储的是编码前的字符，输出是看到字符以`\u`开头。每个汉字占用一个长度。定义一个 Unicode 对象时，以 `u` 开头。

在 Python 中 `Unicode` 被视为是一种中间码，如果要在不同的编码间进行转化，通常是先将字符串解码（decode）成 Unicode 编码，再从 Unicode 编码（encode）成另一种编码：

- **decode**: 的作用是将其他编码的字符串转换成 Unicode 编码，例如: name.decode(“GB2312”)，表示将 GB2312 编码的字符串 name 转换成 Unicode 编码
- **encode**: 的作用是将 Unicode 编码转换成其他编码的字符串例如，例如: name.encode(”GB2312“)，表示 Unicode 编码的字符串 name 转换成 GB2312 编码

我们会在很多 Python 的源码文件的头部看到如下的声明：

```python
# coding:utf-8
```

这表示声明源代码中的文本编码为 UTF-8，也就是告诉 Python 解释器将文件中的文本视为 UTF-8 编码的字符串，因此声明的编码应该与文件的编码保持一致。在代码中我们通常会处理一些其他来源的文本，比如网络，它们的编码不一定也是 UTF-8 的，因此就要进行编码转换。

Python 试图在字节串和字符串之间以不为人所察觉的方式进行转化。在不同的转换中，在条件允许的情况下，Python 会试图在字节串和 unicode 字符串直接进行转换。例如将字节串和 unicode 字节串连接到一起时。但是不使用 encoding 就在不同类型之间进行转换是没有意义的。所以 Python 依赖一个 `默认编码`，该编码由 `sys.setdefaultencoding()` 指定。在大多数平台上，默认的是 ASCII 编码。但对于所有转换，使用这种编码几乎都是错误的。如果不手动指定编码就调用 str() 或 unicode() ，或是函数以字符串作为参数，但传递的是其他类型的参数时，都会使用这个默认编码。这就是很多时候出现 ` UnicodeEncodeError` 和 ` UnicodeDecodeError` 错误的原因，也就是**字符串对象互相转化时没有指定字符编码**。

例如，如果对 unicode 和 str 类型通过 `+` 拼接时，输出结果是 unicode 类型，相当于先将 str 类型的字符串通过 decode() 方法解码成 unicode 再拼接。此时如果解码时没有明确指明编码类型，可能会出现错误。

解决这个问题的一个办法是，调用 `sys.setdefaultencoding()` 将默认的编码设置为真正会用到的编码。但这样仅仅是将问题隐藏起来，虽然这样刚开始能解决一些文本处理问题。但缺乏实际可行性，因为许多应用，特别是网络应用，在不同的地方会使用不同的文本编码。

要注意的一点是，对 Unicode 进行编码和对 str 进行编码都是错误的。即不要对 str 使用 encode，不要对 unicode 使用 decode（事实上可以对 str 进行 encode 的，但不建议）。

下面是一些处理 Python 中字符编码的建议：

- 所有文本字符串都应该是 unicode 类型，而不是 str 类型。
- 若要将字节串解码成字符串，需要使用正确的解码，即 var.decode(encoding)，如： var.decode('utf-8')；将文本字符串编码成字节，使用 var.encode(encoding)。
- 永远不要对 unicode 字符串使用 str() ，也不要在不指定编码的情况下就对字节串使用 unicode() 。
- 当应用从外部读取数据时，应将其视为字节串，即 str 类型的，接着调用 `.decode()` 将其解释成文本。同样，在将文本发送到外部时，总是对文本调用 `.encode()`。
- 对标准流进行操作时，可以改变环境变量 `PYTHONIOENCODING` 的值来设置标准流的默认编码， `sys.stdin.encoding` 和 `sys.stdout.encoding` 的值为期望的编码。

以上内容的讨论都仅限于 Python2，在 Python3 中已经修复了这些问题，可以正确的处理 unicode 和字符串。


## 参考资料

- [http://www.tuicool.com/articles/2MVRVv7](http://www.tuicool.com/articles/2MVRVv7)
- [https://gist.github.com/x7hub/178c87f323fbad57ff91](https://gist.github.com/x7hub/178c87f323fbad57ff91)
- [http://python.jobbole.com/86578/](http://python.jobbole.com/86578/)
