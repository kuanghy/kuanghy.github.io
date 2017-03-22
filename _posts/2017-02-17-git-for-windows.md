---
layout: post
title: "Windows 下 git 的安装与配置"
keywords: git bash windows
description: "Windows 下 git 的安装与配置"
category: 计算机科学
tags: windows git
---

好久没有接触 Windows 环境，由于项目需要，需要在 Windows 下做开发，不得不配置下 Windows 的开发环境，那么 Git 是必装的。安装步骤其实很简单，只是感觉好久没有写博客了，这里随便记录下。

### 安装 Git 客户端

下载 [git for windows](https://git-scm.com/downloads)，执行正常的安装步骤。一般我选择 Git 自带的 Git Bash 命令行工具，这样有很多 GNU 工具可以用。

安装步骤不明可以参考：[http://wuzhuti.cn/2385.html](http://wuzhuti.cn/2385.html).

### 创建 SSH Key

安装好后，打开 Git Bash 工具，执行以下命令：

> ssh-keygen -t rsa -C "sudohuoty@163.com" 

完成后会在 `C:/Users/Administrator/.ssh/` 目录下生成秘钥文件，要在其他服务器上为本机添加 ssh 认证，可以拷贝 `id_rsa.pub` 文件到服务器，然后执行：

> cat id_rsa.pub >> ~/.ssh/authorized_keys

## 使用 Git

使用 Git 前需要做一些配置，如配置用户信息：

> git config --global user.name "Firstname Lastname"
> 
> git config --global user.email "your_email@youremail.com"

查看所有配置：

> git config --list

执行 `git config --global` 之后，会在 `C:/Users/Administrator/` 目录中生成一个 `.gitconfig` 文件，该文件用于存储一些用户自己的配置。该文件可以被直接修改，也可以通过 `git config --global` 来修改。

一些常用配置可参考：[https://github.com/kuanghy/shtools/blob/master/gitconfig](https://github.com/kuanghy/shtools/blob/master/gitconfig)


