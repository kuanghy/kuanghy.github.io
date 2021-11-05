---
layout: post
title: "Linux 后台运行程序"
keywords: 后台运行 后台进程 Linux jobs nohup screen fg bg setsid disown
description: "在 Linux 系统中的终端工作时，为了让进程让出终端执行其他任务，我们需要将进程放到后台运行"
category: Linux
tags: linux screen
---

在 Linux 系统中的终端工作时，有时需要将当前任务暂停调至后台，或有时须将后台暂停的任务重新开启并调至前台，这一序列的操作将会使用到 jobs、bg、和 fg 三个命令。

## jobs

`jos` 命令用于显示 Linux 中的任务列表及任务状态，包括后台运行的任务。该命令可以显示任务号及其对应的进程号。其中，任务号是以普通用户的角度进行的，而进程号则是从系统管理员的角度来看的。一个任务可以对应于一个或者多个进程号。

```shell
$ jobs
[1]-  stopped  ping -c 10 baidu.com
[2]+  stopped  ping -c 10 taobao.com
[3]   running  ping -c 10000 localhost > /dev/null 2>&1 &

$ jobs -l  # 显示进程号
[1]- 22703 stopped  ping -c 10 baidu.com
[2]+ 22810 stopped  ping -c 10 taobao.com
[3]  24148 running  ping -c 10000 localhost > /dev/null 2>&1 &

$ jobs -r  # 仅列出正在运行的进程
[3]    running    ping -c 10000 localhost > /dev/null 2>&1 &

$ jobs -s  # 仅列出暂停的进程
[1]  - suspended  ping -c 10 baidu.com
[2]  + suspended  ping -c 10 taobao.com
```

输出结果中的 `+` 表示是当前默认作业，`-` 减号表示是下一个默认作业。最前的需要为作业号。

要杀死一些后台作业，可以用 `kill %jobnum`，或者找到进程号，再用 `kill pid` 杀掉。

## &

如果需要在后台运行一个进程，可以在运行的命令后边加上 `&`。这样做只能让进程让出当前的终端以便做其他的事，但如果后台运行的进程有输出，仍然会打印到屏幕上，这样会干扰当前的工作。而且即使进程在后台运行，如果终端被关闭，该进程仍然会被杀掉。

## 'ctrl-z' 与 'bg'

快捷键 `ctrl-z` 能将进程放到后台运行，但进程会先处于暂停状态（suspended）。此时用 `bg` 命令将一个在后台暂停的命令，变成继续执行。所以要将一个前台正在运行的进程放入后台运行的步骤是：

- 先按组合键 `ctrl-z` 将其挂起
- 再用 `bg` 命名使其继续运行（可以直接使用 bg 命令不加任何参数，最后放入后台的作业会被标记为默认要运行的作业）

需要注意的是，如果挂起可能会影响当前进程的运行结果，需慎用。

```shell
$ ping baidu.com
PING baidu.com (39.156.69.79) 56(84) bytes of data.
64 bytes from 39.156.69.79: icmp_seq=1 ttl=52 time=4.69 ms
64 bytes from 39.156.69.79: icmp_seq=2 ttl=52 time=4.58 ms
^Z
[1]+  stopped  ping -c 10 baidu.com

$ bg
[2]+ ping -c 10 taobao.com &
64 bytes from 140.205.220.96: icmp_seq=3 ttl=49 time=20.9 ms
64 bytes from 140.205.220.96: icmp_seq=4 ttl=49 time=20.7 ms

$ jobs
[1]+  stopped  ping -c 10 baidu.com
[3]-  running  ping -c 10 -c 10000 localhost > /dev/null 2>&1 &

$ bg %1
[1]+ ping -c 10 baidu.com &
64 bytes from 39.156.69.79: icmp_seq=3 ttl=52 time=4.73 ms
64 bytes from 39.156.69.79: icmp_seq=4 ttl=52 time=4.56 ms

$ jobs
[3]+  running  ping -c 10 -c 10000 localhost > /dev/null 2>&1 &
```

