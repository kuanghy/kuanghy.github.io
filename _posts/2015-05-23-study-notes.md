---
layout: post
title: 学习札记篇一
keywords: adduser vim shell zenity inno
category: 学习札记
tags: 札记
---

**1、 Linux**

在 ubuntu 下添加用户名最好用 **adduser** 命令，例如：

> $ sudo adduser git

**2、Vim**

Vim 的信息文件 **viminfo** 用于存储状态信息：

* 命令行和模式搜索的历史记录。
* 寄存器内文本
* 各种文件标记
* 缓存器列表
* 全局变量

应该保证 viminfo 文件对当前用户可读可写才能正常使用。

**3、Windows**

**inno setup** 用于 windows 中制作 .exe 可执行程序的安装文件，主要通过编写脚本文件 “.iss” 文件来实现。

**4、Linux**

**zenity** 是Linux下的一个应用命令，用于显示 GTK+ 图形对话框，主要用于shell脚本中。也就是说，再shell脚本中运用 zenity 可以实现图形界面编程。

**5、Linux**

Linux 中制作 deb 安装包的方法：

* dh_make + dpkg-buildpackage
* checkinstall

**6、Linux**

Shell 脚本中屏蔽指令执行的回显信息：

* 用重定向，将输出放入一个文件中，然后删除文件；
* 将输出重定向到 /dev/null，**/dev/null** 俗称黑洞。

**7、Linux**

**xargs** 是 unix 和类 unix 操作系统的常用命令，它的作用是将参数列表转换成小块分段传递给其他命令，意避免参数列表多长的问题，例如：

> $ rm \`find /path -type f`

如果 path 目录下文件过多就会因为“参数列表过长”而报错无法执行。但是用下面的方法就不会报错：

```bash
$ find /path -type f | xargs rm
```

这样 xargs 会将 find 产生的长串文件列表拆成多个子串，然后对每个子串调用 rm。

**8、Linux**

Ubuntu 系统的注销（重启图形界面）：

> $ sudo pkill Xorg

**9、Linux**

Linux 下解压 **rar 压缩包**：

```
$ unrar x s.rar           # 解压所有文件到 s 目录
$ unrar e s.rar           # 解压所有文件到当前目录
$ unrar s.rar -d /tmp/s   # 解压文件到指定目录 /tmp/s 中
```

**10、Linux**

**Shell 中的函数体不能为空**，需要空函数时应当在函数体内加一条空语句，**shell 中的空语句为 : (冒号)**。
