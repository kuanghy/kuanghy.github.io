---
layout: post
title: "Linux 下一些有用或者有趣的软件"
keywords: Linux software gimp retext terminator cmatrix
description: "收集 Linux 下一些有用或者有趣的软件。"
category: Linux
tags: linux
---

收集 Linux 下一些有用或者有趣的软件。

### Transmission

Transmission 是一种 BitTorrent 客户端，特点是一个跨平台的后端和其上的简洁的用户界面。BT 种子一种“.torrent”文件，装有BT（BitTorrent）下载必须的文件信息，作用相当于HTTP下载里的URL链接

### gimp

图形处理

### steam

游戏客户端

### bleachbit

系统记录清理工具

### xdman

 Xtreme Download Manager, 下载管理器

### preload

Preload 是一个自适应预读守护进程。它监控用户运行的应用程序，并且分析这些数据，预测用户可能运行的程序，并读取这些程序的二进制文件及其依赖文件到系统内存，以达到加速启动的时间。Preload 将在后台静静运行。如果你想改变 Preload 的行为，你可以编辑它的配置文件 /etc/preload.conf。

### apt-fast

Apt-fast 是一款替代 apt-get 提升下载速度的软件，安装软件时，通过增加线程使下载软件速度加快。 Apt-fast 已经更新到1.6.4版本，引入配置“对话框”，在其安装过程中，一步步对话框选择设置，每个用户的配置选项，从而改善和清晰化 Apt-fast的初始配置过程。

### AppGrid

一个优秀的Ubuntu软件中心替代品

### diffuse

文件比较工具

### ReText

markdown 文档编辑器

- 配置数学公式：

有时候需要在文档中添加一些数学公式，比如时间复杂度什么的O(N2)，其实，我发现Github官网的页面是不支持的，不知道是不是Github有自己的数学公式输入格式。

在Retext下想使用，首先应该先安装MathJax

> sudo apt-get install libjs-mathjax

安装好后，打开ReText的设置界面，在Markdown extensions框里添加字段：mathjax，重启ReText，输入公式，如 N32 ，OK！

- 添加语法高亮：

ReText支持语法高亮，但需要在在Markdown extensions框里添加字段：codehilite，同时，需要下载安装高亮支持模块python-pygments：

> sudo apt-get install python-pygments

这个方法来自与ReText的扩展说明, 文档里的扩展功能添加进ReText的Markdown extensions时，都必须该成小写字母，否则无效！同时，两个扩展之间用英文逗号分割。

### Remarkable

