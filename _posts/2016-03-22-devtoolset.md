---
layout: post
title: "通过安装 devtoolset 来体验更高版本的 gcc"
keywords: devtoolset linux
description: "Devtoolset, 第三方 gcc 版本库"
category: Linux
tags: linux
---

Centos 5 默认的 gcc 版本为 4.1，某些软件在其上会编译不过，自己编译高版本的 gcc 可能也会遇到一些问题，比较麻烦。但有一个第三方库可以解决这个问题，即 `devtoolset`。devtoolset 有很多版本，例如 devtoolset-2(gcc-4.8.2)、devtoolset-3(gcc-4.9.2)、devtoolset-4(gcc-5.2.1)。

具体的安装步骤如下：

#### 1、添加源并安装

> wget -O /etc/yum.repos.d/slc6-devtoolset.repo http://linuxsoft.cern.ch/cern/devtoolset/slc6-devtoolset.repo

> yum install devtoolset-2

#### 2、错误处理

如果安装过程中提示错误，说找不到相关的 GPG key，只要根据提示安装相应的 GPG key 即可。例如：

> rpm --import http://www.scientificlinux.org/documentation/gpg/RPM-GPG-KEY-cern

> rpm --import http://www.scientificlinux.org/documentation/gpg/RPM-GPG-KEY-sl

然后重新安装。

#### 3、导入到系统

Devtoolset 默认安装到 `/opt` 目录下，如果希望全局可用，则要将其导入到系统：

> ln -s /opt/rh/devtoolset-2/root/usr/bin/* /usr/local/bin/

> hash -r

最后测试 gcc 版本

> gcc --version

如果需要详细了解，可以参考一下资料：

- [http://linux.web.cern.ch/linux/devtoolset/](http://linux.web.cern.ch/linux/devtoolset/)
- [http://superuser.com/questions/381160/how-to-install-gcc-4-7-x-4-8-x-on-centos](http://superuser.com/questions/381160/how-to-install-gcc-4-7-x-4-8-x-on-centos)
