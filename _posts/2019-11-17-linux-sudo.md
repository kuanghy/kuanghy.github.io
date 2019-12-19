---
layout: post
title: "关于 sudo 命令的一些配置和使用技巧"
keywords: sudo linux superuser sudoers 权限
description: "sudo 允许已验证的用户以其他用户的身份来运行命令，其与安全策略配合使用，具有高度可拓展性"
category: Linux
tags: linux sudo
---

`sudo` 表示 “superuser do”。 它允许已验证的用户以其他用户的身份来运行命令。其他用户可以是普通用户或者超级用户。然而，大部分时候我们用它来提权运行命令，以替代直接使用 root 用户的操作。

`sudo` 命令与安全策略配合使用，安全策略可以通过文件 `/etc/sudoers` 来配置。其安全策略具有高度可拓展性，支持插件扩展。

默认情况下 `/etc/sudoers` 是不能被任何人直接编辑的，因为它的权限是 440，虽然也可以对其赋予写权限后再编辑，但推荐使用 `visudo` 命令编辑该文件。visudo 命令可能默认会用 nano 编辑器打开配置文件，如果想修改打开时使用的默认编辑器，可以使用如下命令配置：

```shell
$ sudo update-alternatives --config editor
```

或者直接指定环境变量

```shell
$ sudo EDITOR=vim visudo
```

sudo 命令的工作流程：

- sudo 会读取和解析 /etc/sudoers 文件，查找调用命令的用户及其权限
- 然后提示调用该命令的用户输入密码 (通常是用户密码，但也可能是目标用户的密码，或者也可以通过 NOPASSWD 标志来跳过密码验证)
- 之后，sudo 创建一个子进程，调用 setuid() 来切换到目标用户
- 接着，它会在上述子进程中执行参数给定的 shell 或命令

## 授权配置

授权配置格式：

```
USER/GROUP HOST=(USER[:GROUP]) [NOPASSWD:] COMMANDS
```

- `USER/GROUP` 表示需要被授权的用户或者组，如果是组则，需要以 % 开头
- `HOST` 表示允许从哪些主机登录的用户运行 sudo 命令，ALL 表示允许从任何终端、机器访问
- `(USER[:GROUP])` 表示使用 sudo 可切换的用户或者组，组可以不指定，ALL 表示可以切换到系统的所有用户
- `NOPASSWD` 如果指定，则该用户或组使用 sudo 时不必输入密码
- `COMMANDS` 表示运行指定的命令，ALL 表示允许执行所有命令

配置示例：

```
# 允许 sudo 组执行所有命令
%sudo ALL=(ALL:ALL) ALL

# 允许用户执行所有命令，且无需输入密码
huoty ALL =(ALL) NOPASSWD: ALL

# 仅允许用户执行 echo, ls 命令
huoty ALL =(ALL) NOPASSWD: /bin/echo /bin/ls

# 运行本机的用户执行关机命令
huoty localhost=/sbin/shutdown -h now

# 允许 users 用户组中的用户像 root 用户一样使用 mount、unmount、chrom 命令
%users ALL=/sbin/mount /mnt/cdrom, /sbin/umount /mnt/cdrom
```

## Defaults 配置项

使用 Defaults 配置，可以改变 sudo 命令的行为，如：

```
# 指定用户尝试输入密码的次数，默认值为3
Defaults passwd_tries=5

# 设置密码超时时间，默认为 5 分钟
Defaults passwd_timeout=2

默认 sudo 询问用户自己的密码，添加 targetpw 或 rootpw 配置可以让 sudo 询问 root 密码
Defaults targetpw

# 指定自定义日志文件
Defaults logfile="/var/log/sudo.log"

# 要在自定义日志文件中记录主机名和四位数年份，可以加上 log_host 和 log_year 参数
Defaults log_host, log_year, logfile="/var/log/sudo.log"

# 保持当前用户的环境变量
Defaults env_keep += "LANG LC_ADDRESS LC_CTYPE COLORS DISPLAY HOSTNAME EDITOR"
Defaults env_keep += "ftp_proxy http_proxy https_proxy no_proxy"

# 安置一个安全的 PATH 环境变量
Defaults secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
```

## 别名配置

别名大致分为四种：

- `Host_Alias` 主机别名
- `Cmnd_Alias` 命令别名
- `User_Alias` 用户别名，可以是用户，用户组
- `Runas_Alias` 目的用户别名

配置示例：

```
# 主机别名
Host_Alias FILESERVERS = fs1, fs2
Host_Alias MAILSERVERS = smtp, smtp2

# 用户别名
User_Alias ADMINS = huoty, kong

# 命令别名
Cmnd_Alias SHUTDOWN = /sbin/reboot, /sbin/poweroff
Cmnd_Alias PKGMGMT = /usr/bin/dpkg, /usr/bin/apt-get, /usr/bin/aptitude
Cmnd_Alias SERVICES = /sbin/service, /sbin/chkconfig
Cmnd_Alias NETWORKING = /sbin/route, /sbin/ifconfig, /bin/ping, /sbin/iptables
Cmnd_Alias STORAGE = /sbin/fdisk, /sbin/sfdisk, /bin/mount, /bin/umount
Cmnd_Alias DELEGATING = /usr/sbin/visudo, /bin/chown, /bin/chmod, /bin/chgrp
Cmnd_Alias PROCESSES = /bin/nice, /bin/kill, /usr/bin/kill, /usr/bin/killall

# 允许 ADMINS 用户执行包管理和关机命令
ADMINS ALL = PKGMGMT, SHUTDOWN

# 允许 sys 用户组中的用户使用 NETWORKING 等所有别名中配置的命令
%sys ALL = NETWORKING, PKGMGMT, SERVICES, STORAGE, DELEGATING, PROCESSES
```

## 命令参数

以下列举 sudo 命令的一些常用参数：

- `-l` 列出当前用户所拥有的权限
- `-E` 保持当前用户的环境变量
- `-H` 设置 HOME 环境变量为目标用户的主目录
- `-u` 以指定用户运行命令
- `-k` 结束密码有效期限，即下次再执行时需要重新输入密码
- `--` 停止解析命令行参数，即之后命令不再作为其控制餐宿

## 其他配置与使用技巧

查看 sudo 命令文件的信息如下：

```
$ ls -l /usr/bin/sudo
-rwsr-xr-x 1 root root 155008 Mar 13  2015 /usr/bin/sudo
```

可以发现 sudo 上启用了 setuid 位，即当任何用户运行这个二进制文件时，其将以 root 用户的权限运行。

`sudo` 存在一个曲线是，其无法使用 Shell 的内置命令。如 history 等：

```
$ sudo history
sudo: history: command not found
```

解决这个问题的办法是，临时切换到 root shell，并在那里执行任何命令，包括 Shell 的内置命令：

```
$ sudo bash
```

当前用户的命令别名不会被应用到 sudo。如果需要这样，可以在 ~/.bashrc 或者 /etc/bash.bashrc 中加入：

```
alias sudo='sudo '
```

如果希望使用 sudo 一次执行多个命令，可以使用 `bash -c`，如：

```
$ sudo -- bash -c 'pwd; hostname; whoami'
```

参考：

- [https://linux.cn/article-11595-1.html](https://linux.cn/article-11595-1.html)
- [https://linux.cn/article-8145-1.html](https://linux.cn/article-8145-1.html)
- [https://wiki.debian.org/sudo](https://wiki.debian.org/sudo)
