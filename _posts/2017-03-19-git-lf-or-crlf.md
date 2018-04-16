---
layout: post
title: "Git 多平台换行符问题(LF or CRLF)"
keywords: git LF CRLF autocrlf safecrlf
description: "文本文件所使用的换行符，在不同的系统平台上是不一样的"
category: 计算机科学
tags: git
---

自从工作以后，基本上没有接触过 Windows 系统，偶尔使用 Windows 也是因为要写文档，Linux 下勉强可以用 WPS Office，但是格式与同事的不兼容，也算是迫不得已。而对我自己来说，大部分的文档都用 Mardown 来搞定。在很长一段时间里，我是很鄙视 Windows 的。

使用 Windows 系统时的诸多体验是让人讨厌的。感觉其大部分软件都很笨重，软件装得多了，磁盘就不够用了。不喜欢安装一个软件时捆绑安装一大堆无用的软件。不喜欢一些软件时不时的广告弹窗。

一些人说，玩 Linux 大部分时间都花在了折腾上，是的，的确是这样。首先是，Linux 的桌面不尽如人意，但它也可以很漂亮。Linux 是可以做高度定制的，从桌面环境到应用软件。我会经常尝试使用不同的发行版本，每重装、升级一次系统都要换上自己喜欢的桌面(做一堆的美化)，配置 shell 环境，装上自己常用的软件，卸载掉一些不用的软件。有时候还会把系统玩蹦，然后一切都得重来一遍。而之前用 Windows 的时候，我也喜欢折腾，要找一个漂亮的主题换上，要把部分特殊目录的图标改了，等等。反正，我是有些强迫症的。

使用计算机的人，对操作系统的选择，大部分的原因还是源于习惯和需求。前段时间，由于工作上的需要，要在 Windows 上做一些工作。用过 Linux，也用过 Mac OSX 后，再回归 Windows，感觉我已经不再排斥。或许是因为生活阅历、工作经验、年轮等的增长消磨了内心的一些偏激，让一些东西变得不再重要，更加懂得去包容。

目前，在开发中，使用 Git 作为版本管理工具还是比较流行的，大量的开源项目都在往 Github 迁移。Windows 上有 Git bash 客户端，基于 MinGW，有很多 GNU 工具可用，体验还不错。

在做完工作后，我尝试 `git add .`，想着这块工作可以告一段落了，而事实是：

```
$ git add .
fatal: CRLF would be replaced by LF ...
```

一脸懵逼，Google 一下吧，看看是什么原因。发现，这已经是一个非常经典的问题了：

![CRLF would be replaced by LF](http://wx1.sinaimg.cn/mw690/c3c88275ly1fdsav3d6yjj20hs0d5afx.jpg)

早就听说过这个问题，总算是亲自踩到这个坑里了。

**文本文件所使用的换行符，在不同的系统平台上是不一样的**。UNIX/Linux 使用的是 `0x0A（LF）`，早期的 Mac OS 使用的是 `0x0D（CR）`，后来的 OS X 在更换内核后与 UNIX 保持一致了。但 DOS/Windows 一直使用 `0x0D0A（CRLF）` 作为换行符。

跨平台协作开发是常有的，不统一的换行符确实对跨平台的文件交换带来了麻烦。最大的问题是，在不同平台上，换行符发生改变时，Git 会认为整个文件被修改，这就造成我们没法 `diff`，不能正确反映本次的修改。还好 Git 在设计时就考虑了这一点，其提供了一个 `autocrlf` 的配置项，用于在提交和检出时自动转换换行符，该配置有三个可选项：

- **true:** 提交时转换为 LF，检出时转换为 CRLF
- **false:** 提交检出均不转换
- **input:** 提交时转换为LF，检出时不转换

用如下命令即可完成配置：

```
# 提交时转换为LF，检出时转换为CRLF
git config --global core.autocrlf true

# 提交时转换为LF，检出时不转换
git config --global core.autocrlf input

# 提交检出均不转换
git config --global core.autocrlf false
```

如果把 autocrlf 设置为 false 时，那另一个配置项 `safecrlf` 最好设置为 **ture**。该选项用于检查文件是否包含混合换行符，其有三个可选项：

- **true:** 拒绝提交包含混合换行符的文件
- **false:** 允许提交包含混合换行符的文件
- **warn:** 提交包含混合换行符的文件时给出警告

配置方法：

```
# 拒绝提交包含混合换行符的文件
git config --global core.safecrlf true

# 允许提交包含混合换行符的文件
git config --global core.safecrlf false

# 提交包含混合换行符的文件时给出警告
git config --global core.safecrlf warn
```

到此，还并未解决我遇到的问题。实际上，我们有两种办法解决。

一种是将配置项改为如下的形式：

```
$ git config --global core.autocrlf false
$ git config --global core.safecrlf false
```

这种方式是不推荐的，虽然代码能被提交，但是项目中的文件可能会包含两种格式的换行符。而且会有如上提到的问题，文件被视为整个被修改，无法 diff，之所以使用版本控制工具，最重要的原因之一就是其 diff 功能。

另一种办法是，手动将文件的换行符转化为 LF，这可以通过编辑器来完成，大部分编辑器都可以将文件的换行符风格设置为 unix 的形式。也可以使用 `dos2unix` 转换工具来完成，Windows 上 Git bash 客户端自带了该工具。其他系统上也可以安装该工具，例如 Ubuntu 上安装：

> sudo apt-get install dos2unix

有了该工具，可以批量的把项目中的文件都转化一遍：

> find . -type f | xargs dos2unix

或者

> find . -type f -exec dos2unix {} +

如果涉及到在多个系统平台上工作，推荐将 git 做如下配置：

```
$ git config --global core.autocrlf input
$ git config --global core.safecrlf true
```

也就是让代码仓库使用统一的换行符(LF)，如果代码中包含 CRLF 类型的文件时将无法提交，需要用 `dos2unix` 或者其他工具手动转换文件类型。当然，可以根据自己的需要进行更为合适的配置！

到此，问题解决。go home！

**参考资料:**

- [http://toub.es/2012/05/28/fatal-crlf-would-be-replaced-lf](http://toub.es/2012/05/28/fatal-crlf-would-be-replaced-lf)
- [https://github.com/cssmagic/blog/issues/22](https://github.com/cssmagic/blog/issues/22)
