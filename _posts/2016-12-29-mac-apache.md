---
layout: post
title: "启用 Mac 自带的 Apache"
keywords: mac apache 虚拟主机
description: "Mac OSX自带apache服务器，需要启动时只需要做一些简单的配置即可"
category: 计算机科学
tags: mac apache 
---

Mac OS X 系统中自带了 Apache 环境，但是默认没有启用，可以用如下命令查看其版本：

> sudo apachectl -v

Apache 的配置文件目录为 `/etc/apache2/`。首先备份主配置文件（备份是一个好的习惯），开始 Apache 的配置：

> sudo cp /etc/apache2/httpd.conf /etc/apache2/httpd.conf.bak

编辑配置文件 `/etc/apache2/httpd.conf`, 修改如下内容：

```
User huoty
Group wheel

DocumentRoot "/Users/huoty/www/"
<Directory "/Users/huoty/www">
......
</Directory>

```

以上配置表示使用用户 huoty 和组 wheel 来运行 apache 服务，并把默认的站点根目录设置为用户主目录下的 www 目录。

如果需要开启虚拟主机配置，可以将如下一行的注释去掉：

```
#Include /private/etc/apache2/extra/httpd-vhosts.conf
```

打开虚拟主机配置文件配置虚拟主机：

> sudo vi /etc/apache2/extra/httpd-vhosts.conf

该配置文件默认开启了两个虚拟主机，可以根据需要修改或者添加如下的配置：

```
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "/usr/docs/dummy-host.example.com"
    ServerName dummy-host.example.com
    ServerAlias www.dummy-host.example.com
    ErrorLog "/private/var/log/apache2/dummy-host.example.com-error_log"
    CustomLog "/private/var/log/apache2/dummy-host.example.com-access_log" common
</VirtualHost>

<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host2.example.com
    DocumentRoot "/usr/docs/dummy-host2.example.com"
    ServerName dummy-host2.example.com
    ErrorLog "/private/var/log/apache2/dummy-host2.example.com-error_log"
    CustomLog "/private/var/log/apache2/dummy-host2.example.com-access_log" common
</VirtualHost>
```

所有配置完成后，可以用如下命令校验配置的正确：

> sudo apachectl -t

如果出现如下问题：

```
AH00557: httpd: apr_sockaddr_info_get() failed for KMPB
```

可以在 `/etc/hosts` 中添加如下内容：

```
127.0.0.1	KMBP
```

注：KMBP 为主机名

再次检查配置文件无误后，启动 Apache：

> sudo apachectl start

浏览器访问 localhost，如果出现类似如下错误：

```
Forbidden

You don't have permission to access / on this server.
```

这说明配置或者访问的目录以及文件没有访问权限，在 httpd.conf 文件中指定的 User 或者 Group 必须能够读取所有被服务的文件

可以通过如下命令重启和关闭 apache：

> sudo apachectl restart // 重启
>
> sudo apachectl stop // 关闭

