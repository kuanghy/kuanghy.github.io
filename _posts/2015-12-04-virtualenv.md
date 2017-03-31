---
layout: post
title: "Linux下使用 virtualenv 虚拟独立 Python 环境"
keywords: python virtualenv 虚拟环境
category: Python
tags: python virtualenv
---

### 简介

在开发不同的应用时，我们可能需要不同的 Python 版本，同时可能还需要处理包的依赖、版本和间接权限问题。在同系统中，要解决这些问题往往非常棘手。在 Python 的开发环境中，为解决这样的问题最常用的方法是使用 `virtualenv` 包。 Virtualenv 是一个用来创建独立的 Python 环境的包，就类似于一个沙箱，将开发运行环境与系统隔离开来。

用 VirtualEnv 创建的多个 Python 环境相互独立，互不影响，它能够：

- 在没有权限的情况下安装新套件
- 不同应用可以使用不同的套件版本
- 套件升级不影响其他应用

这样的虚拟环境是在 Python 解释器上的一个私有复制。这样我们就可以在一个隔绝的环境下安装 packages，不会影响到系统中全局的 Python 解释器。虚拟环境非常有用，因为它可以防止系统出现包管理混乱和版本冲突的问题。为每个应用程序创建一个虚拟环境可以确保应用程序只能访问它们自己使用的包，从而全局解释器只作为一个源且依然整洁干净去更多的虚拟环境。另一个好处是，虚拟环境不需要管理员权限。


### 安装
这里只介绍 Linux 系统下的安装。在 Linux 下的安装方法多种多样，可以通过源码源码安装，也可以用 Python 的包管理工具 `easy_install` 和 `pip` 安装，例如：

> $ sudo easy_install virtualenv

或者：

> $ sudo pip install virtualenv

如果你使用的是 Ubuntu 及其衍生版本，还可以通过如下方式安装：

> $ sudo apt-get install python-virtualenv

### 创建虚拟环境
安装完成之后便可用 `virtualenv` 命令创建虚拟环境，只需要指定一个虚拟环境的名称即可：

> $ virtualenv kvenv

创建过程输出如下信息：

<pre>
Running virtualenv with interpreter /usr/bin/python2
New python executable in kvenv/bin/python2
Also creating executable in kvenv/bin/python
Installing setuptools, pip...done.
</pre>

创建完成后会生成一个 kvenv 目录。也可以根据需要加上参数来指定所创建的虚拟环境的行为，例如加上 `-p` 参数指定 Python 版本。

### 激活虚拟环境

要激活创建的虚拟环境可以用如下命令：

> $ source kvenv/bin/activate

激活成功后会在命令提示符前边加上 `(kvenv)` 字符。此时，我们 `which python` 看有什么不同：

<pre>
(kvenv)konghy$[~] => which python
/home/konghy/kvenv/bin/python
</pre>

会发现此时的 python 解释器执行的是虚拟环境下的，而不是系统全局的。Virtualenv 拷贝了 Python 可执行文件的副本，并创建一些有用的脚本和安装了项目需要的软件包，你可以在项目的整个生命周期中安装/升级/删除这些包。 它也修改了一些搜索路径，例如PYTHONPATH，以确保：

- 当安装包时，它们被安装在当前活动的virtualenv里，而不是系统范围内的Python路径。

- 当import代码时，virtualenv将优先采取本环境中安装的包，而不是系统Python目录中安装的包。

还有一点比较重要，在默认情况下，所有安装在系统范围内的包对于 virtualenv 是可见的。 这意味着如果你将 simplejson 安装在您的系统 Python 目录中，它会自动提供给所有的 virtualenvs 使用。 这种行为可以被更改，在创建 virtualenv 时增加 `--no-site-package`s 选项的 virtualenv 就不会读取系统包，如下：

> $ virtualenv kvenv --no-site-packages

要`退出虚拟环境`用如下命令：

> $ deactivate

### 在虚拟环境中安装包

大多数的 Python 包是通过 pip 程序安装的，在创建虚拟环境的时候 virtualenv 会自动添加进去。当一个虚拟环境被激活后，pip 程序的位置会被添加到 PATH 中。比如，安装 Flask 到虚拟环境中，使用如下命令：

> $ pip install flask

安装过程会将 Flask 和它的依赖集安装到虚拟环境中。验证是否安装成功，可以用如下方法：

<pre>
(venv)$ python
>>> import flask
>>>
</pre>

用如下命令可以查看当前环境安装了哪些包：

> $ pip freeze

## 参考资料

[http://flask123.sinaapp.com/article/39/](http://flask123.sinaapp.com/article/39/)

[http://www.nowamagic.net/academy/detail/1330228](http://www.nowamagic.net/academy/detail/1330228)
