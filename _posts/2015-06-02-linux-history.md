---
layout: post
title: Linux中history历史命令使用方法详解
category: Linux
tags: linux history
---

#### 1. 让 history 显示时间戳
如果要让 history 在显示历史命令时同时显示记录命令的时间，则需要设置如下环境变量：
> $ export HISTTIMEFORMAT='%F %T ' 

<br/>
[**注：**你也可以设置alias语句来查看最近的历史命令] 
{% highlight python %}
alias h1='history 10' 
alias h2='history 20' 
alias h3='history 30'
{% endhighlight %}

<br/>
#### 2. 用 Ctrl ＋ R 搜索历史命令
按下 `Ctrl +R` 然后输入关键字，可以在历史命令中通过关键字来查找已经历史命名。例如，搜索“red”，则显示以前的命令中含有”red”的命令“cat/etc/redhat-release”。

［**注：**在命令行提示符下按下Ctrl＋R，终端将显示如下提示―reverse-i-search‖］
 (reverse-i-search)\`red`: cat/etc/redhat-release 

［**注：**当看到你要的命令后按回车键，就可以重新执行这条命令了］ 
> $ cat /etc/redhat-release 

> Fedora release 9 (Sulphur)

<br/>
#### 3. 执行历史命令中的特定命令
用 history 显示历史命令的时候，在每个命令前边都有一个编号，用 `！ + 编号` 可以重新执行该条命令。例如：
> $ history | more 

> 1 service network restart<br/> 
2 exit <br/>
3 id <br/>
4 cat /etc/redhat-release<br/> 
<br/>
> $ !4 

> Fedora release 9 (Sulphur)

<br/>
#### 4. 用 HISTSIZE 控制历史命令的总数
修改环境变量 `HISTSIZE` 和 `HISTFILESIZE` 的值，可以控制命令历史记录储存的条数。例如，控制 bash 的命令历史记录的存储量为450条：
> $ vi ~/.bashrc 
> HISTSIZE=450<br/>
HISTFLESIZE=450

<br/>
#### 5. 使用 HISTFILE 改变历史文件名
历史命令的记录默认存储在 `.bash_history` 文件中，修改环境变量 `HISTFILE` 的值可以改变历史命令存储的文件。这样可以使用 history 命令来追踪不同终端中执行的命令，届时只需要将不同终端中所执行的命令保存在不同的历史文件中即可。例如：
> $ vi ~/.bash_profile 
> HISTFILE=/root/.commandline_warrior

<br>
#### 6. 使用HISTCONTROL来消除命令历史中的连续重复条目
设置环境变量 `HISTCONTROL` 的值为 `ignoredups`，可以消除重复命令，即连续重复出现的命令只记录一次。设置环境变量 `HISTCONTROL` 的值为 `erasedups`，可以消除整个命令历史中的重复命令，即在历史命令中，每个命令只记录一次。

<br>
#### 7. 使用HISTCONTROL强制history忽略某条特定命令
在执行一条命令时，你可以将环境变量 `HISTCONTROL` 的值设置为 `ignorespace` 并在该命令前加上一个空格来指示 history 忽略这条命令。在很多情况下这样做是没有必要的，因为我们通常都希望通过 history 来记录我们曾经做了哪些操作。但在一些特殊的情况下这个技巧可能对我们挺有用，比如我们偷偷操作别人的机器的时候。我想黑客肯定很喜欢这个技巧。

<br/>
#### 8. 清除历史命令
通常 bash 在执行命令时不是马上把命令名称写入 history 文件的，而是存放在内部的 buffer 中，等 bash 退出时会一并写入。不过，可以调用 `history -w` 命令要求 bash 立即更新 history 文件。 如果要清空本次留在缓存中的历史命令，可以用 `history -c` 命令。如何想要清空 history 曾经记录的所有命令，可以将文件 `.bash_history` 清空，当然这样做比较暴力。

<br/>
#### 9. 禁止 history 记录任何命令
如果想要禁用 history，不让 bashshell 记录任何命令，则将环境变量 `HISTSIZE` 设为 0 即可。
> $ export HISTSIZE=0 

<br/>
#### 10. 让 history 在存储时忽略某些特定指令
我们在使用 linux 的 bash 工作的时候，有些命令会平凡的使用，但其又不是很重要，没有必要被 history 记住，例如 ls。可以通过设置环境变量 `HISTIGNORE` 的值来让 history 忽略一些指定的命令。例如：
> $ export HISTIGNORE=“pwd:ls:ls –ltr:ll:history”

<br/>
**在 linux 系统中，大部分环境变量的配置可以写在 `profile` 文件中，该文件在 /etc 和 ～ 目录下都可能存在，只是在 ～ 目录下为带点的隐藏文件。在 ～ 目录下的 `.profile` 文件通常会包含主目录下的 `.bashrc` 文件，大部分的配置会保存在该文中。**

<br/>
**注：**<span class="emphasis">本文内容归纳总结自: [http://os.51cto.com/art/201205/335040.htm](http://os.51cto.com/art/201205/335040.htm)，仅供学习参考。</span>
