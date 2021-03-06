---
layout: post
title: 学习札记篇二
keywords: 学习 札记 ln ps
category: 学习札记
tags: 札记
---

## Linux 文件链接
（1） 硬链接
即是同一个文件在文件系统中的不同名字，这些名字都指向同一个 inode， “ls -l”显示信息的第二栏便是文件的硬链接数。

> ln 源文件 目标文件 （默认不带参数的ln是创建硬链接）

（2） 软链接
即相当于快捷方式，软链接又称之为符号链接文件，该文件中存放着源文件的路径名

> ln -s 源文件 目标文件

## PS 命令简介

Linux 上进程的几种状态为：

- （1）R: 运行，正在运行或在运行队列中等待
- （2）S: 中断，休眠中，受阻，在等待某个条件的形成或接收到信号
- （3）D: 不可中断，收到信号不唤醒和不可运行，进程必须等待直到有中断发生
- （4）Z: 僵死，进程已终止，但进程描述还在，等待父进程调用 wait 系统调用后释放
- （5）T: 停止，收到 SIGSTOP, SIGSTP, SIGTOU 信号

附加状态表示：

- <：优先级高的进程
- N：优先级低的进程
- L：有些页被锁进内存
- X：退出（进程即将被销毁，基本很少见）
- W：进入内存交换（从内核2.6开始无效）
- s：进程的领导者（在它之下有子进程）
- l：是多线程
- +：位于后台的进程组

**常用选项说明：**

```
-e 显示所有进程
-f 全格式
-h 不显示标题
-l 长格式
-w 宽输出

a 显示终端上的所有进程，包括其他用户的进程
r 只显示正在运行的进程
u 以用户为主的格式来显示程序状况
x 显示所有程序，不以终端机来区分
```

**常用方法:**

（1）列出目前所有的，正在内存中的进程

> ps aux 或者 ps -aux （加“-”与不加一样）

该命令列出进程信息的格式为：

```
USER  PID  %CPU  %MEM  VSZ  RSS  TTY  STAT  START  TIME  COMMAND
```

（2）显示所有进程信息，连同命令行

> ps -ef

该命令列出进程信息的格式为：

```
UID  PID  PPID  C  STIME  TTY  TIME CMD
```

显示信息各列含义：

```
UID 用户ID
PID 进程ID
PPID 父进程ID
C CPU占用率
STIME 开始时间
TTY 开始此进程的TTY
TIME 此进程运行的总时间
CMD 命令名
```

其实 `ps aux` 与 `ps -ef` 的功能几乎一样。如果要讨论他们的差别，则要追溯到Unix系统中的两种风格，System Ｖ 风格和 BSD 风格，ps aux 最初用到 Unix Style 中，而 ps -ef 被用在 System V Style 中，两者输出略有不同。现在的大部分 Linux 系统都是可以同时使用这两种方式的。

（3）列出类似程序树的程序显示

> ps -axjf