[Remarkable](https://remarkableapp.github.io/linux.html), Linux 下的 markdown 文档编辑器。

### brackets

Web 前端编辑器

### terminology

万能的终端工具

### terminator

一个不错的终端工具

### terminix

GTK3 终端模拟器

### TermKit

TermKit 是由 Steven Wittens 为 MacOS X 编写的一个很有趣的项目，可以称之为下一代的富媒体终端。

### Tmux

[Tmux](https://tmux.github.io/) 是一个优秀的终端复用软件。使用它最直观的好处就是，通过一个终端登录远程主机并运行tmux后，在其中可以开启多个控制台而无需再“浪费”多余的终端来连接这台远程主机。

### nmon

Nmon（nigel’s monitor 的简写）是一个显示系统性能信息的工具,可以显示与 netwrok，cpu, memory 和磁盘使用情况的信息。

### ncdu

是一个支持光标的 du 程序，这个命令是用来分析各种目录占用的磁盘空间。按 n 则通过文件名来排序，按 s 则按文件大小来排序（默认的）。

### dstat  

一种灵活的组合工具，它可用于监控内存，进程，网络和磁盘性能，它可以用来取代 ifstat, iostat, dmstat 等。

### slurm

一个网卡带宽监控命令行实用程序，它会自动生成 ASCII 图形输出。安装:

> apt-get install slurm

使用：

> slurm -i <网卡名称>

### ranwhen.py

一种基于 Python 的终端工具，它可以用来以图形方式显示系统活动状态

### plymouth-manager

修改开机登录界面。可以美化你Ubuntu的启动主题Plymouth，下载：[https://launchpad.net/plymouth-manager/+download](https://launchpad.net/plymouth-manager/+download)

### kazam

屏幕录制软件

### firebug

火狐插件，Web开发者调试工具

### okular

阅读器，可用于阅读pdf，也可用于阅读epub电子书。

### ranger

基于终端的文件浏览器

### lolcat

输入彩色文本，例如 cat "hello world" | lolcat

### cmatrix

终端打印矩阵


### Weather Indicator Applet (天气预报)

安装命令：

> sudo apt-get install indicator-weather

### ClassicMenu

经典的 GNOME2 菜单, 安装命令：

> sudo apt-add-repository ppa:diesch/testing
>
> sudo apt-get update
>
> sudo apt-get install classicmenu-indicator

### Caffeine（咖啡因）

你怎样确保你的电脑不会在放一部精彩的电影中途突然休眠呢？Caffeine 会帮助你解决这个问题。当然，你并不需要为你的电脑泡一杯咖啡。你只需要安装一个轻量级的指示器 —— Caffeine。只要当前你是全屏模式，它就会禁用你的屏幕保护程序、锁屏程序，让你的电脑不会因为没有在任务中而进入睡眠模式。

> sudo add-apt-repository ppa:caffeine-developers/ppa
>
> sudo apt-get update
>
> sudo apt-get install caffeine
>
> sudo apt-get install libappindicator3-1 gir1.2-appindicator3-0.1

### gparted

格式化、分区工具

### cheat

Linux 命令备忘清单，[https://github.com/chrisallenlane/cheat](https://github.com/chrisallenlane/cheat)

### htop

htop 是一个更加先进的交互式的实时监控工具。htop 与 top 命令非常相似，但是他有一些非常丰富的功能，如用户友好界面管理进程、快捷键、横向和纵向进程等更多的。htop 是一个第三方工具并不包括在 Linux 系统中，你需要使用包管理工具进行安装。

### Tickeys

Tickeys是一款很强大的键盘音效软件。Tickeys 自带多种声音效果方案，有打字机、冒泡、机械键盘、剑气等。每天都听着键盘声音是不是很烦闷，现在有了这款神器你就可以瞬间帮助自己的键盘加上逼格特效。[https://github.com/BillBillBillBill/Tickeys-linux/](https://github.com/BillBillBillBill/Tickeys-linux/)

### festival

语音合成软件,安装使用参考:[https://linuxtoy.org/archives/festival_on_ubuntu.html](https://linuxtoy.org/archives/festival_on_ubuntu.html)

### autossh

自动重连 ssh

### SysPeek

系统指示器, 安装：

> sudo add-apt-repository ppa:nilarimogard/webupd8    
>
> sudo apt-get update    
>
> sudo apt-get install syspeek  

### lnav

lnav 工具是在终端界面看日志的神器

### proxychains

命令行翻墙代理， 配置文件 `/etc/proxychains.conf`

### Touchpad Indicator (触摸板开关)

> sudo add-apt-repository ppa:atareao/atareao
>
> sudo apt-get update
>
> sudo apt-get install touchpad-indicator

### Keylock Application Indicator （显示大写键状态）

> sudo add-apt-repository ppa:tsbarnes/indicator-keylock
>
> sudo apt-get update
>
> sudo apt-get install indicator-keylock

### apparmor

Linux 进程权限控制

### Fabric

Fabric 是一个用 Python 编写的命令行工具库，它可以帮助系统管理员高效地执行某些任务，比如通过 SSH 到多台机器上执行某些命令，远程布署应用等。

### Dia

跨平台的流程图绘制程序, 基于GTK的图形（diagram）绘制程序，适用于Linux, Unix和Windows, 下载：[https://sourceforge.net/projects/dia-installer/](https://sourceforge.net/projects/dia-installer/)

## Taskwarrior

[TASKWARRIOR](http://taskwarrior.org/) 是一个很棒的命令行 TODO 工具。Ubuntu安装：

> sudo apt-get install task

Mac 安装：

> brew install task

### Python Sphinx

[Sphinx](http://www.sphinx-doc.org/en/stable/) 是一个非常棒的文档的工具，它采用 [reStructuredText](http://docutils.sourceforge.net/rst.html) 标记语言编写文档，然后可以将文档导出成 html、pdf 等格式。[中文参考文档](http://zh-sphinx-doc.readthedocs.io/en/latest/contents.html)。

安装：

> pip install sphinx

### ACK

[ACK](http://beyondgrep.com/) 比 grep 更好的搜索工具。

### Electron
[Electron](http://electron.atom.io/) 框架的前身是 Atom Shell，可以让你写使用 JavaScript，HTML 和 CSS 构建跨平台的桌面应用程序。它是基于io.js 和 Chromium 开源项目，并用于在 Atom 编辑器中。Electron 是开源的，由 GitHub 维护，有一个活跃的社区。最重要的是，Electron 应用服务构建和运行在 Mac，Windows 和 Linux。

### Speedtest

带宽测试工具, 安装:

> pip install speedtest-cli

也可以直接访问网页版: [Speedtest.net](http://www.speedtest.net/)

### paste

将文件按行并列显示：

> paste test.txt test2.txt test3.txt

### expand

将文件的制表符（TAB）转换为空白字符（space），将结果显示到标准输出设备。`-t` 参数可以指定制表符的参数。示例：

> expand -t 4 test.txt > test1.txt

### 抓包工具

- [charles](https://www.charlesproxy.com/)
- [Fiddler](http://www.telerik.com/fiddler)
- [wireshark](https://www.wireshark.org/)
- [mitmproxy](https://mitmproxy.org/)

### pwgen

一个生成随机、无特殊含义但可以正常拼读的密码。安装：

> sudo apt-get install pwgen

生成14位不含大写字母的密码：

> pwgen -A 14

参数：

```
-c 或 --capitalize 生成的密码中至少包含一个大写字母
-A 或 --no-capitalize 生成的密码中不含大写字母
-n 或 --numerals 生成的密码中至少包含一个数字
-0 或 --no-numerals 生成的密码中不含数字
-y 或 --symbols 生成的密码中至少包含一个特殊字符
-s 或 --secure 生成一个完全随机的密码
-B 或 --ambiguous 生成的密码中不含易混淆字符
-h 或 --help 输出帮助信息
-H 或 --sha1=path/to/file[#seed] 使用指定文件的 sha1 哈希值作为随机生成器
-C 按列输出生成的密码
-1 不按列输出生成的密码
-v 或 --no-vowels 不使用任何元音，以免意外生成让人讨厌的单词
```

### Zeal

[Zeal](https://zealdocs.org/) 是一个简单的离线 API 文档浏览器，仿照 [Dash](https://kapeli.com/dash)（一个 OSX 应用） 写成，能在 Linux 和 Windows 上使用。Linux 下安装和使用可以参考: [http://xmodulo.com/browse-search-api-documentation-offline-linux.html](http://xmodulo.com/browse-search-api-documentation-offline-linux.html)

### ack

[Ack](http://beyondgrep.com/) 是比 grep 更快的文本搜索工具

### Ag

[Ag](https://github.com/ggreer/the_silver_searcher) 是比 grep、ack 更快的搜索工具

### ccat

[Ccat](https://github.com/jingweno/ccat) 是 cat 的着色版本，可以对输出文本进行语法高亮

### Insomnia

[Insomnia](https://insomnia.rest/) 跨平台的、免费的 REST 客户端

### cloc

[Count Lines of Code](http://cloc.sourceforge.net/)，统计代码行数，用 perl 语言编写，速度还不错

### multitail

类似 tail 工具，可同时查看多个日志文件

### lnav

[THE LOG FILE NAVIGATOR](http://lnav.org/) 一个高级的日志查看工具

### Albert

类似 Mac Spotlight，一个快速启动器

### alfred

[Alfred](https://github.com/derkomai/alfred) 在 Debian, Ubuntu 及其衍生版本上自动化安装基本应用
