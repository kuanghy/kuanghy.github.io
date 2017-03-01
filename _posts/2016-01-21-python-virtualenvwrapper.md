---
layout: post
title: "Python 多环境管理扩展 virtualenvwrapper"
keywords: Python virtualenv virtualenvwrapper
description: "Virtualenvwrapper 只是一个 virtualenv 的辅助工具。"
category: Python
tags: Python virtualenv virtualenvwrapper
---

`virtualenvwrapper`只是一个 virtualenv 的辅助工具。VirtualEnv 用于在一台机器上创建多个独立的 python 运行环境，VirtualEnvWrapper为前者提供了一些便利的命令行上的封装。使用 virtualenv 的好处是：

- 隔离项目之间的第三方包依赖，如 A 项目依赖django1.7，B 项目依赖django1.9。

- 为部署应用提供方便，把开发环境的虚拟环境打包到生产环境即可,不需要在服务器上再折腾一翻。


### 安装

#### Linux/Mac OSX

> pip install virtualenv virtualenvwrapper

配置工作目录和项目目录，在 `～/.bashrc` 中加入如下内容：

```
if [ `id -u` != '0' ]; then
    export WORKON_HOME=$HOME/.virtualenvs
    export PROJECT_HOME=$HOME/PyEnvs
    source /usr/local/bin/virtualenvwrapper.sh
fi
```

当然，还有更多的配置项可以添加，详细使用说明可以查看[文档](http://virtualenvwrapper.readthedocs.org/en/latest/)。添加完后如果要立即生效则执行 `source ~/.bashrc`。

#### Windows

> pip install virtualenvwrapper-win

Windows下默认虚拟环境是放在用户名下面的Envs中的，与桌面，我的文档，下载等文件夹在一块的。更改方法：计算机，属性，高级系统设置，环境变量，添加 WORKON_HOME。

### 常用命令

#### 创建新的虚拟环境

> mkvirtualenv [envname]

该命令会帮我们创建一个新环境，默认情况下，环境的目录是 `.virtualenv/enname`,创建过程中它会自动帮我们安装 pip 等必要的软件，以后我们要安装新依赖时可直接使用 pip 命令。创建完之后，自动切换到该环境下工作，可看到提示符前边多了像`(envname)$`这样的字符。在这个环境下安装的依赖不会影响到其他的环境。

该命令有几个可选参数:

```
-a project_path

    与一个工程目录建立关联

-i package

    创建环境时安装相应的包.
    如 -i Flask、-i Flask==0.11.1 或者安装多个包 -i Flask -i locustio

-r requirements_file

    同 pip install -r requirements_file 用法
```

该命令还支持加入 virtualenv 的参数选项，例如指定环境的 python 版本为 3.5：`mkvirtualenv ttenv --python=python3.5`

> mkproject proname

该命令要求配置　`PROJECT_HOME`　目录，它在WORKON\_HOME 目录下创建一个名为 proname 的虚拟环境，同时在 `PROJECT_HOME` 目录下创建名为 proname 的项目目录。创建完成后会自动激活虚拟环境，并进入 proname 目录。

> mktmpenv

该命令用于创建一个临时的运行环境。

#### 切换与退出环境

切换虚拟环境：

> workon envname

退出虚拟环境：

> deactivate

#### 环境管理

列出所有环境：

> workon

> lsvirtualenv

删除环境：

> rmvirtualenv [envname]

显示环境详情：

> showvirtualenv [envname]

赋值环境：

> cpvirtualenv [source] [dest]

列出当前工作环境中安装的包：

> lssitepackages