## fg

`fg` 命令用于将后台作业（在后台运行的或者在后台挂起的作业）放到前台终端运行。

```shell
$ fg %3
ping -c 10 -c 10000 localhost > /dev/null 2>&1
```

## nohup

当用户注销（logout）或者网络断开时，终端会收到 HUP（hangup）信号从而关闭其所有子进程。也就是任何在终端启动的正在运行的进程都会停止。很多时候，我们会通过 ssh 远程连接服务器来工作，在网络状况很糟糕的情况下，一段网络中断我们的工作就会被打断。如果我们正在进行一项很重要的工作，这无疑是个灾难。

`nohup` 命令可以让提交的命令忽略 hangup 信号。标准输出和标准错误缺省会被重定向到 nohup.out 文件中。但是用 nohub 启动的进程仍然在前台运行，不会让出终端。

一般我们可在结尾加上 `&` 来将命令同时放入后台运行，也可用 `>filename 2>&1` 来更改缺省的重定向文件名。这样进程既可以不被 hangup 信号打断，又能够将终端让出。例如在后台执行耗时的 du 命令：

```
nohub du sh /* | sort -h > /tmp/du.log 2>&1 &
```

`nohup` 无疑能通过忽略 HUP 信号来使我们的进程避免中途被中断。`2>&1` 的作用是将标准错误 2 重定向到标准输出 1 中。此处 1 前面的 `& ` 就是为了让 shell 将 1 解释成标准输出而不是文件 1。

在 shell 中 0，1，2 三个数字分别代表 STDIN_FILENO、STDOUT_FILENO、STDERR_FILENO，即标准输入（一般是键盘），标准输出（一般是显示屏，准确的说是用户终端控制台），标准错误（出错信息输出）。

默认输入只有一个输入（0，STDIN_FILENO），而默认输出有两个（标准输出1 STDOUT_FILENO，标准错误2 STDERR_FILENO）。因此默认情况下，shell 输出的错误信息会被输出到 2，而普通输出信息会输出到 1。

## setsid

如果我们的进程不属于接受 HUP 信号的终端的子进程，那么自然也就不会受到 HUP 信号的影响了。`setsid` 就能帮助我们做到这一点。setsid 用于在一个新的会话中运行程序， 其父进程为 `init`。

示例：

> setsid ping www.baidu.com

## disown

如果事先在命令前加上 nohup 或者 setsid 就可以避免 HUP 信号的影响，但是如果我们未加任何处理就已经提交了命令，该如何补救才能让它避免 HUP 信号的影响呢？

这种情况我们可以用 disown 并配置作业调度来让进程忽略 HUB 信号。使用方法：

```
disown -h %1  使某个作业忽略 HUP 信号, 1 为作业号
disown -ah  使所有的作业都忽略 HUP 信号
disown -rh  使正在运行的作业忽略 HUP 信号
```

## screen

`Screen` 是一个可以在多个进程之间多路复用一个物理终端的窗口管理器。Screen 中有会话的概念，会话可以保持你的工作，即使网络断开会话仍然被保存，这样便可以保证运行的程序不被打断。而且还可以创建多个会话，并在不同会话间切换。类似的工具还要 tmux、dvtm、splitvt、byobu 等。

## 参考

- [http://www.ibm.com/developerworks/cn/linux/l-cn-nohup/](http://www.ibm.com/developerworks/cn/linux/l-cn-nohup/)
- [http://man.linuxde.net/jobs](http://man.linuxde.net/jobs)
- [http://man.linuxde.net/bg](http://man.linuxde.net/bg)
- [http://man.linuxde.net/fg](http://man.linuxde.net/fg)
- [http://www.ibm.com/developerworks/cn/linux/l-cn-screen/](http://www.ibm.com/developerworks/cn/linux/l-cn-screen/)
