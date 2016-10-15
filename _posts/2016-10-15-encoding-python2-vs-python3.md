---
layout: post
title: "Python2 与 Python3 的编码对比"
keywords: Python 字符编码 unicode bytes 编码 解码 encode decode
description: "编码就是将字符串转换成字节码；解码就是将字节码转换为字符串"
category: Python
tags: Python 
---

在 Python 中，不论是 Python2 还是 Python3 中，总体上说，字符都只有两大类：

- 通用的 Unicode 字符；
- （unicode 被编码后的）某种编码类型的字符，比如 UTF-8，GBK 等类型的字符。

**Python2 中字符的类型：**

- **str：** 已经编码后的字节序列
- **unicode：** 编码前的文本字符

**Python3 中字符的类型：**

- **str：** 编码过的 unicode 文本字符
- **bytes：** 编码前的字节序列

我们可以认为字符串有两种状态，即文本状态和字节（二进制）状态。Python2 和 Python3 中的两种字符类型都分别对应这两种状态，然后相互之间进行编解码转化。**编码就是将字符串转换成字节码，涉及到字符串的内部表示；解码就是将字节码转换为字符串，将比特位显示成字符**。

在 Python2 中，str 和 unicode 都有 encode 和 decode 方法。但是**不建议对 str 使用 encode，对 unicode 使用 decode**, 这是 Python2 设计上的缺陷。Python3 则进行了优化，str 只有一个 encode 方法将字符串转化为一个字节码，而且 bytes 也只有一个 decode 方法将字节码转化为一个文本字符串。

Python2 的 str 和 unicode 都是 basestring 的子类，所以两者可以直接进行拼接操作。而 Python3 中的 bytes 和 str 是两个独立的类型，两者不能进行拼接。

Python2 中，普通的，用引号括起来的字符，就是 str；此时字符串的编码类型，对应着你的 Python 文件本身保存为何种编码有关，最常见的 Windows 平台中，默认用的是 GBK。Python3 中，被单引号或双引号括起来的字符串，就已经是 Unicode 类型的 str 了。对于 str 为何种编码，有一些前提：

- Python 文件开始已经声明对应的编码
- Python 文件本身的确是使用该编码保存的
- 两者的编码类型要一样（比如都是 UTF-8 或者都是 GBK 等）

这样 Python 解析器才能正确的把文本解析为对应编码的 str。

总体来说，在 Python3 中，字符编码问题得到了极大的优化，不再像 Python2 那么头疼。在 Python3 中，文本总是 Unicode, 由 str 类型进行表示，二进制数据使用 bytes 进行表示，不会将 str 与 bytes 偷偷的混在一起，使得两者的区别更加明显。

