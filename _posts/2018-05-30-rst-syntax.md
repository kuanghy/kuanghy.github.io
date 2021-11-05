---
layout: post
title: "reStructuredText 语法简介"
keywords: reStructuredText reST rst
description: "reStructuredText 含义为重新构建的文本，是扩展名为 .rst 的纯文本文件"
category: 文本编辑
tags: reStructuredText rst
---

**reStructuredText** 含义为 **重新构建的文本**，是扩展名为 `.rst` 的纯文本文件，也被简称为：RST 或 reST。其是 Python 编程语言的 Docutils 项目的一部分，Python Doc-SIG (Documentation Special Interest Group)。该项目类似于 Java 的 JavaDoc 或 Perl 的 POD 项目。 Docutils 能够从 Python 程序中提取注释和信息，格式化成程序文档。`.rst` 文件是轻量级标记语言的一种，被设计为容易阅读和编写的纯文本，并且可以借助 Docutils 这样的程序进行文档处理，也可以转换为 HTML 或 PDF 等多种格式，或由 Sphinx-Doc 这样的程序转换为 LaTex、man 等更多格式。

## 标题样式

一级标题：

```
============
一级标题
============
```

二级标题：

```
二级标题
============
```

三级标题：

```
三级标题
----------
```

四级标题：

```
四级标题
^^^^^^^^^^^
```

五级标题：

```
五级标题
""""""""""""
```

六级标题：

```
六级标题
***********
```

## 字体样式

强调内容（斜体）：

```
*这里是强调内容*
```

粗体：

```
**这里是粗体内容**
```

等宽文本

```
``这里是等宽文本``
```

## 文字段落

**段落** 是被空行分割的文字片段，左侧必须对齐（没有空格，或者有相同多的空格）：

```
| 这里是段落

  缩进的段落被视为引文。

| 这里也是段落

  缩进的段落被视为引文。

| 这里还是段落

  缩进的段落被视为引文。
```

**行块** 对于地址、诗句以及无装饰列表是非常有用的。行块是以 | 开头，每一个行块可以是多段文本,在 | 前后各有一个空格：

```
下面是行块内容：
 | 这是一段行块内容
 | 这同样也是行块内容
   还是行块内容

这是新的一段。
```

**文字块** 就是一段文字信息，在需要插入文本块的段落后面加上 ::，接着一个空行，然后就是文字块了。文字块不能定顶头写，要有缩进，结束标志是，新的一段文本贴开头，即没有缩进：

```
下面是文字块内容：
::

   这是一段文字块
   同样也是文字块
   还是文字块

这是新的一段。
```

**定义**：

```
定义1
  这是定义1的内容

定义2
  这是定义2的内容
```

**字段列表**:

```
:标题: reStructuredText语法说明

:作者:
 - Seay
 - Seay1
 - Seay2

:时间: 2017年12月12日

:概述: 这是一篇
 关于reStructuredText的语法说明。

 你在这里可以了解更多语法信息。
```

## 列表样式

**列表** 可以使用 - 、 * 、 + 来表示。不同的符号结尾需要加上空行，下级列表需要有空格缩进：

```
1. 枚举列表1
#. 枚举列表2
#. 枚举列表3

A. 枚举列表A
#. 枚举列表B
#. 枚举列表C

a. 枚举列表a
#. 枚举列表b
#. 枚举列表c
```

**水平列表** 将列表项横向显示并减少项目的间距使其较为紧凑：

```
.. hlist::
   :columns: 3

   * 列表
   * 的子
   * 项会
   * 水平
   * 排列
```

**选项列表** 是一个类似两列的表格，左边是参数，右边是描述信息。当参数选项过长时，参数选项和描述信息各占一行。项与参数之间有一个空格，参数选项与描述信息之间至少有两个空格：

```
-a            command-line option "a"
-b file       options can have arguments
              and long descriptions
--long        options can be long also
--input=file  long options can also have
              arguments
/V            DOS/VMS-style options too
```

## 代码块

行内代码（即等宽文本），用两个反引号：

```
``echo "Hello World!";``
```

简单代码块（加两个冒号再空一行）：

```
双冒号方式 ::

  echo "Hello World!";
```

代码高亮，使用 code-block 语句，还可以选择列出行号和高亮重点行等：

- :linenos:显示行号
- :emphasize-lines:3,6 3,6行高亮

示例：

```
.. code-block:: c
    :linenos:
    :emphasize-lines: 3,6

    void foo()
    {
        int i;

        for(i=0; i<10; i++)
            printf("i: %d\n", a);
    }

.. code-block:: php
    :linenos:

    <?php
        echo 'hi';
    ?>

.. code-block:: html
    :linenos:

    <b>粗体</b>

.. code-block:: console
    :linenos:

    $ ls
    $ uname -a
```

## 超链接

行内超链接，语法为：

```
`链接文字 <URL>`_
```

示例：

```
访问 `我的博客 <http://ramble.3vshej.cn>`_ ，可以了解更多信息。
```

分开的超链接，语法为：

```
# 用到链接的地方
`链接文字`_

# 定义链接的地方
.. _链接文字: URL
```

示例：

```
访问 `我的博客`_，可以了解更多信息。

.. _我的博客: http://ramble.3vshej.cn
```

或者：

```
这篇文章参考的是：`reStructuredText(rst)快速入门语法说明`__。

.. __: http://www.jianshu.com/p/1885d5570b37
```

## 图片表格

图片：

```
.. image:: ./2017-12-06_raspberry-pi-e1512540834201.png
  :width: 200px
```

表格：

```
=====  =====  ======
输入          输出
------------  ------
A      B      A or B
=====  =====  ======
False  False  False
True   False  True
False  True   True
True   True   True
=====  =====  ======
```

或者：

```
+------------------------+------------+----------+----------+
| Header row, column 1   | Header 2   | Header 3 | Header 4 |
| (header rows optional) |            |          |          |
+========================+============+==========+==========+
| body row 1, column 1   | column 2   | column 3 | column 4 |
+------------------------+------------+----------+----------+
| body row 2             | Cells may span columns.          |
+------------------------+------------+---------------------+
| body row 3             | Cells may  | - Table cells       |
+------------------------+ span rows. | - contain           |
| body row 4             |            | - body elements.    |
+------------------------+------------+---------------------+
```

## 其他

**注释**，以 .. 开头，后面接注释内容即可，可以是多行内容，多行时每行开头要加一个空格：

```
..
 我是注释内容
 你们看不到我
```

**分隔符** 是一条水平的横线，是由 4 个 - 或者更多组成，需要添加换行：

```
上面部分

------------

下面部分
```

Python **会话**:

```
>>> print "Hello World!"
Hello World!
```

## 参考资料

- [https://3vshej.cn/rstSyntax/](https://3vshej.cn/rstSyntax/)
- [https://zh-sphinx-doc.readthedocs.io/en/latest/rest.html](https://zh-sphinx-doc.readthedocs.io/en/latest/rest.html)
