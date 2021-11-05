---
layout: post
title: "Linux 下的 tmpfs 与 /dev/shm"
keywords: Linux tmpfs tempfs shm /dev/shm Python SharedArray
description: "tmpfs 是 Linux/Unix 系统上的一种基于内存的文件系统，即 tmpfs 使用内存或 swap 分区来存储文件。"
category: Linux
tags: linux 共享内存 shm
---

`tmpfs` 是 Linux/Unix 系统上的一种基于内存的文件系统，即 tmpfs 使用内存或 swap 分区来存储文件。

Linux 内核中的 VM 子系统负责在后台管理虚拟内存资源 Virtual Memory，即 RAM 和 swap 资源，透明地将 RAM 页移动到交换分区或从交换分区到 RAM 页，tmpfs 文件系统需要 VM 子系统的页面来存储文件。tmpfs 自己并不知道这些页面是在交换分区还是在 RAM 中；做这种决定是 VM 子系统的工作。tmpfs 文件系统所知道的就是它正在使用某种形式的虚拟内存。

由于 tmpfs 是基于内存的，因此速度是相当快的。另外 tmpfs 使用的 VM 资源是动态的，当删除 tmpfs 中文件，tmpfs 文件系统驱动程序会动态地减小文件系统并释放 VM 资源，当然在其中创建文件时也会动态的分配VM资源。另外，tmpfs 不具备持久性，重启后数据不保留。

`/dev/shm` 就是一个基于 tmpfs 的设备，在有些 Linux 发行版中 `/dev/shm` 是 `/run/shm/` 目录的一个软链接。实际上在很多系统上的 `/run` 是被挂载为 tmpsf 的。用 `df -T` 可以查看系统中的磁盘挂载情况：

```
文件系统          1K-块     已用     可用 已用% 挂载点
udev            1859684        4  1859680    1% /dev
tmpfs            374096     1524   372572    1% /run
/dev/sda8      76561456 36029540 36619724   50% /
none                  4        0        4    0% /sys/fs/cgroup
none               5120        0     5120    0% /run/lock
none            1870460    27688  1842772    2% /run/shm
none             102400       56   102344    1% /run/user
```

那么，我们就先来说说 `/run` 目录。现在我们知道，该目录是基于内存的，实际上它的前身是 `/var/run` 目录，后来被 `/run` 替换。这是因为 `/var/run` 文件系统并不是在系统一启动就是就绪的，而在此之前已经启动的进程就先将自己的运行信息存放在 `/dev` 中，`/dev` 同样是一种 `tmpfs`，而且是在系统一启动就可用的。但是 `/dev` 设计的本意是为了存放设备文件的，而不是为了保存进程运行时信息的，所以为了不引起混淆，`/dev` 中存放进程信息的文件都以 "." 开始命名，也就是都是隐藏文件夹。但是即便是这样，随着文件夹的数量越来越多，`/dev` 里面也就越来越混乱，于是就引入了替代方案，也就是 `/run`。实际上在很多系统上 `/var/run` 目录仍然存在，但其是 `/run` 目录的一个软链接。

`/var/run` 目录中主要存放的是自系统启动以来描述系统信息的文件。比较常见的用途是 daemon 进程将自己的 pid 保存到这个目录。

`/dev/shm/` 是 Linux 下一个非常有用的目录，它的意思是 **Shared memory**，也就是共享内存。由于它在内存上，所以所有系统进程都能共享该目录。默认情况下它的大小是内存的一半。如果希望改变它的大小，可以用 mount 来管理：

> mount -o size=4000M -o nr_inodes=1000000 -o noatime,nodiratime -o remount /dev/shm

如果希望永久生效，可以修改 `/etc/fstab` 文件：

```
tmpfs /dev/shm tmpfs defaults,size=4G 0 0
```

利用 `/dev/shm` 可以做很多事情，这里说一个 Python 的应用。用 Python 做数据处理时，可能会用到 [numpy](https://docs.scipy.org/doc/numpy/index.html)，通常做数据处理时的数据量都是很大的，如果有多个进程都需要用到同样的数据，那么 `/dev/shm` 就派上了用场，也就是用共享内存技术。Python 有一个第三方库可以用来在多个进程间共享 numpy 数组，即 [SharedArray](https://pypi.python.org/pypi/SharedArray)。SharedArray 便是基于 `/dev/shm` 的，并且采用 POSIX 标准，能够兼容多个平台。

#### 参考资料

- [http://blog.ddup.us/2011/04/01/disappearing-var-run-dir/](http://blog.ddup.us/2011/04/01/disappearing-var-run-dir/)
- [http://blog.csdn.net/guo8113/article/details/28590963?utm_source=tuicool&utm_medium=referral](http://blog.csdn.net/guo8113/article/details/28590963?utm_source=tuicool&utm_medium=referral)
- [http://www.linuxidc.com/Linux/2014-05/101818.htm](http://www.linuxidc.com/Linux/2014-05/101818.htm)
