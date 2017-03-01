---
layout: post
title: "解决 Ubuntu 系统中文显示乱码问题"
keywords: ubuntu 中文乱码 ubuntu中文支持 ubuntu中文乱码 ubuntu中文字符编码 ubuntu中文字符集
description: "如果在 Ubuntu 系统中出现中文乱码，可能是因为系统没有配置中文字符编码"
category: Linux
tags: ubuntu linux
---

如果在 Ubuntu 系统中出现中文乱码，可能是因为系统没有配置中文字符编码。Ubuntu 系统的字符编码保存在文件 `/var/lib/locales/supported.d/local` 中。

要为 Ubuntu 系统添加中文字符编码，可以直接使用 locale-gen:

> sudo locale-gen zh_CN.UTF-8

使用以上命令即可完成中文字符集的添加，完成后会在 `/var/lib/locales/supported.d/local` 文件中添加一行如下的内容：

```
zh_CN.UTF-8 UTF-8
```

也可以直接修改 `/var/lib/locales/supported.d/local` 文件，可以先查看下该文件的内容，大致如下：

```
zh_CN.UTF-8 UTF-8
en_US.UTF-8 UTF-8
zh_CN.GB18030 GB18030
zh_CN.GBK GBK
```

如果要为 Linux 添加字符集，可以直接在该文件尾添加一行相应的字符编码，然后执行以下命令：

> sudo dpkg-reconfigure locales

系统要支持中文，需要系统中有相应的中文语言环境包。安装简体中文语言包：

> sudo apt-get install language-pack-zh-hans language-pack-zh-hans-base language-pack-gnome-zh-hans language-pack-gnome-zh-hans-base

或者：

> sudo apt-get install \`check-language-support -l zh-hans\`

重启或者重新登录即可。
