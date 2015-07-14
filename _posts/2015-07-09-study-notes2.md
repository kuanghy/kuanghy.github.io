---
layout: post
title: 学习札记篇二
category: 学习札记
tags: ln ps
---

## Linux 文件链接
（1） 硬链接
即是同一个文件在文件系统中的不同名字，这些名字都指向同一个 inode， “ls -l”显示信息的第二栏便是文件的硬链接数。

> ln 源文件 目标文件 （默认不带参数的ln是创建硬链接）

（2） 软链接
即相当于快捷方式，软链接又称之为符号链接文件，该文件中存放着源文件的路径名

> ln -s 源文件 目标文件

<br/>
## PS 命令简介
Linux上进程的5种状态为：
（1）运行
（2）中断
（3）不可中断
（4）僵死
（5）停止

对应的 ps 工具标识为： R、S、D、Z、T

**常用方法:**

（1）列出目前所有的，正在内存中的进程

> ps aux 或者 ps -aux （加“-”与不加一样）

（2）显示所有进程信息，连同命令行

> ps -ef

（3）列出类似程序树的程序显示

> ps -axjf