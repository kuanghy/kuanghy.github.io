---
layout: post
title: 浅谈Ubuntu系统的升级
category: Linux
tags: ubuntu ugrade
---

前段时间 Ubuntu 15.04 发布，可是我的系统还是 14.04, 于是决定升级到 15.04。就这样，有开始了折腾。按照往常的记忆，升级系统应该是这样的：

> $ sudo apt-get update && sudo apt-get dist-upgrade

打开终端，敲入命令，等了几个小时，升级完成。重启电脑：

> $ sudo reboot 

到登录界面的时候，我惊讶了，怎么还是 14.04 呢。难道是没有升级完全，于是又执行了一遍 **updata**、**dist-upgrade**。等了几个小时，升级完成，接着重启电脑。这下系统倒是升级了，给我升级到了 14.10。我想静一静，我得考虑我是不是还要继续 **updata** && **dist-upgrade**。

查了下资料，发现 Ubuntu 官方有这样一段话：

> Debian based systems can also be upgraded by using apt-get dist-upgrade. However, using do-release-upgrade is recommended because it has the ability to handle system configuration changes sometimes needed between releases.

他说，Ubuntu基于 Dedian 的，所以也能够采用 **apt-get dist-upgrade** 来升级系统，但是推荐使用 **do-release-upgrad** 来作为 Ubuntu 系统的升级。

使用 do-release-upgrad 需要安装 update-manager-core：

> $ sudo apt-get install update-manager-core

然后：

> do-release-upgrade --help

嗯， 属于可用状态。开始升级：

> $ sudo do-release-upgrade

长时间的等待。然后重启电脑，OK， 15.04 出现了。

了解了我的经历，你知道怎么升级 Ubuntu 系统了吗？
