---
layout: post
title: "Python 解释器环境变量"
keywords: python command-line y2k PYTHONUNBUFFERED PYTHONOPTIMIZE PYTHONIOENCODING
description: "Python 即可以通过命令行参数，也可以通过环境变量来控制解释器执行代码的行为。命令行参数的优先级高于环境变量。"
category: Python
tags: python
---

Python 即可以通过命令行参数，也可以通过环境变量来控制解释器执行代码的行为。命令行参数的优先级高于环境变量，即当环境变量与命令行参数冲突时，环境变量的配置失效。如果运行时指定 `-E` 参数，则所有环境变量的配置都会被忽略。

以下列举 CPython 实现版本支持的环境变量。

### PYTHONHOME

指定 Python 标准库的路径。在默认情况下，Python 会查找 prefix/lib/pythonversion 和 exec_prefix/lib/pythonversion 作为标准库路径。其中 prefix 和 exec_prefix 由安装环境决定。

如果 PYTHONHOME 被设置为单个目录，那么 prefix 和 exec_prefix 都会被设定为该目录。如果分别设定这两个值，可以使用 prefix:exec_prefix 格式来设定 PYTHONHOME。

如果想定制一个受限的 Python 环境，可以将某些标准库文件链接到某个特定目录，然后将该目录作为受限 Python 环境的 PYTHONHOME。

### PYTHONPATH

指定额外的 Python 模块搜索路径。它的格式和系统的 PATH 是一样，可以指定多个路径，每个路径可以包含纯 Python 实现的 zip 包，但不支持其它语言实现的 zip 包。

**注：** PYTHONHOME 指定的路径总是会自动添加到 PYTHONPATH 中。

### PYTHONSTARTUP

指定启动脚本文件。在 Python 命令行模式下，该文件中的 Python 代码会在交互式界面出来之前执行一遍。主要可于定制 Python 交互式环境的一些行为，如通过设置 sys.ps1 和 sys.ps2 来定制命令行提示符，又或者可添加类似如下的代码（可支持 Tab 补全功能）：

```python
import rlcompleter
import readline

readline.parse_and_bind("tab: complete")
```

### PYTHONY2K

解决 Y2K（千年虫，千年危机） 问题默认情况下 time 模块中如果有函数需要指定年参数时，可以为 4 位，也可以为 2 位。如果为 2 位，Python 会自动按照一定的规则进行转换，详情可见 time 模块官方文档。如果设置了该环境变量， time.accept2dyear 值就会变成 0，默认为 1。这样会导致 time 模块中如果有函数需要指定年参数时，必须要求为 4 位。

```
In [2]: time.mktime((12, 1, 1, 1, 1, 1, 1, 1, 1))
---------------------------------------------------------------------------
ValueError                                Traceback (most recent call last)
<ipython-input-2-7e161cf670eb> in <module>()
----> 1 time.mktime((12, 1, 1, 1, 1, 1, 1, 1, 1))

ValueError: year >= 1900 required

In [3]: time.accept2dyear
Out[3]: 0

In [4]: time.accept2dyear = 1

In [5]: time.mktime((12, 1, 1, 1, 1, 1, 1, 1, 1))
Out[5]: 1325350861.0
```

**注：** Python 后续版本已删除该环境变量。

`Y2K` 问题即计算机 2000 年问题，又叫做 “千年虫”、“电脑千禧年千年虫问题” 或 “千年危机”。缩写为 “Y2K”。是指在某些使用了计算机程序的智能系统（包括计算机系统、自动控制芯片等）中，由于其中的年份只使用两位十进制数来表示，因此当系统进行（或涉及到）跨世纪的日期处理运 算时（如多个日期之间的计算或比较等），就会出现错误的结果，进而引发各种各样的系统功能紊乱甚至崩溃。

### PYTHONOPTIMIZE

用于优化 Python 字节码。如果该环境变量被设定为一个非空字符串，就相当于 `-O` 命令行参数。如果该环境变量被设定为一个数字 N，就相当于 `-OO` （O 的个数为 N）命令行参数。

### PYTHONDEBUG

用于 Python 调试。如果该环境变量被设定为一个非空字符串，就相当于 -d 命令行参数。如果该环境变量被设定为一个数字 N, 就相当于 -dd (d 的个数为 N) 命令行参数。

### PYTHONINSPECT

如果该环境变量被设定为一个非空字符串，就相当于 `-i` 命令行参数。

### PYTHONUNBUFFERED

如果该环境变量被设定为一个非空字符串，就相当于 `-u` 命令行参数。即不使用缓冲区，实时刷新文件。

### PYTHONVERBOSE

如果该环境变量被设定为一个非空字符串，就相当于 `-v` 命令行参数。如果该环境变量被设定为一个数字 N, 就相当于 `-vv` (v 的个数为 N) 命令行参数。

### PYTHONCASEOK

如果该环境变量被设定了，Python 会在 import 模块时忽略模块名的大小写。此值只在 Windows, OS X, OS/2, and RiscOS 上有效。

### PYTHONDONTWRITEBYTECODE

如果该环境变量被设定了，Python 不会在导入源码模块时生成 .pyc 或 .pyo 文件。相当于 -B 命令行参数。

### PYTHONHASHSEED

如果该环境变量被设定为 random ，相当于 -R 命令行参数。Python 会用一个随机的种子来生成 str/bytes/datetime 对象的 hash 值。如果该环境变量被设定为一个数字，它就被当作一个固定的种子来生成 str/bytes/datetime 对象的 hash 值。

**注：** 该环境变量的目的是允许生成重复的 Hash， 这样可以用来进行 Python 解释器的自测， 或者允许 Python 进程的子进程能够分享同样的 hash 值。如果为数字，该数字范围为 `[0,4294967295]`。

### PYTHONIOENCODING

设定标准流 stdin/stdout/stderr 的默认编码格式。其格式为：

> encodingname:errorhandler

`:errorhandler` 是可选的，它的意思类似于 str.encode() 中的 errors 参数。

### PYTHONNOUSERSITE

如果该环境变量被设定了，Python 不会将用户的 site-packages 添加到 sys.path 中。

### PYTHONUSERBASE

用于设定用户主目录，根据用户主目录可推知用户的 site-packages 目录，以及使用 python setup.py install --user 时的安装目录。

### PYTHONEXECUTABLE

如果该环境变量被设定了， sys.argv[0] 就会为该环境变量的值。该环境变量只在 Mac OS X 上有效。

### PYTHONWARNINGS

如果该环境变量被设定为一个非空字符串，就相当于 `-W` 命令行参数。如果该环境变量被设定为一个数字 N, 就相当于 `-WW` (W 的个数为 N) 命令行参数。
