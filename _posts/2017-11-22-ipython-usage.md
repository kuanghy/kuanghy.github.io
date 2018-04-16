---
layout: post
title: "IPython 基本使用"
keywords: ipython python shell 解释器 交互式解释器
description: "IPython 是一个加强版的 Python 交互式 Shell"
category: Python
tags: python
---

`ipython` 是一个 python 的交互式 shell，支持变量自动补全，自动缩进，支持 bash shell 命令，内置了许多很有用的功能和函数，比默认的 python shell 好用得多。IPython 已经成为用 Python 做教学、计算、科研的一个重要工具

2001 年, Fernando Pérez 为了得到一个更为高效的交互式 Python 解释器而启动了一个业余项目, 于是 IPython 项目诞生了。之后，它逐渐被公认为现代科学计算中最重要的 Python 工具之一。IPython 本身并没有提供任何的计算或数据分析功能, 其设计目的是在交互式计算和软件开发这两个方面最大化地提高生产力。它鼓励一种 `“执行-探索”(execute explore)` 的工作模式, 而不是许多其他编程语言那种“编辑-编译-运行”(edit-complie-run)的传统工作模式。此外, 它跟操作系统shell和文件系统之间也有着非常紧密的集成。由于大部分的数据分析代码都含有探索式操作(试误法和迭代法), 因此 IPython (在绝大多数情况下)将有助于提高你的工作效率。

## 基础

IPython 安装可以用如下命令：

> apt-get install ipython

> yum install ipython

> pip install ipython

安装完成后，终端输入 ipython 即可进入其环境，如下所示：

```python
$ ipython
Python 3.5.3 |Continuum Analytics, Inc.| (default, Mar  6 2017, 11:58:13)
Type 'copyright', 'credits' or 'license' for more information
IPython 6.1.0 -- An enhanced Interactive Python. Type '?' for help.

In [1]:
```

IPython 基本的使用与 python 的默认解释器相同，但 ipython 支持部分 shell 命令，如下所示：

```python
In [1]: print "hello world"
hello world

In [2]: range(10)
Out[2]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

In [3]: ls
aboutme/  miniconda2/  temp/    模板/  图片/  下载/  桌面/
kvenv/    PyEnvs/      公共的/  视频/  文档/  音乐/

In [4]: pwd
Out[4]: u'/home/huoty'
```

IPython 将许多 Python 对象都被格式化为可读性更好(或者说排版更好)的形式，使得可读性更强。IPython 支持 Tab 自动补全，使用起来十分方便。

## 内省

在变量名或命令的前面或后面加一个 `“？” ` 并执行，可以用于显示该对象的一些通用信息，如对象类型、文档字符串等，这就叫做对象内省（object introspection）。例如：

```python
In [1]: l = [2, 3, 4 ,5]

In [2]: l?
Type:        list
String form: [2, 3, 4, 5]
Length:      4
Docstring:
list() -> new empty list
list(iterable) -> new list initialized from iterable's items

In [3]: list?
Docstring:
list() -> new empty list
list(iterable) -> new list initialized from iterable's items
Type:      type
```

使用 `“??”` 还将显示出该函数的源代码（如果可能的话）。`“？” ` 的另一个用法是可以搜索 IPython 的命名空间，。一些字符再配以通配符（*）即可显示出所有与该通配符表达式相匹配的名称。如：

```python
In [10]: import time

In [11]: time.*time*?
time.asctime
time.ctime
time.gmtime
time.localtime
time.mktime
time.strftime
time.strptime
time.struct_time
time.time
time.timezone
```

## 魔法

IPython 有一些特殊命令，被称为魔法命令（Magic Command），它们有的为常见任务提供便利，有的则使你能够轻松控制 IPython 系统的行为。魔术命令是以百分号 `%` 为前缀的命令。例如，你可以通过 `%timeit` 这个魔法命令检测任意 Python 语句的执行时间。魔法命令可以看做运行于 IPython 系统中的命令行程序，它们大都还有一些“命令行选项”，使用 `？` 即可查看其选项，例如 `%run？` 命令用于查看帮助。

在 IPython 会话环境中，所有文件都可以通过 %run 命令当做 Python 程序来运行，同时支持命令行参数。假设你在 ipython_script_test.py 中存放了一段简单的脚本，那么可以用如下方式执行：

```python
In [5]: %run ipython_script_test.py
```

脚本是在一个空的命名空间中运行的（没有任何import，也没有定义任何其他的变量），所以其行为应该跟在标准命令行环境（通过python script.py启动的）中执行时一样。此后，该文件中所定义的全部变量（还有各种import、函数和全局变量）就可以在当前IPython shell中访问了（除非发生了异常）。 如果希望脚本能够访问在交互式IPython命名空间中定义的变量，那就应该使用`%run i`而不是`%run`。

另外一些常用的魔术命令如下所示：

```
%quickref    显示 IPython 快速参考
%magic    显示所有魔术命令的详细文档
%debug    从最新的异常跟踪的底部进入交互式调试器
%pdb    在异常发生后自动进入调试器
%reset    删除 interactive 命名空间中的全部变量
%run script.py    执行 script.py
%prun statement     通过 cProfile 执行对 statement 的逐行性能分析
%time statement     测试 statement 的执行时间
%timeit statement    多次测试 statement 的执行时间并计算平均值
%hist    显示历史命令，很多可选参数，可用于制作命令说明
%dhist    显示历史目录，用 cd -n 可以直接跳转；
%who、%who_ls、%whos    显示 interactive 命名空间中定义的变量，信息级别/冗余度可变
%xdel variable    删除 variable，并尝试清除其在 IPython 中的对象上的一切引用
%bookmark    使用 IPython 的目录书签系统
%cd direcrory    切换工作目录
%pwd    返回当前工作目录（字符串形式）
%env    返回当前系统变量（以字典形式）

!cmd    在系统 shell 执行 cmd
output=!cmd args    执行 cmd 并赋值
```

在 IPython 中还可以用 `ed` 或 `edit` 命令编辑一个文件并执行，`ed -x filename` 则表示编辑文件不执行。用 `pycat filename` 命令可以语法高亮显示一个文件。

IPython 还有很多的魔术命令，不熟悉的话可以通过 `%magic` 查看详细文档；对某一个命令不熟悉的话，可以通过 `%cmd?` 内省机制查看特定文档。值得一提的是，IPython 中使用 del 命令无法删除所有的变量引用，因此垃圾回收机制也无法启用，所以有些时候你会需要使用 `%xdel` 或者 `%reset`。


## 参考资料
- [http://my.oschina.net/lionets/blog/274760](http://my.oschina.net/lionets/blog/274760)
- [http://ipython.readthedocs.org](http://ipython.readthedocs.org)
