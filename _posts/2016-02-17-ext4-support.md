---
layout: post
title: "让一些老的系统支持 ext4 文件系统"
keywords: ext4
description: "Ext4文件系统是Linux系统下的日志文件系统，是ext3文件系统的后继版本。"
category: linux
tags: ext4
---
{% include JB/setup %}

`Ext4` 文件系统（第四扩展文件系统）是Linux系统下的日志文件系统，是ext3文件系统的后继版本。其特点有：大型文件系统、Extents、向下兼容、预留空间、延迟取得空间、突破32000子目录限制、日志校验和、在线磁盘整理、快速文件系统检查。

由于工作需求，需要在一台 CentOS 5 系统中将一块硬盘格式化为 ext4，却发现系统中没有 `mkfs.ext4`。后来发现 CentOS 5 是支持 ext4 文件系统的，只是默认没有开启而已，这一点可以通过查看内核模块来验证：

> ll /lib/modules/<kernel version>/kernel/fs/ext4

因此我们可以通过手动加载 ext4 模块来让系统支持 ext4 文件系统。加载模块用 `modprobe` 命令，添加完后用 lsmod 查看加载情况：

> modprobe ext4

> lsmod | grep ext4

为了使用 `mkfs.ext4` 命令分区，可以通过 yum 安装一下 e4fsprogs 的 rpm 包:

> yum install -y e4fsprogs

这样，系统便能支持 ext4 文件系统了。