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

```bash
wget -O /etc/yum.repos.d/slc6-devtoolset.repo http://linuxsoft.cern.ch/cern/devtoolset/slc6-devtoolset.repo
yum install devtoolset-2
```

#### 2、错误处理

如果安装过程中提示错误，说找不到相关的 GPG key，只要根据提示安装相应的 GPG key 即可。例如：

```bash
rpm --import http://www.scientificlinux.org/documentation/gpg/RPM-GPG-KEY-cern
rpm --import http://www.scientificlinux.org/documentation/gpg/RPM-GPG-KEY-sl
```

然后重新安装。

#### 3、导入到系统

Devtoolset 默认安装到 `/opt` 目录下，如果希望全局可用，则要将其导入到系统：

```bash
ln -s /opt/rh/devtoolset-2/root/usr/bin/* /usr/local/bin/
hash -r
```

最后测试 gcc 版本:

```bash
gcc --version
```

#### 4、使用 SCL 管理

**SCL** 即软件集（[Software Collections](https://www.softwarecollections.org/en/)），其是 Red Hat 唯一支持的新软件包源，Software Collections 为 CentOS 设立了专门的仓库，安装和管理都和其它第三方仓库一样。

使用 SCL 需要先安装：

```bash
yum -y install centos-release-scl
```

然后便可以用 SCL 来管理软件集，如安装 gcc，首先查看可安装的版本：

```bash
$ yum list dev*gcc
Loaded plugins: fastestmirror
Skipping unreadable repository '/etc/yum.repos.d/CentOS-Base.repo'
Skipping unreadable repository '/etc/yum.repos.d/epel.repo'
Determining fastest mirrors
 * centos-sclo-rh: mirrors.bupt.edu.cn
 * centos-sclo-sclo: mirrors.bupt.edu.cn
Available Packages
devtoolset-10-gcc.x86_64    10.2.1-11.1.el7    centos-sclo-rh
devtoolset-7-gcc.x86_64     7.3.1-5.16.el7     centos-sclo-rh
devtoolset-8-gcc.x86_64     8.3.1-3.2.el7      centos-sclo-rh
devtoolset-9-gcc.x86_64     9.3.1-2.2.el7      centos-sclo-rh
```

安装选择合适的版本安装：

```bash
yum install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils -y
```

安装完成后需手动切换到该环境：

```bash
scl enable devtoolset-9 bash

# 或

source /opt/rh/devtoolset-9/enable
```

配置 bashrc 使环境自动生效：

```bash
echo "source /opt/rh/devtoolset-9/enable" > ~/.bashrc
```

#### 5、参考资料

- [http://linux.web.cern.ch/linux/devtoolset/](http://linux.web.cern.ch/linux/devtoolset/)
- [http://superuser.com/questions/381160/how-to-install-gcc-4-7-x-4-8-x-on-centos](http://superuser.com/questions/381160/how-to-install-gcc-4-7-x-4-8-x-on-centos)
- [https://linux.cn/article-6776-1.html](https://linux.cn/article-6776-1.html)
