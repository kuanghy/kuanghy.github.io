---
layout: post
title: "Python 代码调试工具"
keywords: python debug pdb ipdb pudb 代码调试 Python代码调试
description: "Python官方提供了内置的代码调试器pdb, 也有一些第三方工具，如ipdb、pudb等"
category: Python
tags: python pdb debug
---

## pdb

The Python Debugger(pdb) 是官方调试器，内置在 Python 标准模块中，不用安装即可使用。常见的设置断点、打印变量、设置条件、单步运行、显示源代码这些功能都有。

> pdb scriptfile [arg] ...

基本使用命令：

| 命令           | 解释                                     |
|:---------------|:-----------------------------------------|
| help 或 h      | 帮助                                     |
| list 或 l      | 查看当前行的代码段                       |
| break 或 b     | 设置断点                                 |
| next 或 n      | 执行下一行                               |
| continue 或 c  | 继续执行程序                             |
| step 或 s      | 进入函数                                 |
| return 或 r    | 执行代码直到从当前函数返回               |
| exit 或 q      | 中止并退出                               |
| run            | 重新运行程序                             |
| restart        | 同 run                                   |
| p              | 打印变量的值                             |
| pp             | 以一种更更漂亮的方式打印变量的值         |
| condition      | 设置条件断点                             |
| clear 或 cl    | 清除断点，如果没有指定参数则清楚所有断点 |
| disable/enable | 禁用/激活断点                            |
| ignore         | 忽略断点                                 |
| jump 或 j      | 跳转到指定的行数                         |
| args 或 a      | 打印当前函数的参数                       |
| where 或 w     | 查看当前堆栈跟踪位置                     |

## ipdb

一个基于 ipython 的 pdb. 基本功能和 pdb 一样，只是调试时的 shell 利用了 ipython 的一些功能。比如有自动补全、语法高亮等功能。是一个增强版的 pdb.

> ipdb scriptfile [arg] ...

如果使用如下命令：

> ipython --pdb scriptfile [arg] ...

会自动在异常的地方进入 ipython shell.

## PuDB

一个全屏的基于控制台的可视化调试器，具有如下特性：

- 源码语法高亮，栈、断点、变量可见并且一直动态更新。变量展示还有很多可以定制化的功能。
- 基于键盘，简单高效。为什么说高效呢？ 因为它支持VI的鼠标移动。还支持 PDB 的某些命令
- 支持查找源代码，可以使用 m 代用 module browser 查看载入的模块
- 断点设置：鼠标移到某行代码，按b，然后可以在断点窗口编辑断点
- PuDB 看重异常处理，post-mortem 模式使折回到 crash 的最后一步更简单

安装：

> pip install pudb

使用如下命令进入调试：

> pudb scriptfile

或者

> python -m pudb.run scriptfile

基本命令：

| 命令 | 说明                                                                    |
|:-----|:------------------------------------------------------------------------|
| n    | next，也就是执行一步                                                    |
| s    | step into，进入函数内部                                                 |
| c    | continue                                                                |
| b    | break point，断点                                                       |
| e    | show traceback，显示堆栈跟踪，需要在 post-mortem 模式或方式异常的状态下 |
| o    | show console/output screen，显示输出                                    |
| /    | 查找代码                                                                |
| !    | python command line                                                     |
| ?    | help                                                                    |

还有一些其它的命令，使用 `?` 命令可以查看所有的命令以及其帮助信息。

## 参考

- [https://docs.python.org/2/library/pdb.html](https://docs.python.org/2/library/pdb.html)
- [http://python.jobbole.com/82638/](http://python.jobbole.com/82638/)
