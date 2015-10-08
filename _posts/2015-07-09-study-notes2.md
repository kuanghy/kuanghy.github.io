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

**常用选项说明：**
<div class="hblock"><pre>
-e 显示所有进程。
-f 全格式。
-h 不显示标题。
-l 长格式。
-w 宽输出。

a 显示终端上的所有进程，包括其他用户的进程。
r 只显示正在运行的进程。
u 以用户为主的格式来显示程序状况。
x 显示所有程序，不以终端机来区分。
</pre></div>

**常用方法:**

（1）列出目前所有的，正在内存中的进程

> ps aux 或者 ps -aux （加“-”与不加一样）

该命令列出进程信息的格式为：
<div class="hblock"><pre>
USER  PID  %CPU  %MEM  VSZ  RSS  TTY  STAT  START  TIME  COMMAND
</pre></div>

（2）显示所有进程信息，连同命令行

> ps -ef

该命令列出进程信息的格式为：
<div class="hblock"><pre>
UID  PID  PPID  C  STIME  TTY  TIME CMD
</pre></div>

显示信息各列含义：
<div class="hblock"><pre>
UID 用户ID
PID 进程ID
PPID 父进程ID
C CPU占用率
STIME 开始时间
TTY 开始此进程的TTY
TIME 此进程运行的总时间
CMD 命令名
</pre></div>

其实`ps aux`与`ps -ef`的功能几乎一样。如果要讨论他们的差别，则要追溯到Unix系统中的两种风格，System Ｖ风格和BSD 风格，ps aux最初用到Unix Style中，而ps -ef被用在System V Style中，两者输出略有不同。现在的大部分Linux系统都是可以同时使用这两种方式的。

（3）列出类似程序树的程序显示

> ps -axjf


