---
layout: post
title: "Linux 创建交换（swap）分区"
keywords: swap 交换分区 内存置换空间 linux 内存交换 swappiness fallocate
description: "Linux 的交换分区 swap 用于解决系统内存吃紧的问题，可将部分内存暂时导到磁盘中"
category: Linux
tags: linux swap
---

Linux 的交换分区（swap），或者叫内存置换空间（swap space），是磁盘上的一块区域，可以是一个分区，也可以是一个文件，或者是他们的组合。交换分区的作用是，当系统物理内存吃紧时，Linux 会将内存中不常访问的数据保存到 swap 上，这样系统就有更多的物理内存为各个进程服务，而当系统需要访问 swap 上存储的内容时，再将 swap 上的数据加载到内存中，也就是常说的 swap out 和 swap in。

使用 swap 必须要知道它存在的缺点，以便判断何时使用交换分区。使用交换分区的好处当然就是可以一定程度的缓解内存空间紧张的问题。然而，由于 CPU 所读取的数据都来自于内存，交换分区则是存放在磁盘上的，磁盘的速度和内存比较起来慢了好几个数量级，如果不停的读写 swap，那么对系统的性能肯定有影响，尤其是当系统内存很吃紧的时候，读写 swap 空间发生的频率会很高，导致系统运行很慢。

如果使用是桌面系统，由于系统会自动将不常用的内存数据移到 swap 上，对桌面程序来说，有可能会导致最小化一个程序后，再打开时小卡一下，因为需要将 swap 上的数据重新加载到内存中来。在部署了数据库的系统上，也不建议用交换分区，因为频繁地在内存和磁盘上相互导数据会影响数据库性能。

交换分区大小的设置建议值：

- 内存小于 4GB 时，推荐不少于 2GB 的 swap 空间
- 内存 4GB~16GB，推荐不少于 4GB 的 swap 空间
- 内存 16GB~64GB，推荐不少于 8GB 的 swap 空间
- 内存 64GB~256GB，推荐不少于 16GB 的 swap 空间

创建交换分区需要有一块独立的分区，如果没有多余的分区时，可以用交换分区文件来代替。创建交换文件：

```
dd if=/dev/zero of=/swap bs=1MB count=8192

或

fallocate -l 8G /swap
```

验证交换文件大小：

```
du -sh /swap
```

改变文件的用户、组以及权限：

```
chown root:root /swap
chmod 600 /swap
```

格式化文件为 swap 文件系统：

```
mkswap -L swap /swap
```

挂载交换分区：

```
swapon /swap
```

查看交换分区：

```
free -h
```

编辑 /etc/fstab 文件以便开机自动挂载：

```
/swap    swap            swap    defaults    0 0
```

卸载交换分区：

```
swapoff /swap
```

内核参数 `vm.swappiness` 控制换出运行时内存的相对权重，参数值大小对如何使用 swap 分区有很大联系。值越大，表示越积极使用 swap 分区，越小表示越积极使用物理内存。一般系统的默认值 swappiness=60，表示内存使用率超过 100-60=40% 时开始使用交换分区。swappiness=0 的时候表示最大限度使用物理内存，然后才是 swap 空间；swappiness＝100 的时候表示积极使用 swap 分区，并把内存上的数据及时搬运到 swap 空间（对于 3.5 以后的内核和 RedHat 2.6.32 之后的内核，设置为 0 会禁止使用 swap，从而引发 out of memory，这种情况可以设置为 1）。查看参数值：

```
cat /proc/sys/vm/swappiness
```

临时调整该值：

```
sysctl vm.swappiness=40
```

永久调整需编辑 /etc/sysctl.conf 文件，加入如下内容：

```
vm.swappiness=10
```

然后加载参数：

```
sysctl -p
```

参考：

- [https://yq.aliyun.com/articles/194733](https://yq.aliyun.com/articles/194733)
- [https://www.cnblogs.com/svenwu/p/9540318.html](https://www.cnblogs.com/svenwu/p/9540318.html)
- [https://blog.csdn.net/andyguan01_2/article/details/89315345](https://blog.csdn.net/andyguan01_2/article/details/89315345)
