---
layout: post
title: "Linux 服务器维护简易指南"
keywords: linux ps netstat vmstat 进程管理 资源管理 内存管理 防火墙
description: "Linux是多用户、多任务、支持多线程和多 CPU 的操作系统，很多服务器选择其作为操作系统，学会对其维护很重要"
category: Linux
tags: linux
---

Linux 是一个基于 POSIX 和 UNIX 的多用户、多任务、支持多线程和多 CPU 的操作系统，其可免费使用和自由传播，且是类 Unix 的操作系统。大部分的服务器都选择 Linux 操作系统，其稳定，安全，可靠。如今使用比较的多的 Linux 系统分为两大派系，即 Rad Hat(RHEL) 和 Debian。Rad Hat 派系包括 Centos、fedora 等，Debian 派系包括 Ubuntu 及其诸多衍生系统。

在这两大派系中，服务器操作系统选择比较多的是 Centos 和 Ubuntu。Centos 力求安全、稳定，所以更新较慢；而 Ubuntu 迭代速度较快，以固定的周期发版，不断尝试改良。很多服务器提供商提供的默认镜像都仅包含这两个系统的最近发布版本。服务器在选择 Linux 发行版时，应视应用场景综合考虑，然后再选择合适的版本。

**注：** 本文后续内容中涉及到的一些命令的输出结果，大部分是基于 zsh 环境的，执行结果可能与 bash 的输出不太一样。阅读时可分别在 zsh 与 bash 环境下测试，以了解其差异。

## 了解系统

服务系统安装完成后，可用如下的命令了解系统：

```
# 查看机器的处理器架构
arch

# 查看详细的系统信息
uname -a

# 查看操作系统位数
getconf LONG_BIT

# 查看主机名
hostname

# 查看系统发行版信息
lsb_release -a
cat /etc/*-release
cat /etc/issue

# 查看 CPU 信息
cat /proc/cpuinfo
lscpu

# 查看内存信息
cat /proc/meminfo
free --si -h

# 查看网卡信息
ifconfig

# 查看磁盘信息
df -TH
fdisk -l /dev/sdb

# 测试磁盘读写性能
dd if=/dev/zero of=test.txt bs=4k count=100000  # 测试写性能
dd if=/dev/sdb of=/dev/null bs=4k count=100000  # 测试读性能
dd if=/dev/sdb of=test.txt bs=4k count=100000   # 同时测试读写性能
dd if=/dev/zero of=/mnt/nfs/testfile bs=4k count=100000  # 测试远程挂载目录写性能
dd if=/mnt/nfs/testfile bs=4k of=/dev/null count=100000  # 测试远程挂载目录读性能

# 查看详细的硬件信息
dmidecode
dmidecode | grep "System Information" -A9    # 查看服务器型号、序列号等
dmidecode | grep "Chassis Information" -A16  # 查看主板信息
dmidecode | grep "Memory Device" -A16        # 查看内存条信息

# 查看开机信息
dmesg
dmesg | less

# 查看当前用户的计划任务
crontab -l

# 查看系统级的计划任务
cat /etc/crontab
cat /etc/cron.d/*
```

上面提到查看 `/etc/issue` 文件的内容来了解系统发行版本信息，其实这个信息不一定是准确的，因为这里的信息可以被人为的修改，但默认情况下该文件的内容一般都是操作系统发行版信息。其实这个文件里的内容为系统登录前的欢迎语，还有 `/etc/issue.net` 文件是网络远程登陆时的欢迎语。与之对应的还有 `/etc/motd` 文件，这里是登录后的欢迎语。

在较新的 Linux 发行版中，motd 功能被扩展，有了动态 motd 和静态 motd 的区别，如在 Ubuntu 16.04.01 LTS 中，并启用了动态 motd，而未启用静态 motd。动态 motd 显示的是 `/run/motd.dynamic` 文件中的内容，但是手动修改这个文件不会生效，因为其是动态生成的，其由 `/etc/update-motd.d/` 下的脚本文件动态生成。

## 用户管理

Linux 是一个多用户、多任务的操作系统，其对用户的管理会经历认证、授权和审计三个过程。首先用户登录输入用户名密码，这是认证的过程；其次，在用户登录成功后，所拥有的权限各不相同，这就是授权；最后，用户的操作历史会记录在日志中，这是审计。用户分别为 **管理员**（一般为 root 账户）和普通用户，系统使用 **UID**（User ID）来标识不同用户。管理员即超级用户，可以执行系统中的任意操作，拥有至高的管理权限，其 UID 为 0。普通用户有分为登录用户和系统用户。**登录用户** 可登录系统，一般都拥有各自的 HOME 目录，且只能操作自己 HOME 目录下的文件，UID 一般在 1000 到 65535 范围内。**系统用户** 一般情况下为系统中默认存在的用户，且默认情况下不能登录系统，它们的存在主要是为了满足系统进程对文件属主的需求，UID 一般在 1 到 999 范围内。系统用户也可以手动添加。

添加用于 `useradd` 命令，常用参数包括：

```
-b, --base-dir BASE_DIR       指定主目录的基目录，一般默认为 /home
-c, --comment COMMENT         用户注释，即用户的详细信息（如姓名，年龄，电话等）
-d, --home-dir HOME_DIR       为用户指定一个 HOME 目录
-g, --gid GROUP               为用户指定一个组或者组 ID
-G, --groups GROUPS           将用户添加到其它的组，多个组时用逗号分隔
-k, --skel SKEL_DIR           指定创建 HOME 目录的模板目录，一般默认为 /etc/skel
-m, --create-home             创建用户时一并创建用户的主目录
-M, --no-create-home          不要创建用户主目录
-N, --no-user-group           不创建与用户同名的组
-p, --password PASSWORD       指定用户密码
-r, --system                  创建为一个系统账户
-s, --shell SHELL             指定用户的登录 Shell
-u, --uid UID                 为用户指定一个 UID
-U, --user-group              创建一个与用户同名的组
```

使用示例：

```
# 创建一个系统用户，同时创建 HOME 目录，且指定登录 Shell 为 bash
useradd -c 'Server' -r -m -s /bin/bash testuser

# 创建一个没有家目录且不能登录的用户
useradd -s /sbin/nologin testuser

# 创建一个普通用户，同时将其加入到其他的用户组中
useradd -c Maintainer -m -s /bin/bash -G sudo,admin huoty
```

`adduser` 命令也用于创建用户，其实际上一个 perl 脚本，是对 useradd 的命令的封装，支持交互式的创建用户。

`userdel` 命令用于删除用户，常用 `-r | --remove` 参数，用于指定将用户主目录和邮件池一并删除。

`usermod` 命令用于修改用户信息，常用的参数包括：

```
-c, --comment COMMENT         修改用户注释，即 GECOS 字段的值
-d, --home HOME_DIR           指定用户的新主目录
-e, --expiredate EXPIRE_DATE  修改账户的过期时间
-g, --gid GROUP               强制修改用户的默认组
-G, --groups GROUPS           指定新的附加组列表
-a, --append GROUP            将用户追加至 -G 指定的组列表中，并不从其它组中删除此用户
-L, --lock                    锁定用户帐号
-m, --move-home               将 HOME 目录内容移至新位置 (仅于 -d 一起使用)
-o, --non-unique              允许使用重复的(非唯一的) UID
-p, --password PASSWORD       将加密过的密码 (PASSWORD) 设为新密码
-s, --shell SHELL             该用户帐号的新登录 shell
-u, --uid UID                 用户帐号的新 UID
-U, --unlock                  解锁用户帐号
```

使用示例：

```
# 更改并移动用户主目录
usermod -d /home/huoty2 -m huoty

# 更改用户的默认组
usermod -g admin huoty

# 修改用户的登录 Shell
usermod -s /bin/zsh huoty

# 将用户添加到某个组中
usermod -a -G writers huoty

# 修改用户密码
usermod -p xxx huoty
passwd huoty
```

Linux 支持将不同的用户分配到不同的组中进行集中管理。每个用户都有一个用户组，且还可以属于其他的任意多个附加组。创建一个新的用户组使用 `groupadd` 命令，使用示例:

```
# 创建一个新的组
groupadd testgroup

# 创建新组并为其指定组 ID
groupadd -g 101 testgroup

# 创建新组并为其指定密码
groupadd -p xxx testgroup
```

另外，还有 `groupdel`，`groupmod` 命令用于删除组和修改组信息，用法与 userdel，usermod 类似。

与用户和组相关的信息主要存储在 `/etc/passwd`、`/etc/shadow`、`/etc/group` 三个文件中（存储格式中各字段用 : 分隔）：

- **/etc/passwd：** 存储用户账户信息
- **/etc/shadow：** 存储用户密码信息
- **/etc/group：** 存储用户组信息

与用户和组有关的命令还有: `id` 查看用户的 UID、GID 及所归属的用户组；`su` 用于切换用户；`sudo` 用于提高和管理普通用户的管理员权限，即授权普通用于一些管理员权限。目前，大多数发行版都已默认支持 sudo 功能，在使用 Linux 时建议配置和使用 sudo，而不是直接使用 root 账户来管理系统。

用户账号主要用于登录系统并以自己的身份进行工作，对用于的关系也涉及到系统安全问题。如果账号的登录方式被恶意的人窃取或者破解，则可能带来严重的后果。日志文件 `/var/log/auth.log` 记录了用户登录时的认证过程日志。从该日志文件中查看尝试破解 root 密码的请求：

```shell
grep "Failed password for root" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr | more
```

查看尝试暴力猜测用户名的请求：

```shell
grep "Failed password for invalid user" /var/log/auth.log | awk '{print $13}' | sort | uniq -c | sort -nr | more
```

在 Linux 服务器上时，可实时关注当前系统登录的用户情况，避免有恶意用户的登录行为。查看系统用户信息有如下的命令：

```
# 查看系统中当前登录的所有用户以及当前的行为（正在执行的动作）
w

# 查看系统中当前登录的所有用户
users

# 查看当前在本地系统上的所有用户的信息，每个控制终端显示一条信息
who

# 查看用户的登录日志
last

# 查看当前用户（我是谁）
whoami    # 显示当前“操作用户”的用户名
who am i  # 显示“登录用户”的用户名

# 查看当前用户和组的 ID
id

# 查看其他用户的用户与组 ID
id huoty

# 查看系统所有用户
# cut -d: -f1 /etc/passwd

# 查看系统所有组
# cut -d: -f1 /etc/group
```

## 文件管理

Linux 把几乎所有的一切都视为文件来管理，也就是所谓的 **Linux 一切皆文件**。`ls` 命令可以列出文件：

```shell
$ ls -al --full-time
drwxr-xr-x 5 server server 4096 2019-11-24 12:55:40.943239111 +0800 .
drwxr-xr-x 4 root   root   4096 2019-10-19 09:54:06.313129306 +0800 ..
-rw------- 1 server server 1843 2019-11-24 13:05:56.759019956 +0800 .bash_history
-rw-r--r-- 1 server server  220 2019-05-05 12:06:48.000000000 +0800 .bash_logout
-rw-r--r-- 1 server server 3848 2019-10-19 10:27:58.970725883 +0800 .bashrc
```

以上 ls 命令中，`-a` 参数表示列出所有文件（包括隐藏文件，即以 . 开头的文件），`-l` 表示列出文件的详细信息，`--full-time` 表示显示完成的时间信息。其输出的信息中的每行大致包含几个不同的部分：

- **文件类型：** 包括普通文件（包括硬链接文件） `-`，目录文件 `d`， 符号链接（软链接） `l`， 字符设备文件 `c`， 块设备文件 `b`， FIFO管道文件 `p`， 套接字 `s`
- **文件权限：** 以六个字符表示，分为三组，每三个字符分为一组，分别表示用户、用户组、其他用户的权限，`r` 表示可读，`w` 表示可写，`x` 对于目录表示可进入目录，对于文件表示可执行
- **文件硬链接数或目录子目录数**
- **文件所属用于与组**
- **文件大小：** 当为目录时一般为 4096，不是目录中文件实际占用空间的大小
- **最后修改时间：** 其内容最后被修改的时间
- **文件名**

文件的权限除了以上提到的 `r`、`w`、`x` 三种权限外，还包含两种特殊权限，即特权位 `s` 与 粘帖位 `t`。

**特权位只针对二进制文件有效**，并且只能添加在权限位的前三位和中间三位。一个可执行文件拥有 s 位并且在前三位时，则文件拥有 SUID 特殊权限，也叫 SETUID，是 **Set User ID** 的意思，此时若其他用户执行该文件则会拥有文件所有者的权限。如果一个可执行文件拥有 s 位并且在中间三位时，则文件有 SGID 特殊权限，也叫 SETGID，是 **Set Group ID** 的意思，此时若其他用户执行该文件则拥有文件所属组的权限。例如 passwd 命令就拥有 SUID 特权：

```shell
$ ls -l `which passwd`
-rwsr-xr-x 1 root root 67992 8月  29 21:00 /bin/passwd
```

**粘帖位只针对目录有效**。有 t 位的目录，任何用户在有权限的情况下可以在该目录下创建文件和子目录，但即使有权限删除其他用户的文件或目录也不能删除，同时互相也不能强制保存修改，即自己只能删除自己创建的目录或文件。粘帖位多用于一些共享上传的文件服务器场合。粘滞位只能占用后三位权限位。例如 /tmp 目录就拥有 t 权限位：

```shell
$ ls -ld /tmp
drwxrwxrwt 15 root root 4096 1月   7 12:18 /tmp
```

需要注意的是，`s` 位和 `t` 位都是占用 x 位，那么是否有 x 位，主要是看 s 或 t 的大小写来判别：大写，表示没有执行权限 x 位；小写，表示有执行权限 x 位。对于不可执行文件来说，SETUID 和 SETGID 没有任何意义。

`chmod` 命令工具可以改变文件权限，其支持两种用法：一种是包含字母和操作符表达式的文字设定法；另一种是包含数字的数字设定法。

**文字设定法** 格式为：

> chmod [who] [+|-|=] [mode] file...

其中，who 值表示操作对象，包含：

- `u` 表示 “用户（user）”，即文件或目录的所有者
- `g` 表示 “同组（group）用户”，即和文件属主有相同组 ID 的所有用户
- `o` 表示 “其他（others）用户”
- `a` 表示 “所有（all）用户”。此为系统默认值

`+` 添加某个权限，`-` 取消某个权限，`=` 赋予给定权限并取消其他所有权限（如果有的话）。mode 的值可以是 r、w、x 的任意组合或者是 s 或 t。使用示例：

```
# 使同组和其他用户对文件有读权限
chmod g+r, o+r file
chmod go+r file

# 给所有用户加上可执行权限
chmod a+x file

# 给文件加上 SETUID，并去掉同组和其他人的读权限
chmod u+s, go-r file

# 给目录加上粘滞位（粘滞位只占用 others 权限位）
chmod o+t directory

# 设置当前用户可读可写可执行，同组用户可读可写，其他用户无任何权限
chmod u=rwx,g=rw,o=- file

# 递归设置目录下的所有文件
chmod -R a+r /tmp
```

**数字设定法** 格式为：

> chmod [mode] file...

其中 mode 为一个三位的八进制值，每一位分别对应用户、用户组、其他用户的权限，每一位的值由 0（表示没有权限），1（表示可执行权限），2（表示可写权限），4（表示可读权限）相加而得。使用示例：

```
# 让用户和用户组对文件有个读写权限，其他用户仅有读权限（rw-rw-r--）
chmod 664 file

# 递归设置
chmod -R 666 /tmp/data
```

此外，文件还拥有一些隐藏的属性权限，使用 `lsattr` 和 `chattr` 命令来查看和设置。

以上所述的文权限控制都只能针对用户或者组进行配置，这在有些情况下可能无法满足需求。于是。Linux 又提供了 **ACL**（Access Control List，访问控制列表） 权限控制方式，其是一个针对文件或目录的访问控制列表。ACL 在用户与组权限管理的基础上提供一个额外的、更灵活的权限管理机制，被设计为文件权限管理的一个补充。ACL 能够允许给任何的用户或用户组设置任何文件或目录的任意访问权限。其特点是：

- 可以针对用户来设置权限
- 可以针对用户组来设置权限
- 子文件或目录继承父目录的权限

ACL 权限主要用 `getacl` 和 `setacl` 命令工具来查看和设置。使用示例：

```
# 设置用户 user1 对 test 文件的访问权限
setfacl -m u:user1:r-x test

# 设置用户组 group1 对 test/ 目录的访问权限
setfacl -m g:group1:rwx test/

# 查看 ACL 权限
getfacl test

# 删除 ACL 权限
setfacl -x g:group1 test

# 清空所有 ACL 权限
setfacl -b test
```

`stat` 命令用于查看文件或者文件系统的状态，包括 inode, atime, mtime, ctime 等信息。关于文件时间相关的信息说明：

- **atime：** Access time，访问时间。当读取文件内容时，该时间会改变，如使用 cat, cp, grep, sed, more, less, tail, head 等命令都会导致访问时间改变。`ls -lu` 命令会显示文件的访问时间
- **mtime：** Modify time，修改时间。当文件内容被修改时，该时间会改变，同时访问时间也会改变。`ls –l` 命令会显示文件的修改时间
- **ctime：** Change time，改变时间。当文件属性或文件位置改动时，该时间会改变，如使用 chmod, chown, mv 等命令，以及 ln 做软连接时都会导致改变时间更新。`ls -lc` 命令会显示文件的改变时间

stat 命令使用示例：

```shell
$ stat hello.py
  File: hello.py
  Size: 186       	Blocks: 0          IO Block: 4096   regular file
Device: 2h/2d	Inode: 281474976931650  Links: 1
Access: (0664/-rw-rw-r--)  Uid: ( 1000/   huoty)   Gid: ( 1000/   huoty)
Access: 2018-03-11 21:23:39.256654600 +0800
Modify: 2018-03-11 21:23:39.257435000 +0800
Change: 2018-03-11 21:23:39.257435000 +0800
 Birth: -
```

## 资源管理

### 系统负载

**系统负载(Load)** 是对计算机干活多少的度量（参见 [WikiPedia](https://en.wikipedia.org/wiki/Load_(computing))），简单的说是进程队列的长度。一般我们评估系统的负载时，用的都是 **平均负载(Load Average)**, 其被定义为 <u>在特定时间间隔内运行队列中的平均进程数</u>，也就是一段时间（1分钟、5分钟、15分钟）内平均 Load。如果一个进程满足以下条件则其就会位于运行队列中：

- 没有在等待 I/O 操作的结果
- 没有主动进入等待状态(也就是没有调用 wait)
- 没有被停止(例如：等待终止)

运行队列的数据结构每个 CPU 核都会维护一个，其在 CPU 调度中也起了很大的作用。运行队列的数据结构中定义的 `nr_running` 和 `nr_uninterruptible` 分别存放了这个 CPU 核上处于 R 状态和 D 状态的进程数量。命令 ps 描述着两种状态的含义为：

- R：正在运行的和准备就绪等待运行的进程（running & runnable）
- D：不可中断的进程（通常为 I/O）（uninterruptible）

其中不可中断状态的进程，可以这么理解：这个进程现在基本不在 CPU 上执行指令，但是它还是占用这个 CPU。这个进程在做一些事情（大部分是磁盘 I/O），做的这个事情不能被打断。为什么不能被打断，因为系统觉得它做的这个事情很重要，如果打断了可能结果很严重（比如进程正在读写磁盘数据，把它打断了可能会导致进程的数据和磁盘上的数据不一致的情况）。

<u>平均负载越高，说明其任务队列越长，处于等待执行的任务越多，但并不能说明 CPU 越繁忙</u>。例如，当有大量 D 状态的进程时，其表现可能是 Load Average 很高，但单独查看 CPU 使用率却很低，CPU 的 idle 时间很高，这可能就是有大量进程在等待 IO 操作，此时系统的瓶颈在于磁盘心性能而不是 CPU。

关于 CPU 的 Load Average 总结起来有以下两点：

- 1、运行队列是内核为每个 CPU 核维护的一个数据结构（这个数据结构要干很多事情）
- 2、运行队列里包含了 R 状态的进程和 D 状态的进程

系统负载应根据 CPU 数量去判断，如果平均负载小于 CPU 的数量时则认为系统负载不高。查看系统负载可以使用 **uptime** 命令，或者查看 **/proc/loadavg** 文件的内容：

```shell
$ cat /proc/loadavg
0.14 0.16 0.18 1/1213 4805
```

前三个数字分别表示最近 1 分钟、5 分钟、15 分钟系统的负载，接着是 **正在运行的进程数 / 系统进程总数**，最后一位是当前正在的运行的进程 ID。

```shell
$ uptime
19:46:28 up 292 days,  2:11,  2 users,  load average: 0.44, 0.31, 0.23
```

输出内容包含四个部分：

- 当前时间: 19:46:28
- 系统已运行时间 292 days,  2:11
- 当前登录用户: 2 users
- （最近 1、5、15 分钟内）平均负载：0.44, 0.31, 0.23

通常用 **平均负载 / CPU核数** 的值来衡量系统的繁忙程度：

- 0.7 < load < 1: 为最佳状态，系统运行良好，不怎么空闲，也不算繁忙
- load = 1: 系统基本满载运行，没有更多的资源运行额外的任务，不再适合添加任务
- load > 5: 系统非常繁忙，负载过高，需要检查下原因，或者停掉一些任务

**CPU 负载** 与 **CPU 使用率** 的区别与联系：CPU 使用率表示的是系统进程在运行期间实时占用的 CPU 百分比；CPU 负载则是一段时间内正在使用和等待使用 CPU 的平均任务数。CPU 使用率高，并不意味着负载就一定大，CPU 的利用率的高低，跟系统有多少任务在排队没有必然关系。

此外， **top** 命令也能查看 CPU 负载与 CPU 使用率。要详细的分析系统性能，不能单看系统负载，也得看内存、磁盘等的使用情况。

### 内存占用

内存的占用情况保存在 `/proc/meminfo` 文件中：

```shell
$ cat /proc/meminfo
MemTotal:       32941708 kB
MemFree:         1642272 kB
MemAvailable:   23815232 kB
Buffers:         5844044 kB
Cached:         10839060 kB
SwapCached:            0 kB
Active:         17489796 kB
Inactive:        4239972 kB
Active(anon):    7841480 kB
Inactive(anon):   218624 kB
Active(file):    9648316 kB
Inactive(file):  4021348 kB
...
```

但一般我们是用 **free** 命令来查看内存的使用情况：

```shell
$ free  -h
             total       used       free     shared    buffers     cached
Mem:           31G        31G       244M       2.9G       5.6G        11G
-/+ buffers/cache:        14G        17G
Swap:           0B         0B         0B
```

个字段的含义：

- total：总的物理内存
- used：使用中的内存
- free：完全空闲的内存
- shared：进程间共享的内存
- buffers：缓冲区（buffer cache）
- cache：页高速缓存（page cache）
- -buffers/cache：应用程序实际使用中的内存大小，等于 used - buffers - cached
- +buffers/cache：可供使用的内存总量，等于 free + buffers + cached
- Swap：交换分区的使用情况

可用的内存为 **buffers + cached + free**，buffers/cache 是为提高性能而设计，其可以被手动释放，所以可将其视为实际可用的内存。

Buffer 用于存储速度不同步的设备或优先级不同的设备之间传输数据，通过 buffer 可以减少进程间通信需要等待的时间，当存储速度快的设备与存储速度慢的设备进行通信时，存储慢的数据先把数据存放到 buffer，达到一定程度存储快的设备再读取 buffer 的数据。Buffer 一般是用在写入磁盘的时候，它的另一个作用是可以把分散的写操作集中进行，减少磁盘碎片和硬盘的反复寻道，从而提高系统性能。

Cache 是页面高速缓存，CPU 的速度远远高于主内存的速度，CPU 从内存中读取数据需等待很长的时间，而 Cache 保存着 CPU 刚用过的数据或循环使用的部分数据，从 Cache 中读取数据会更快，减少了 CPU 等待的时间，提高了系统的性能。Cache 一般会用在 I/O 请求上，如果多个进程要访问某个文件，可以把此文件读入 Cache 中，这样下一个进程获取 CPU 控制权并访问此文件直接从 Cache 读取。

Cache 是 CPU 与内存间的，Buffer 是内存与磁盘间的，即 Buffer 是将要被写入磁盘的，而 Cache 是被从磁盘中读出来的。命令 **flush** 可用于清空 buffer， **sync** 会强制将数据写入磁盘，但其可能引起系统 IO 的飙升。通常在系统关机前执行 sync 命令，以确保数据都被同步到磁盘。

<!-- 交换分区 -->

### 磁盘与文件

使用 `df` 命令可以查看系统磁盘的空间占用情况，如：

```shell
$ df -Th
Filesystem              Type      Size  Used Avail Use% Mounted on
udev                    devtmpfs   16G     0   16G   0% /dev
tmpfs                   tmpfs     3.2G  4.4M  3.2G   1% /run
/dev/vda1               ext4       40G   22G   16G  59% /
tmpfs                   tmpfs      16G  2.8G   13G  18% /dev/shm
tmpfs                   tmpfs     5.0M     0  5.0M   0% /run/lock
tmpfs                   tmpfs      16G     0   16G   0% /sys/fs/cgroup
/dev/vdb1               ext4      394G  324G   50G  87% /data
//10.44.164.125/data    cifs      1.1T  716G  368G  67% /data2
nas.aliyuncs.com://data nfs4      1.0P  3.3T 1021T   1% /data3
tmpfs                   tmpfs     3.2G     0  3.2G   0% /run/user/1000
```

其中 `-T` 参数表示显示文件系统的类型，`-h` 参数表示以人可读的形式显示磁盘空间大小。

磁盘使用时需要先挂载，磁盘挂载使用 `mount` 命令，其使用方式为：

```
mount [-fnrsvw] [-t vfstype] [-o options] 设备 挂载点
```

其中 `-t` 参数用于指定挂载的文件系统类型，通常不必指定，其会自动选择正确的类型，文件 `/proc/filesystems` 中列出了操作系统支持的所有文件系统类型：

```shell
$ cat /proc/filesystems
nodev   sysfs
nodev   tmpfs
        ext3
        ext2
        ext4
        squashfs
        vfat
nodev   ecryptfs
        fuseblk
...
```

`-o` 参数用于指定设备或档案的挂载方式：

- **loop：** 用来把一个文件当成硬盘分区挂接上系统
- **ro：** 采用只读方式挂接设备
- **rw：** 采用读写方式挂接设备
- **bind：** 已绑定方式挂载目录或文件
- **iocharset：** 指定访问文件系统所用字符集

使用示例：

```shell
# 在不指定任何参数的情况下默认列出所有挂载的文件系统
mount

# 列出所有指定类型的文件系统
mount -t tmpfs

# 关在磁盘到 /mnt 目录
mount /dev/sdb1 /mnt

# 只读挂载
mount -o ro /dev/sdb1 /mnt

# 把只读的挂载重新挂载为读写模式（这在系统出现故障进入单用户模式时非常有用）
mount / -o rw,remount

# 挂载光驱：
mount /dev/cdrom /mnt

# 挂载光盘镜像文件
mount -o loop -t iso9660 mydisk.iso /mnt/vcdrom

# 挂载 Windows 文件共享（其中 c$ 表示磁盘分区）
mount -t smbfs -o username=admin,password=123456 //10.140.133.23/c$ /mnt/samba

# 挂载 NFS 文件共享
mount -t nfs -o rw 10.140.133.9:/export/home/sunky /mnt/nfs

# bind 挂载目录或文件
mount --bind olddir newdir
mount --bind foo bar
mount mount -o bind,ro foo bar
```

磁盘卸载使用 `umount` 命令，其使用方式为：

```
umount [选项] [设备名或挂载点]
```

支持的选项：

```
-a, --all               卸载所有文件系统（/etc/mtab 中记录的已挂载的文件系统）
-A, --all-targets       卸载当前名字空间内指定设备对应的所有挂臷点
-d, --detach-loop       若挂臷了 loop 设备，同时也释放该 loop 设备
    --fake              空运行；跳过 umount(2) 系统调用
-f, --force             强制卸载(遇到不响应的 NFS 系统时)
-n, --no-mtab           不写 /etc/mtab
-l, --lazy              立即断开文件系统，清理以后执行
-O, --test-opts <列表>  限制文件系统集合(和 -a 选项一起使用)
-R, --recursive         递归卸载目录及其子对象
-r, --read-only         若卸载失败，尝试以只读方式重新挂臷
-t, --types <列表>      限制文件系统集合
-v, --verbose           打印当前进行的操作
-q, --quiet             忽略错误信息
```

如果提示系统繁忙，可以用 `umount -l`， `-l` 即 Lazy unmount，其会在挂载点空闲后再尝试 umount。

系统开机启动时会读取 `/etc/fstab` 文件中的内容，并根据文件中的配置自动挂载磁盘。所以在该文中的配置的磁盘，每次开机时可以自动被挂载，否则需要每次开机后手动挂载。在 `/etc/mtab` 文件中维护着当前挂载的文件系统的列表。由于在用户空间中维护的普通文件 /etc/mtab 很难稳定可靠的与 namespaces、containers 等 Linux 的高级功能协作，所以在较新的发行版中 /etc/mtab 文件一般是 `/proc/mounts` 文件的软连接，而在更新的发行版中，/etc/mtab 和 /proc/mounts 都是指向 `/proc/self/mounts` 的链接文件。

使用 `du` 命令可以统计磁盘、目录、文件的用量，命令的参数：

```
-a, --all             输出所有文件的磁盘用量，不仅仅是目录
    --apparent-size   显示表面用量，而并非是磁盘用量；虽然表面用量通常会
                      小一些，但有时它会因为稀疏文件间的"洞"、内部碎
                      片、非直接引用的块等原因而变大。
-B, --block-size=大小 使用指定字节数的块
-b, --bytes           等于--apparent-size --block-size=1
-c, --total           显示总计信息
-D, --dereference-args        解除命令行中列出的符号连接
    --files0-from=F   计算文件F 中以NUL 结尾的文件名对应占用的磁盘空间
                      如果F 的值是"-"，则从标准输入读入文件名
-H                    等于--dereference-args (-D)
-h, --human-readable  以可读性较好的方式显示尺寸(例如：1K 234M 2G)
    --si              类似-h，但在计算时使用1000 为基底而非1024
-k                    等于--block-size=1K
-l, --count-links     如果是硬连接，就多次计算其尺寸
-m                    等于--block-size=1M
-L, --dereference     找出任何符号链接指示的真正目的地
-P, --no-dereference  不跟随任何符号链接(默认)
-0, --null            将每个空行视作0 字节而非换行符
-S, --separate-dirs   不包括子目录的占用量
-s, --summarize       只分别计算命令列中每个参数所占的总用量
-x, --one-file-system         跳过处于不同文件系统之上的目录
-X, --exclude-from=文件       排除与指定文件中描述的模式相符的文件
    --exclude=PATTERN         排除与PATTERN 中描述的模式相符的文件
    --max-depth=N     显示目录总计(与--all 一起使用计算文件)
                      当N 为指定数值时计算深度为N；
                      --max-depth=0 等于--summarize
    --time            显示目录或该目录子目录下所有文件的最后修改时间
    --time=WORD       显示WORD 时间，而非修改时间：
                      atime，access，use，ctime 或status
    --time-style=样式 按照指定样式显示时间(样式解释规则同"date"命令)：
                      full-iso，long-iso，iso，+FORMAT
```

使用示例：

```
# 查看根目录下所有目录或文件的大小并按照大小排序
du -sh /* | sort -rh

# 查看主目录大小
du -sh ~

# 查看单个文件大小
du -sh /swapfile
```

使用 `fdisk`, `sfdisk`, `cfdisk` 等命令可以对磁盘进行分区。使用 `mkfs` 命令可以对分区（也可以是文件）进行格式化，或者直接 mkfs 加格式化类型，如 `mkfs.ext4`、`mkfs.exfat` 等。使用 `fsck` 命令可以检查或修复文件系统错误。

`lsof`(list open files) 是一个列出当前系统打开文件的工具。在 Unix 系统中，几乎所有的一切都被视为文件，如网络IO、硬件外设等都被标识为文件的形式。lsof 工具对系统和排错有很大帮助。lsof 命令常用参数：

```
-a  列出打开文件存在的进程
-c<进程名>  列出指定进程所打开的文件
-g  列出GID号进程详情
-d<文件号>  列出占用该文件号的进程
+d<目录>  列出目录下被打开的文件
+D<目录>  递归列出目录下被打开的文件
-n<目录>  列出使用NFS的文件
-i<条件>  列出符合条件的进程，可选值包括 4、6、协议、:端口、@ip
-p<进程号>  列出指定进程号所打开的文件
-u  列出UID号进程详情
```

使用示例：

```
# lsof 无任何参数时列出所有打开的文件
lsof | more

# 查看打开某个文件的进程
lsof -a /usr/bin/zsh

# 查看指定用户打开的文件
lsof -u user

# 查看指定程序打开的文件
lsof | grep mysql
lsof -c mysql
lsof -u user -c mysql

# 通过某个进程号查看该进程打开的文件
lsof -p 1234

# 通过某个进程号显示该进程打开的文件
lsof -p 11968

# 列出所有的网络连接
lsof -i

# 列出所有 tcp 网络连接信息
$lsof -i tcp
$lsof -n -i tcp

# 列出谁在使用某个端口
lsof -i :3306

# 列出某个用户的所有活跃的网络端口
lsof -a -u test -i

# 根据文件描述列出对应的文件信息
lsof -d 2

# 列出被进程号为 1234 的进程所打开的所有 IPV4 网络文件描述符
lsof -i 4 -a -p 1234

# 列出目前连接主机 nf5260i5-td 上端口为 20，21，80 相关的所有文件信息，且每隔 3 秒重复执行
lsof -i @nf5260i5-td:20,21,80 -r 3
```

另外，还有 `iostat`, `iowait`, `iotop` 等工具可用于监控磁盘的 IO 情况。其中 iotop 具有与 top 命令相似的 UI，其中包括 PID、用户、I/O、进程等相关信息，其常用参数有：

```
-o, --only  只显示正在产生I/O的进程或线程。除了传参，可以在运行过程中按o生效
-b, --batch  非交互模式，一般用来记录日志
-n NUM, --iter=NUM  设置监测的次数，默认无限。在非交互模式下很有用
-d SEC, --delay=SEC  设置每次监测的间隔，默认 1 秒，接受非整形数据例如 1.1
-p PID, --pid=PID  指定监测的进程/线程
-u USER, --user=USER  指定监测某个用户产生的 I/O
-P, --processes  仅显示进程，默认 iotop 显示所有线程
-a, --accumulated  显示累积的I/O，而不是带宽
-k, --kilobytes  使用kB单位，而不是对人友好的单位。在非交互模式下，脚本编程有用
-t, --time  加上时间戳，非交互非模式
-q, --quiet  禁止头几行，非交互模式
```

和 top 命令类似，iotop 也支持以下几个交互按键：

```
left 和 right 方向键： 改变排序的列
r： 反向排序
o： 切换至选项 --only
p： 切换至--processes选项
a： 切换至--accumulated选项
q： 退出
i： 改变线程的优先级
```

### 网络管理

网络是计算机中重要的功能。在 Linux 内核中，广义上的网络包括蓝牙、红外、CAN 总线等涉及计算机之间互联的网络，这里只简单讨论 Linux 中的因特网连接。

使用 `ifconfig` 可以查看网络设置基本信息，如：

```shell
$ ifconfig -a
eno1: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 00:9e:9f:03:03:38  txqueuelen 1000  (以太网)
        ...

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (本地环回)
        ...

wlp1s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.50.208  netmask 255.255.255.0  broadcast 192.168.50.255
        inet6 fe80::cdd9:faca:d9af:b722  prefixlen 64  scopeid 0x20<link>
        ether 90:78:41:6b:1f:57  txqueuelen 1000  (以太网)
        ...
```

网络设备不存在设备文件，设备名来自内核，由 udev （Userspace Device management）获得，ether 是硬件的 Mac 地址。ifconfig 命令的一些使用示例：

```
# 启动关闭指定网卡
ifconfig eth0 up    # 开启
ifconfig eth0 down  # 关闭

# 为网卡配置和删除IPv6地址
ifconfig eth0 add 33ffe:3240:800:1005::2/64  # 为网卡 eth0 配置 IPv6 地址
ifconfig eth0 del 33ffe:3240:800:1005::2/64  # 为网卡 eth0 删除 IPv6 地址

# 配置 IP 地址：
ifconfig eth0 192.168.2.10
ifconfig eth0 192.168.2.10 netmask 255.255.255.0
ifconfig eth0 192.168.2.10 netmask 255.255.255.0 broadcast 192.168.2.255

# 设置网卡的 IP 别名（给网卡配置多个 ip 地址，也即虚拟网络）
ifconfig eth0:0 192.168.6.100 netmask 255.255.255.0 up
ifconfig eth0:1 173.173.173.173 netmask 255.255.255.0 up
ifconfig eth0:2 119.110.120.1 netmask 255.255.255.0 up

# 启用和关闭arp协议：
ifconfig eth0 arp    # 开启网卡 eth0 的 arp 协议
ifconfig eth0 -arp   # 关闭网卡 eth0 的 arp 协议

# 设置最大传输单元：
ifconfig eth0 mtu 1500  # 设置能通过的最大数据包大小为 1500 bytes
```

`telnet` 是一个远程登录工具，即 TELNET 协议的用户接口。但由于其采用明文传输，安全性不好，在很多 Linux 系统中并不开放 telnet 服务，而是使用更为安全的 ssh 方式。telnet 命令也有其他的一些用途，使用示例：

```
# 远程登录主机
telnet 192.168.50.208

# 作为简单的域名解析工具
telnet baidu.com

# 测试远程主机端口是否可用
telnet 192.168.50.208 8888
```

网络设备之间的通信使用 MAC 地址（MAC 地址用于标识唯一的一台网络设备），MAC 地址专注于 **数据链路层**，将一个数据帧从一个节点传送到相同链路的另一个节点。但是，MAC 地址在早期是适用于以太网的，而且在早期存在存在各种不同的连接方式。后来，为了实现更大的网络互连，同时为了兼容就有网络结构，出现了因特网协议（TCP/IP协议），并定义用 IP 地址来标记两个不同的网络位置，也就形成了目前的网络分层处理架构。

IP 地址专注于网络层，将数据包从一个网络转发到另外一个网络。目前使用最为广泛的局域通信方式是以太网，其使用 ARP 协议实现 IP 与 MAC 地址之间的解析。局域网中的 IP 地址可以主动配置，也可以由 `DHCP`（
Dynamic Host Configuration Protocol，动态主机配置协议）服务器自动分配，使用 `dhclient -r` 可以从 DHCP 服务器获取新的 IP 地址。

`ARP`（Address Resolution Protocol，地址解析协议）用在局域网（LAN）内部。其使得网络设备可以知道在同一局域网内 IP-MAC 的对应关系。当访问一个本地的 IP 地址时，设备根据 ARP 协议查询到与之对应的 MAC 地址，然后与其建立通信。通过 `arp` 命令工具，可以知道局域网内的通信是否正常，也可以通过 `arp -a` 查看局域网内所有在线的设备。

由于 IP 地址难以记忆，所以后来又出现了 **域名**，用来与 IP 地址对应。从域名获取 IP 的过程称为域名解析，域名与 IP 的对应关系由 DNS 服务器来维护，客户端机器通过 DNS 协议来完成查询。Linux 系统的 DNS 服务器在 `/etc/resolv.conf` 配置文件中配置，可以配置多个 DNS 服务器：

```
nameserver 127.0.0.1
nameserver 223.5.5.5
nameserver 119.29.29.29
```

与 DNS 有关的命令工具有包括 `nslookup`、`dig`、`host`、`whois` 等。通过 `ping` 命令也可以作为一个简单的域名查询工具，但其通常用于查看网络的连接状况：

```shell
$ ping -c 5 baidu.com
PING baidu.com (39.156.69.79) 56(84) bytes of data.
64 bytes from 39.156.69.79 (39.156.69.79): icmp_seq=1 ttl=50 time=7.11 ms
64 bytes from 39.156.69.79 (39.156.69.79): icmp_seq=2 ttl=50 time=7.88 ms
64 bytes from 39.156.69.79 (39.156.69.79): icmp_seq=3 ttl=50 time=10.9 ms
64 bytes from 39.156.69.79 (39.156.69.79): icmp_seq=4 ttl=50 time=8.64 ms
64 bytes from 39.156.69.79 (39.156.69.79): icmp_seq=5 ttl=50 time=6.82 ms

--- baidu.com ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4004ms
rtt min/avg/max/mdev = 6.829/8.292/10.990/1.491 ms
```

IP 地址用于标记不同的网络位置，而 **端口** 则用于标记主机中的不同服务。如 21 用于 ftp 服务，53 用于域名解析服务，80 用于 HTTP 服务等，常用的端口号与服务的对应关系可以查看 `/etc/services` 服务。端口是用于网络通信的接口，是数据从传输层向上传递到应用层的数据通道。每个常规服务都有默认的端口号，通常用不同的端口来区分不同的服务。`netstat` 命令工具可用于查看主机的网络连接状态，其既可以查看本机开启的端口，也可以查看有哪些客户端在连接本机。netstat 的主要功能是输出网络连接、路由表、接口统计、伪装连接和组播的详细项。netstat 命令的常用参数：

```
-r, --route              显示路由表
-i, --interfaces         显示网络接口列表
-g, --groups             显示多重广播功能群组组员名单
-s, --statistics         按各个协议进行统计
-M, --masquerade         显示伪装的网络连线

-v, --verbose            显示详细信息
-W, --wide               不要截断 IP 地址
-n, --numeric            不解析名称
--numeric-hosts          不解析主机名
--numeric-ports          忽略端口名称
--numeric-users          忽略用户名
-N, --symbolic           显示网络硬件外围设备的符号连接名称
-e, --extend             显示更多信息
-p, --programs           显示进程ID和名称
-o, --timers             显示计时器
-c, --continuous         持续列出网络状态

-l, --listening          查看处于 Listen（监听）状态的连接
-a, --all                显示所有连接，默认只显示已建立连接的连接
-C, --cache              显示路由配置的快取信息

# 指定网络协议类型
-t | --tcp
-u | --udp
-U | --udplite
-S | --sctp
-w | --raw
-x | --unix
--ax25
--ipx
--netrom

# 指定网络连接类型
-6 | -4
-A <af>
--<af>

所有支持的连接类型：
    inet (DARPA Internet) inet6 (IPv6) ax25 (AMPR AX.25)
    netrom (AMPR NET/ROM) ipx (Novell IPX) ddp (Appletalk DDP)
    x25 (CCITT X.25)
    默认： inet
```

`netstat` 默认的输出结果可以分为两个部分：一部分是 Active Internet connections，即有源 TCP 连接，其中 "Recv-Q" 和 "Send-Q" 指的是接收队列和发送队列。这些数字一般都应该是 0。如果不是则表示软件包正在队列中堆积。这种情况只会在非常少的情况见到。Local Address 为本机的 ip:port（127.0.0.1 默认会显示主机名，0.0.0.0 默认显示 `*`，端口可能显示服务名称）。Foreign Address 为对端 ip:port，与 Local Address 规则相同。State 为当前套接字的网络状态。

另一部分是 Active UNIX domain sockets，即有源 Unix 域套接口(和网络套接字一样，但是只能用于本机通信，性能可以提高一倍)。其中 Proto 显示连接使用的协议，RefCnt 表示连接到本套接口上的进程号,Types 显示套接口的类型，State显示套接口当前的状态，Path 表示连接到套接口的其它进程使用的路径名。

TCP 套接字的网络连接状态大致包括下列几种：

- **LISTEN：**  侦听来自远方的 TCP 端口的连接请求
- **SYN-SENT：**  再发送连接请求后等待匹配的连接请求
- **SYN-RECEIVED：** 再收到和发送一个连接请求后等待对方对连接请求的确认
- **ESTABLISHED：**  代表一个打开的连接，表示正常数据传输状态
- **FIN-WAIT-1：**  等待远程 TCP 连接中断请求，或先前的连接中断请求的确认
- **FIN-WAIT-2：**  从远程 TCP 等待连接中断请求
- **CLOSE-WAIT：**  等待从本地用户发来的连接中断请求
- **CLOSING：**  等待远程 TCP 对连接中断的确认
- **LAST-ACK：**  等待原来的发向远程 TCP 的连接中断请求的确认
- **TIME-WAIT：**  等待足够的时间以确保远程 TCP 接收到连接中断请求的确认
- **CLOSED：**  没有任何连接状态

一些使用示例：

```
# 列出所有连接（包括监听和未监听的）
netstat -a    # 列出所有连接
netstat -at   # 列出所有 TCP 连接
netstat -au   # 列出所有 UD P连接

# 列出所有处于监听状态的 Sockets
netstat -l    # 只显示监听连接
netstat -lt   # 只列出所有监听 TCP 连接
netstat -lu   # 只列出所有监听 UDP 连接
netstat -lx   # 只列出所有监听 UNIX 连接

# 显示每个协议的统计信息
netstat -s   # 显示所有连接的统计信息
netstat -st  # 显示 TCP 连接的统计信息
netstat -su  # 显示 UDP 连接的统计信息

# 在输出中显示 PID 和进程名称
netstat  -pt

# 在输出中不显示主机，端口和用户(host,port or user)
# 即禁用反向域名解析，可加快显示速度
netstat -an
netstat -ant

# 持续输出
netstat -c    # 每隔 1 秒输出网络连接信息

# 显示核心路由信息
netstat -r
netstat -rn  # 显示数字格式，不显示主机名称

# 显示网络接口列表
netstat -i
netstat -ie  # 等同于 ifconfig

# 找出程序运行的端口
netstat -ap | grep ssh

# 找出运行指定端口的进程
netstat -an | grep :80

# 查看当前并发访问数
netstat -an | grep ESTABLISHED | wc -l
```

`ss`（Socket Statistics）命令也可以用于查看网络连接状态，其与 netstat 命令的功能类似，其用于显示处于活动状态的套接字信息。但 ss 的优势在于它能够显示更多更详细的连接状态的信息，而且比 netstat 更快速更高效。当机器网络连接数量太多时，使用 netstat 命令或者直接读取 `/proc/net/tcp`、`/proc/net/udp`等文件时，执行速度都会很慢，而 ss 命令则非常迅速。`ss` 命令的常用参数：

```
-n, --numeric       不解析服务名称，以数字方式显示
-r, --resolve       解析主机名
-a, --all           显示所有套接字信息
-l, --listening     显示监听状态的套接字
-o, --options       显示计时器信息
-e, --extended      显示详细的套接字信息
-m, --memory        显示套接字的内存使用情况
-p, --processes     显示使用套接字的进程
-i, --info          显示 TCP 内部信息
    --tipcinfo      显示 tipc 内部信息
-s, --summary       显示套接字使用概况
-N, --net           切换到指定的网络名字空间

# 网络连接类型
-4, --ipv4
-6, --ipv6
-0, --packet
-t, --tcp
-S, --sctp
-u, --udp
-d, --dccp
-w, --raw
-x, --unix
    --tipc
    --vsock
-f, --family=FAMILY
    FAMILY := {inet|inet6|link|unix|netlink|vsock|tipc|xdp|help}
```

使用示例：

```
# 显示所有网络连接的摘要信息
ss -s

# 显示所有 TCP 连接
ss -at

# 列出所有打开的网络连接端口
ss -l
ss -lp

# 列出所有 HTTP 连接中的连接
ss -o state established '( dport = :http or sport = :http )'

# 列出处在 FIN-WAIT-1 状态的 HTTP、HTTPS 连接
ss -o state fin-wait-1 '( sport = :http or sport = :https )'
```

另外，还有其他一些网络工具可以使用，如 `tc` 可对网络流量进行控制，`nethogs` 可用于监控每个进程的网络流量，`nload` 可监视某一网络带宽的出入情况，`trickle` 可限制单个进程的带宽。

### 资源限制

Linux 内核支持对 用户 或 进程 的资源占用进行控制。**资源限制**（Resource Limit 或 rlimit）的目的包括，实现性能调优，资源公平有效的分区，系统安全保护等。可控制的系统资源包括： 内存 、 文件 、 锁 、 CPU 调度 、 进程数 等。

`ulimit` 是 Shell 的内建命令，用于查看、调整当前 Shell 进程的 rlimit 值。支持的参数：

```
-S        使用软 (`soft') 资源限制
-H        使用硬 (`hard') 资源限制
-a        所有当前限制都被报告
-b        套接字缓存尺寸
-c        创建的核文件的最大尺寸
-d        一个进程的数据区的最大尺寸
-e        最高的调度优先级 (`nice')
-f        有 shell 及其子进程可以写的最大文件尺寸
-i        最多的可以挂起的信号数
-k        分配给此进程的最大 kqueue 数量
-l        一个进程可以锁定的最大内存尺寸
-m        最大的内存进驻尺寸
-n        最多的打开的文件描述符个数
-p        管道缓冲区尺寸
-q        POSIX 信息队列的最大字节数
-r        实时调度的最大优先级
-s        最大栈尺寸
-t        最大的CPU时间，以秒为单位
-u        最大用户进程数
-v        虚拟内存尺寸
-x        最大的文件锁数量
-P        最大伪终端数量
-T        最大线程数量
```

示例：

```
$ ulimit -a
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 30817
max locked memory       (kbytes, -l) 65536
max memory size         (kbytes, -m) unlimited
open files                      (-n) 1024
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 30817
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited

$ ulimit -n
1024
```

**软资源限制** 即实际的限制值， 直接作用于用户或者进程。由于软限制可以被用户调高或者调低，如果不加限制，则失去了调整的意义，所以又引入了 **硬资源限制**。硬限制用于规定软限制调整的上限，即调整 软限制 时，不能超出 硬限制。设置 rlimit 限制时，未指定软硬，则同时设置，一旦调低 硬限制 ，则无法在调高，除非使用 root 用户。ulimit 命令默认返回软限制值，如果要查看硬限制则需加上 `-H` 参数。

`ulimit` 的初始值继承自 `/etc/security/limits.conf` 配置文件的配置项和系统的默认值。通过编辑该配置文件，可使配置永久生效。配置格式如下：

```
#<domain>      <type>  <item>          <value>
*               soft    core            0
root            hard    core            100000
*               hard    rss             10000
@student        hard    nproc           20
@faculty        soft    nproc           20
@faculty        hard    nproc           50
ftp             hard    nproc           0
ftp             -       chroot          /ftp
@student        -       maxlogins       4
```

其中每个配置行由 4 个字段组成，分别是：

- 域 (domain)，即用户或者用户组(以 @ 开头，例如 @admin )，* 则表示任意用户
- 类型 (type)，包括 软限制(soft) 和 硬限制(hard) 两种
- 资源项 (item)
- 值 (value)

`/etc/security/limits.conf` 配置文件是针对用户级别来配置和生效的，它的一些配置受限于 `/etc/sysctl.conf` 中的配置。`/etc/sysctl.conf` 配置文件是针对整个系统参数配置，其用于控制内核相关的配置参数，且其内容全部是对应于 `/proc/sys/` 目录下的子目录及文件。例如，有时我们在修改最大的打开文件数时，发现如果修改得特别大，实际并未生效，这就可能是修改的值超过了系统级别的限制。

查看系统级别能打开的最大文件数：

```shell
$ cat /proc/sys/fs/file-max
787988
```

而进程级别能打开的最大文件数：

```shell
$ ulimit -n
1024
```

如果需要把打开文件数就该为大于 /proc/sys/fs/file-max 文件中的值，则需要修改 `/etc/sysctl.conf` 文件，在该文件中加入如下内容：

```
fs.file-max = 65535000
```

其中，与 `fs.file-max` 配置项有关的一个参数是 `file-nr`, 该参数是只读的:

```shell
$ cat /proc/sys/fs/file-nr
10108   0       787988
```

`file-nr` 的值由 3 部分组成，分别为已经分配的文件描述符数；已经分配但未使用的文件描述符数；内核最大能分配的文件描述符数。

修改文件 `/etc/sysctl.conf` 配置文件后，需要执行以下令使配置立即生效：

> sysctl -p

用户级别能打开的最大数则需要修改 `/etc/security/limits.conf` 文件，在其中加入如下内容：

```
* soft nofile 65535000
* hard nofile 65535000
```

以上修改不会对当前用户的登录 Session 立即生效。如果想要生效需要重新登录用户，或者可以使用 ulimit 命令先临时设置。

做了以上的修改可能某些进行运行时仍然会有类似 `Can’t open so many files` 这样的错误。Linux 除了对系统级别和用户级别的最大打开文件数有限制外，还对单个进程能够打开的最大文件数有限制，这个限制与 fs.nr_open 配置项有关。查看单个进程可以分配的最大文件数：

```shell
$ cat /proc/sys/fs/nr_open
1048576
```

这个值默认是 1024 * 1024 (1048576)，ulimit 命令设置的值不能超过 nr_open 设置的值，如果超过则不生效且实际使用默认值 1024。至此，应该清除的是，配置项 file-max 是内核可分配的最大文件数，nr_open 是单个进程可分配的最大文件数，所以在使用 ulimit 或 limits.conf 来设置时，如果要超过默认的 1048576 值时需要先增大 nr_open 值，修改该值可以直接修改 /etc/sysctl.conf 文件，也可以通过如下命令设置：

> sysctl -w fs.nr_open=65535000

### 组合工具

`vmstat` 命令工具可对操作系统的虚拟内存、进程、CPU活动进行监控。其展现整个系统在给定时间间隔的各项状态值。其用法格式为：

> vmstat [options] [delay [count]]

常用参数：

```
-a    显示活跃和非活跃内存
-f    显示从系统启动至今的fork数量
-m    显示 slabinfo
-n    只在开始时显示一次各字段名称
-s    显示内存相关统计信息及多种系统活动数量
-d    显示磁盘相关统计信息
-p    显示指定磁盘分区统计信息
-S    使用指定单位显示。参数有 k 、K 、m 、M ，分别代表 1000、1024、1000000、1048576 字节（byte）。默认单位为K（1024 bytes）

delay： 刷新时间间隔。如果不指定，只显示一条结果
count： 刷新次数。如果不指定刷新次数，但指定了刷新时间间隔，则一直刷新
```

使用示例：

```shell
$ vmstat 2 2
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 0  0      0 5148348 492008 2043460    0    0     0     1    8    9  1  0 99  0  0
 0  0      0 5148340 492008 2043460    0    0     0     0  133  236  0  0 100  0  0
```

输出中各字段的含义：

**Procs（进程）**

- **r:** (run)运行队列中进程数量，可用于判断 CPU 负载（长期大于 CPU 核数则负载较高）
- **b:** (block)等待 IO 的进程数量

**Memory（内存）**

- **swpd:** 使用 swap 内存大小。如果 swpd 的值不为 0，但是 SI，SO 的值长期为 0，这种情况不会影响系统性能
- **free:** 空闲物理内存大小
- **buff:** 用作缓冲的内存大小
- **cache:** 用作缓存的内存大小，如果 cache 的值大的时候，说明 cache 处的文件数多，如果频繁访问到的文件都能被 cache 处，那么磁盘的读 IO 的 bi 值会非常小

**Swap（交换分区）**

- **si:** 每秒从交换区写到内存的大小，由磁盘调入内存
- **so:** 每秒写入交换区的内存大小，由内存调入磁盘

注意：内存够用的时候，这 2 个值都是 0，如果这 2 个值长期大于 0 时，系统性能会受到影响，磁盘 IO 和 CPU 资源都会被消耗。如果看到空闲内存（free）很少的或接近于 0 时，就认为内存不够用了，不能光看这一点，还要结合 si 和 so，如果 free 很少，但是 si 和 so 也很少（大多时候是 0），那么不用担心，系统性能这时不会受到影响的。

**IO（磁盘读写）**

- **bi:** 每秒读取的块数（块设备是指系统上所有的磁盘和其他块设备，默认块大小是 1024byte）
- **bo:** 每秒写入的块数

注意：随机磁盘读写的时候，这 2 个值越大（如超出 1024k)，能看到 CPU 在 IO 等待的值也会越大。这里仅包含块设备（磁盘）IO，而不包含网络 IO。

**System（系统）**

- **in:** 每秒中断数，包括时钟中断
- **cs:** 每秒上下文切换数

注意：上面 2 个值越大，会看到由内核消耗的 CPU 时间会越大。

**CPU（以百分比表示）**

- **us:** 用户进程执行时间百分比(user time)。该值值比较高时，说明用户进程消耗的 CPU 时间多，但是如果长期超 50% 的使用，则该考虑优化程序算法或者进行加速
- **sy:** 内核系统进程执行时间百分比(system time)。该值高时，说明系统内核消耗的 CPU 资源多，这并不是良性表现，则应该分析下原因
- **id:** 空闲时间百分比
- **wa:** IO 等待时间百分比。该值值高时，说明 IO 等待比较严重，这可能由于磁盘大量作随机访问造成，也有可能磁盘出现瓶颈（块操作）
- **st:** 虚拟机偷取时间

`ipcs` 命令工具可以查看进程间的资源状态，包括消息队列、共享内存和信号量的信息，对调试程序有一定帮助。使用示例：

```shell
# 查看各项相关的参数配置
$ ipcs -l

unable to fetch message limits

------ Shared Memory Limits --------
max number of segments = 4096
max seg size (kbytes) = 18014398509481983
max total shared memory (kbytes) = 18014398509481980
min seg size (bytes) = 1

------ Semaphore Limits --------
max number of arrays = 32000
max semaphores per array = 32000
max semaphores system wide = 1024000000
max ops per semop call = 500
semaphore max value = 32767

# 查看个信息状态
$ ipcs

------ Message Queues --------
key        msqid      owner      perms      used-bytes   messages

------ Shared Memory Segments --------
key        shmid      owner      perms      bytes      nattch     status

------ Semaphore Arrays --------
key        semid      owner      perms      nsems
```

## 进程管理

**进程** 可以理解为程序执行的一个实例，包括可执行程序以及与其相关的系统资源，如打开的文件、挂起的信号、内核内部数据、处理器状态、内存地址空间及包含全局变量的数据段等等。每个进程有一个进程 ID（即 PID）来标识进程的唯一性。进程由父进程创建，所以进程还有一个父进程 ID（即 PPID）来标识其由谁创建。Linux 系统启动后，会首先创建 `init` 进程，由该进程来创建其他的子进程。**init 进程** 的进程 ID 总是为 `1`，它没有父进程，它还负责接管所有的 **孤儿进程**（父进程已经结束退出的进程）。

进程的创建通常使用 `fork()` 系统调用来完成，新的进程通过父进程复制自身得到。每个进程都在内存中分配有属于自己的空间 (包含栈、堆、全局静态区、文本常量区、程序代码区等)。而如果调用 `exec` 函数族，进程会清空自身的内存空间，并根据新的程序文件重建程序代码、文本常量、全局静态、堆和栈(此时堆和栈大小都为 0)，并开始运行。

通常将进程分为两种类型：前台进程（也称为交互式进程），其由终端会话初始化和控制，如果用户注销或者终端退出，会收到 HUP 信号从而退出；后台进程（也称为非交互式/自动进程/守护进程），其不受终端控制和影响，在后台持续运行，通常作为服务运行。

每个进程除了有一个进程 ID 之外，还属于一个 **进程组**（Process Group）。进程组是一个或多个进程的集合，这些进程并不是孤立的，它们彼此之间或者存在父子、兄弟关系，或者在功能上有相近的联系。每个进程组都有一个进程组领导进程（Process Group Leader），领导进程的 PID 成为进程组的 ID (Process Group ID, PGID)，以识别进程组。进程组便于对多个进程进行统一管理，例如可以对整个进程组发送信号：

```
# 用 kill 命令在进程组 ID 前加 - 即表示给整个进程组发信号
kill -- -$PGID   # 发送默认的信号 (TERM = 15)
kill -9 -$PGID   # 发送指定信号 (9)

# 使用 pkill 命令通过 -g 参数指定进程组 ID
pkill -9 -g $PGID
```

查看进程组 ID 可以用 ps 命令：

```shell
$ ps -o pid,pgid,ppid,comm | cat
  PID  PGID  PPID COMMAND
18683 18683 25255 ps
18684 18683 25255 cat
25255 25255 25254 zsh

$ ps j
 PPID   PID  PGID   SID TTY      TPGID STAT   UID   TIME COMMAND
 2059  2335  2335  2335 pts/2     2335 Ss+   1000   0:08 -zsh
25255 18700 18700 25255 pts/0    18700 R+    1000   0:00 ps j
25254 25255 25255 25255 pts/0    18700 Ss    1000   0:16 -zsh
```

只要在某个进程组中一个进程存在，则该进程组就存在，这与其组长进程是否终止无关。进程必定属于一个进程组，也只能属于一个进程组。一个进程组中可以包含多个进程。进程组的生命周期从被创建开始，到其内所有进程终止或离开该组。

多个进程组可以构成一个 **会话**（Session），一次用户登录会形成一个会话。每个会话都有一个会话首领，即创建会话的进程，通常叫做会话 **领导进程**（Session Leader）。会话领导进程的 PID 成为识别会话的 **SID**（Session ID）。会话中的每个进程组被视为一个 **作业**（Job）。会话包含一个前台作业和任意多个后台作业，这被称为 **作业控制**。作业与进程组的区别在于，如果作业中的某个进程又创建了子进程，则子进程不属于作业。一个会话可以有一个 **控制终端**。会话的领头进程打开一个终端后, 该终端就成为该会话的控制终端。控制终端通常是登录到其上的终端设备（在终端登陆情况下）或伪终端设备（在网络登陆情况下），建立与控制终端连接的会话首进程也被称为 **控制进程**。产生在控制终端上的输入、输出和信号将发送给会话的前台进程组中的所有进程。

查看进程的相关信息时，通常使用 `ps`（Process Status）命令。其常用的参数有：

```
# 标准风格参数
-e  显示所有进程
-f  显示更多的信息
-w  宽输出，使用两次将不截短输出
-p  指定进程ID
-u  显示指定用户的进程

# BSD 风格参数
a  显示所有在控制终端下运行的进程，包括其他用户
u  以用户为主显示进程信息
x  显示所有进程，不以是否有终端(tty)来区分
e  列出进程时，显示每个程序所使用的环境变量
j  列出与作业控制有关的信息
w  同 -w

# 其他参数
--sort  指定排序的列
```

使用示例：

```
# 查看所有进程
ps -ef
ps aux

# 同时查找多个关键字的进程
ps aux | grep -E "aaa|bbb"

# 查看进程中的线程
ps -L <PID>

# 解决长输出被自动截短的问题
ps auxww
ps aux | less
ps aux | less -S
ps -efww

# 自定义显示的字段
ps -o user,uid,pid,ppid,pgid,sid,ni,pri,tty,stat,pcpu,pmem,vsz,rss,start,time,comm,cmd

# 查看进程真实的启动时间
ps -o pid,lstart,cmd -p <PID>

# 查看进程 niceness 优先级
ps ax -o pid,ni,cmd

# 按用户、父进程、进程的 ID 排序（-表示降序，+表示升序）
ps axj --sort=uid,-ppid,+pid

# 实时监控进程的 CPU 和 内存占用最高的前 20 个进程
watch -n 1 'ps -aux --sort -pcpu,-pmem | head 20'
```

查看所有进程使用最多的是 `ps aux` 命令：

```shell
$ ps aux | head -5
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 168316 12244 ?        Ss   12月19   0:20 /sbin/init splash
root         2  0.0  0.0      0     0 ?        S    12月19   0:00 [kthreadd]
root         3  0.0  0.0      0     0 ?        I<   12月19   0:00 [rcu_gp]
root         4  0.0  0.0      0     0 ?        I<   12月19   0:00 [rcu_par_gp]

$ ps aux | tail -5
huoty    26699  0.0  0.0  13276  4952 ?        S    11:17   0:00 sshd: huoty@pts/0
huoty    26701  0.4  0.0  22636  7740 pts/0    Ss   11:17   0:01 -zsh
root     26784  0.0  0.0      0     0 ?        I    11:20   0:00 [kworker/u8:0]
huoty    26944  0.0  0.0  20088  3828 pts/0    R+   11:23   0:00 ps aux
huoty    26945  0.0  0.0  16932   840 pts/0    S+   11:23   0:00 tail -5
```

命令输出中各列的含义：

- **USER：** 用户名
- **PID：** 进程ID（Process ID）
- **%CPU：** 进程的 CPU 占用率
- **%MEM：** 进程的内存占用率
- **VSZ：** 进程所使用的虚存的大小（Virtual Size）
- **RSS：** 进程使用的驻留集大小或者是实际内存的大小，Kbytes 字节。
- **TTY：** 与进程关联的终端（tty）
- **STAT：** 进程的状态：进程状态使用字符表示的（STAT 的状态码）
- **TIME：** 进程使用的总 CPU 时间
- **COMMAND：** 正在执行的命令行命令。包含 `[]` 为内核线程，其在内核里创建，没有用户空间代码

进程的五种基本状态：

- **R:** 运行，正在运行或在运行队列中等待
- **S:** 中断，休眠中，受阻，在等待某个条件的形成或接收到信号
- **D:** 不可中断，收到信号不唤醒和不可运行，进程必须等待直到有中断发生
- **Z:** 僵死，进程已终止，但进程描述还在，等待父进程调用 wait 系统调用后释放
- **T:** 停止，收到 SIGSTOP, SIGSTP, SIGTOU 信号

进程的其他附加状态：

- **<：** 优先级高的进程
- **N：** 优先级低的进程
- **L：** 有些页被锁进内存
- **X：** 退出（进程即将被销毁，基本很少见）
- **W：** 进入内存交换（从内核2.6开始无效）
- **s：** 进程的领导者（在它之下有子进程）
- **l：** 是多线程
- **+：** 位于后台的进程组

另外，还有 `pstree` 命令工具可用于查看进程树之间的关系。ps 命令仅是查看进程在某一时刻的快照信息，要实时监控进程的状态可以使用 `top` 命令。top 命令格式为：

```
top -hv | -bcHiOSs -d secs -n max -u|U user -p pid(s) -o field -w [cols]
```

常用参数说明：

```
-b  批处理，配合 -n 参数在 shell 脚本变成中使用
-c  显示完整的启动命令
-H  线程模式
-i  忽略失效进程，即不显示任何闲置 (idle) 或无用 (zombie) 的进程
-O  列出支持的列名
-S  累积模式
-s  保密模式，无法使用交互模式输入指令
-d  <时间>  刷新的间隔时间
-n  <次数>  循环显示的次数，达到该次数后则退出
-u  <用户名>  指定用户名
-p  <进程号>  指定进程（指定多个进程时用 -pN1 -pN2 ... 或 -pN1,N2,N3...）
-o  <字段名>  指定排序字段
-w  <宽度>  指定输出的宽度
```

命令模式下的快捷键说明：

```
'A' - 切换交替显示模式，分别显示 Def，Job，Mem，Usr 四个窗口
'd' - 改变刷新的间隔时间
'H' - 开关线程模式
'I' - 切换 Irix/Solaris 模式
'B' - 开关粗体显示模式

<回车> 或 <空格> - 立即刷新显示

'l' - 开关负载统计显示行
't' - 开关任务和CPU统计显示行
'm' - 开关内存统计显示行
'1' - 开关单 CPU 显示模式

'b' - 高亮当前运行进程
'c' - 打开完整的命令行（显示进程启动时的完整路径和程序名）
'i' - 不显示空闲进程（可以只显示活动的进程）
'J' - 数字右对齐
'j' - 字符串右对齐
'R' - 颠倒排序顺序
'u'/'U' - 根据用户过滤进程（可以只显示指定用户的进程）
'x' - 高亮排序列
'y' - 加粗显示当前运行进程
'z' - 开关彩色显示模式
'n' - 设置最大显示的任务数
'r' - 重新设置进程优先级
'S' - 切换到累计模式
'V' - 切换为树形显示模式（显示进程父子关系）
'M' - 根据驻留内存大小进行排序
'P' - 根据 CPU 使用百分比大小进行排序
'T' - 根据时间/累计时间进行排序
'k' - 结束进程
```

`top` 命令的输出示例：

```shell
$ top -c -b -n 1
top - 12:41:24 up 8 days,  4:34,  0 users,  load average: 0.52, 0.58, 0.59
Tasks:  20 total,   1 running,  19 sleeping,   0 stopped,   0 zombie
%Cpu(s):  1.9 us,  1.7 sy,  0.0 ni, 96.4 id,  0.0 wa,  0.1 hi,  0.0 si,  0.0 st
KiB Mem : 16635856 total,  6794764 free,  9611740 used,   229352 buff/cache
KiB Swap: 13491196 total, 12933732 free,   557464 used.  6890384 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
    1 root      20   0    8976    120     40 S   0.0  0.0   0:00.19 /init ro
   23 root      20   0   13656    460    400 S   0.0  0.0   0:07.13 /usr/sbin/cron
   43 root      20   0   19464    264    108 S   0.0  0.0   0:00.00 /usr/sbin/sshd
```

其中，CPU 使用信息展示行 `%Cpu(s)` 各字段的含义：

- **us：** user time，用户态使用的 CPU 时间比，包括 nice 时间。通常都是希望用户空间CPU越高越好
- **sy：** system time，系统态使用的 CPU 时间比，包括 IRQ 和 softirq。系统 CPU 占用越高，表明系统某部分存在瓶颈。通常这个值越低越好
- **ni：** nice time，用户进程空间内改变过优先级的进程占用 CPU 百分比
- **id：** idle time，空闲的 CPU 时间比
- **wa：** waiting time，CPU 等待 IO 操作的时间。如果大量的时间在等待 IO 操作，则说明 IO 存在瓶颈
- **hi：** hard IRQ time，硬中断消耗时间
- **si：** soft IRQ time，软中断消耗时间
- **st：** steal time，被强制等待（involuntary wait）虚拟 CPU 的时间，此时 Hypervisor 在为另一个虚拟处理器服务（译注：如果当前处于一个 hypervisor 下的 vm，实际上 hypervisor 也是要消耗一部分 CPU 处理时间的）

进程信息中的 `VIRT`（Virtual Memory Usage，虚拟内存）指进程占用的虚拟内存大小，包括进程使用的库、代码、数据等，假如进程申请 100M 的内存，但实际只使用了 10M，那么虚拟内存用量会增长 100M，而不是实际的使用量。`RES`（Resident Memory Usage，常驻内存）指进程当前使用的实际内存大小，但不包括 wap out 的内存，如果申请 100M 的内存，实际使用 10M，则常驻内存只增长 10M。`SHR`（Shared Memory，共享内存）指与其他进程共享的内存。

`NI` L列的值为进程的优先级 nice 值。该值标记进程的 CPU 调度优先级，值的范围是 -19 到 20，值越低优先级约高。一般由用户启动的进程，nice 值默认为 0。`nice` 命令工具可用于查看当前进程进程优先，加上 `-n` 参数时可以指定优先级的修正值，即在默认优先级的基础上加上修正值：

```shell
$ nice
0
$ nice -n 10 nice
10
$ nice -n 5 nice
5
$ nice -n 10 nice
10
$ sudo nice -n -15 nice
-15
```

`renice` 命令可用于调整正在运行的进程的调度优先级。其常用参数为：

```
-n  指定新的 nice 值
-g  指定进程组 ID
-p  指定进程 ID
-u  指定用户名或者用户 ID
```

`kill`，`pkill`，`killall` 命令均可用于杀死进程，杀死进程的过程实际上是给进程发送指定信号。`kill` 命令使用示例：

```shell
# 列出所有信号
$ kill -L
 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL       5) SIGTRAP
 6) SIGABRT      7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1
11) SIGSEGV     12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM
16) SIGSTKFLT   17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ
26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO       30) SIGPWR
31) SIGSYS      34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3
38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13
48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7
58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX

# 查看信号值对应的信号名
$ kill -l 11
SEGV

# 向信号为 1000 的进程发送信号
$ kill -15 1000

# 检查进程是否存在
$ kill -0 <PID>

# 杀死能够杀死的所有进程
$ kill -9 -1
```

`kill` 命令还可以指定 `-0` 参数，表示不发送任何信号给 PID 对应的进程，但是仍会对变量值 PID 对应的进程是否存在进行检查。这一功能通常应用在 Shell 脚本中，用于判断进程是否存在，如像 if (kill -0 $pid 2>/dev/null) 这样使用。

使用 kill 命令杀死进程时，一般需要先用 ps 命令查找进程的 PID。而 `pkill` 则可以通过直接匹配进程名来杀死进程，其用法为：

> pkill [options] <pattern>

常用的参数有：

```
-<sig>, --signal <sig>    指定要发送的信号
-e, --echo                显示被杀掉的进程
-f, --full                使用完成的进程名来匹配
-g, --pgroup <PGID,...>   杀死指定的进程组
-i, --ignore-case         匹配时忽略大小写
-P, --parent <PPID,...>   匹配指定父进程的所有子进程
-s, --session <SID,...>   匹配指定的会话 ID
-t, --terminal <tty,...>  匹配控制终端
-u, --euid <ID,...>       匹配用户 effective ID
-U, --uid <ID,...>        匹配用户真实的 ID
```

使用示例：

```
# 杀死所有 nginx 进程
pkill -9 nginx

# 杀死所有 'python -m' 启动的进程
pkill -9 -f 'python -m'

# 杀死进程组 12345
pkill -9 -g 12345

# 杀死控制终端为 pts/1 的所有进程（剔除用户）
pkill -9 pts/1
```

`killall` 命令也用于杀死指定名字的进程，与 pkill 功能类似，只是参数有所不同，可根据习惯和爱好选择一个命令学习即可。

`htop` 是一个交互方式比 top 命令更好的进程监控和管理工具。在功能上 htop 有很多 top 没有的功能：htop 启动比 top 更快，支持不同颜色显示主题，可横向或纵向滚动浏览进程列表（能查看完成的进程名），并支持鼠标操作，支持对进程进行标记然后批量杀死进程。


## 服务管理

**服务** 可以理解为在系统中长期运行的进程或者一组进程。这些进程也被称之为 **守护进程**。在 Linux 中，系统其中后，其所有的进程都交由 **init 进程**（进程 pid 为 1 的进程）来管理。`init 进程` 是内核启动的第一个用户级进程，它会负责很多的工作，如启动 getty（用于用户登录）、实现运行级别、以及处理孤儿进程等等。在 init 进程其中后，会陆续启动系统运行必不可少的进程，这些进程就是所谓的服务，也可以理解为，服务被 init 进程管理。

早期的 init 进程实现是 **System V**。在 System V 中定义了 7 个运行级别，不同的级别代表着不同的状态：runlevel0 表示关机；runlevel1 表示单用户模式，仅 root；runlevel2 表示带网络的单用户模式；runlevel3 表示多用户模式，字符界面，标准模式；runlevel4 表示保留；runlevel5 表示多用户模式，图形界面，X11(X Window)；runlevel6 表示重启。System V 主要用 `chkconfig`、`sevice`、`update-rc.d` 等命令管理服务，且服务配置脚本放入 `/etc/init.d` 目录中。所以在支持 System V 的系统中，可以用如下的方式来启动、暂停、重启服务：

```
/etc/init.d/cron start|stop|restart|reload|status

# 或者

service cron start|stop|restart|reload|status
```

之后，大部分的 Linux 系统开始采用 **Systemd** 作为 init 进程。Systemd 即为 system daemon，其目的是为了取代来一直在使用的 init 系统，兼容 System V 和 LSB 的启动脚本，而且能够在进程启动过程中更有效地引导加载服务。在 Systemd 中，没有运行级别（runlevel）的概念，而是被新的运行目标（target）所取代。tartget 的命名类似于 multi-user.target 的形式，比如原来的运行级别 3（runlevel3）就对应新的多用户目标（multi-user.target），runlevel5 就相当于 graphical.target。

Systemd 的服务配置脚本都称为 unit，主要分成 6 类：.service, .socket, .target, .path, snapshot, .timer，被存放在 `/usr/lib/systemd/system/` 目录中。其主要使用 `systemctl` 命令来管理服务:

```
systemctl start|stop|restart|reload|status|is-active|is-enable|enable|disable|mask|umask
```

在 Ubuntu 18.04 系统中，init 已经指向了 systemd：

```shell
$ ls -l `which init`
lrwxrwxrwx 1 root root 20 Oct 31  2018 /sbin/init -> /lib/systemd/systemd
```

Ubuntu 系统在使用 systemd 后，为兼容旧式的操作，仍然支持使用 `service` 命令来管理服务。

如果用户需要添加自己的服务进程，则需要编写 System V 或者 Systemd 的服务配置脚本，这些脚本编写起来都比较麻烦。可以尝试使用 `supervisor` 来管理自己的服务。Supervisor 是基于 Python 的进程管理工具，可方便的启动守护进程，并对进程进行管理（启动、重启和停止进程，异常退出时还能能自动重启）。

## 日志管理

记录程序运日志的作用是，便于查看程序当前正在做的工作，以及便于程序异常后定位问题。Linux 系统中大部分程序的运行日志都集中放置到 `/var/log/` 目录下。在 Linux 系统中一般使用 syslog 服务或者日志代理来几种管理日志。`syslog` 服务支持本地日志的采集，然后通过 syslog 协议传输日志到中心服务器。也可以使用其它的一些集中式日志管理工具：

- **rsyslog** 是一个轻量后台程序，在大多数 Linux 分支上已经安装
- **syslog-ng** 是第二流行的 Linux 系统日志后台程序
- **logstash** 是一个重量级的代理，它可以做更多高级加工和分析
- **fluentd** 是另一个具有高级处理能力的代理

`rsyslog` 是比 syslog 功能更加完善的日志收集工具。现大多数 Linux 上都使用 rsyslog 取代 syslog 作为默认的日志管理工具。

一些常见的日志文件：

```
/var/log/messages   # 记录内核消息,各种服务的公共消息
/var/log/dmesg      # 记录系统启动过程的各种消息
/var/log/cron       # 记录与 cron 计划任务相关的消息
/var/log/maillog    # 记录邮件收发相关的消息
/var/log/secure     # 记录与访问限制相关的安全消息

# 用户相关日志
/var/log/lastlog    # 记录最近的用户登陆事件
/var/log/wtmp       # 记录成功的用户登录/注销事件
/var/log/btmp       # 记录失败的用户登录事件
/var/log/utmp       # 记录当前登录的每个用户的相关信息
```

日志文件日积月累后会变得很大，不利于查看和保存。所以 Linux 系统中一般会用 `logrotate` 工具来轮转日志，即日志达到某一条件后便将其转存。Logrotate 基于 cron 服务来运行，其脚本是 `/etc/cron.daily/logrotate`，如：

```shell
#!/bin/sh

# Clean non existent log file entries from status file
cd /var/lib/logrotate
test -e status || touch status
head -1 status > status.clean
sed 's/"//g' status | while read logfile date
do
    [ -e "$logfile" ] && echo "\"$logfile\" $date"
done >> status.clean
mv status.clean status

test -x /usr/sbin/logrotate || exit 0
/usr/sbin/logrotate /etc/logrotate.conf
```

`/etc/cron.daily/` 目录中的脚本被系统级的 cron 调度执行：

```
25 6 * * *  root  test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
```

Logrotate 的配置文件可放置在 `/etc/logrotate.d` 目录下：

```shell
$ ls -l /etc/logrotate.d
total 0
-rw-r--r-- 1 root root 120 Nov  3  2017 alternatives
-rw-r--r-- 1 root root 126 Jul 18  2017 apport
-rw-r--r-- 1 root root 173 Apr  6  2016 apt
-rw-r--r-- 1 root root 112 Nov  3  2017 dpkg
-rw-r--r-- 1 root root 146 Aug 23  2017 lxd
-rw-r--r-- 1 root root 501 Jan 15  2018 rsyslog
-rw-r--r-- 1 root root 178 Aug  7  2014 ufw
-rw-r--r-- 1 root root 235 Feb 19  2016 unattended-upgrades
```

## 系统安全

### 配置 SSH

修改默认的 SSH 端口。编辑 `/etc/ssh/sshd_config` 文件，将其中的 `Port 22` 改为随意的端口，比如 `Port 47832`。端口的取值范围是 0 – 65535（即 2 的 16 次方），0 到 1024 常用服务的端口（知名端口，常用于系统服务等，例如 HTTP 服务的端口号是 80）。

```
Port 47832
```

禁止使用密码登录，而是使用 RSA 私钥登录。编辑 `/etc/ssh/sshd_config` 文件，修改如下内容：

```
RSAAuthentication yes                    # RSA认证
PubkeyAuthentication yes                 # 开启公钥验证
AuthorizedKeysFile .ssh/authorized_keys  # 验证文件路径
PasswordAuthentication no                # 禁止密码认证
PermitEmptyPasswords no                  # 禁止空密码
```

禁止 root 用户登录。可以新建一个用于来做系统管理，而非直接使用 root 用户，以防止密码被破解。编辑 `/etc/ssh/sshd_config` 文件，修改如下内容：

```
PermitRootLogin no
```

其他一些有用的配置，如保持 ssh 连接（否则长时间不操作则会自动断开），同样编辑 `/etc/ssh/sshd_config` 文件：

```
ClientAliveInterval 60   # 每 60 秒向客户端发送消息并等待其返回相应
ClientAliveCountMax 3    # 如果 3 次客户端没有相应则断开连接
```

或者在客户端配置，在 ~/.ssh/config 文件中加入如下内容：

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

### 访问控制

给重要文件添加不可更改属性，以防止非授权用户随意修改，这样也可以达到限制系统某些功能的作用。如禁止添加用户：

```
chattr +i /etc/passwd
chattr +i /etc/shadow
chattr +i /etc/group
chattr +i /etc/gshadow
chattr +i /etc/services
```

这样设置之后系统便无法再添加或删除用户，除非解除不可更改属性：

```
chattr -i /etc/passwd
chattr -i /etc/shadow
chattr -i /etc/group
chattr -i /etc/gshadow
chattr -i /etc/services
```

必要时也可以限制一些可执行文件的权限，如：

```
chmod 700 /usr/bin       # 恢复 chmod 555 /usr/bin
chmod 700 /bin/ping      # 恢复 chmod 4755 /bin/ping
chmod 700 /usr/bin/vim   # 恢复 chmod 755 /usr/bin/vim
chmod 700 /bin/netstat   # 恢复 chmod 755 /bin/netstat
chmod 700 /usr/bin/tail  # 恢复 chmod 755 /usr/bin/tail
chmod 700 /usr/bin/less  # 恢复 chmod 755 /usr/bin/less
chmod 700 /usr/bin/head  # 恢复 chmod 755 /usr/bin/head
chmod 700 /bin/cat       # 恢复 chmod 755 /bin/cat
chmod 700 /bin/uname     # 恢复 chmod 755 /bin/uname
chmod 500 /bin/ps        # 恢复 chmod 755 /bin/ps
```

使用 `ACL` 可以对系统文件的访问进行更加精细的控制。此外，还有更加高级的访问控制工具 `apparmor` 和 `SELinux` 等，他们可以针对特定应用进行权限控制，如对某个目录/文件的读/写，对网络端口的打开/读/写等等。

### 限制命令历史

一般 Shell 会记录命令操作的历史，在系统中工作时，可能会将一些不安全的操作命令留在历史命令记录中。为了避免这一点，可以将历史命令的记录数量设置得小一点。环境变量 `HISTSIZE` 用于设置记录历史命令的条数。可以编辑 `/etc/profile` 或者相应账户的 `~/.bashrc` 文件，加入如下内容：

```
# 只记录三条历史命令
export HISTSIZE=3
```

### 禁止 ping

编辑 `/etc/rc.d/rc.local` 加入如下内容：

```
echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all
```

其中，参数 0 表示允许, 1 表示禁止。

### 配置资源限制

在 `/etc/security/limits.conf` 文件中配置用户对系统资源的使用，避免恶意程序耗尽系统资源而导致系统崩溃。如：

```
# 限制 mysql 用户打开的文件数
mysql soft nofile 2048
mysql hard nofile 2048

# 限制用户创建的进程数
* soft nproc 50
* hard nproc 50
```

### 配置防火墙

大多数 Linux 采用 `iptables` 作为防火墙工具。iptables 是一个运行在用户空间的应用软件，通过控制 Linux 内核 netfilter 模块，来管理网络数据包的流动与转送。通过配置 iptables 可以对防火墙进行控制。

此外，也可以使用一些第三方工具，如 `Fail2ban`。 Fail2ban 能够监控系统日志，匹配日志中的错误信息（使用正则表达式），然后执行相应的屏蔽动作（支持多种，一般为调用 iptables ）。

## 其他日常维护命令

```
# 显示无线网络信息
iwconfig

# 列举内核 IP 路由表
route -n

# 从 DHCP 服务器上获取IP地址
dhclient

# 从指定的网络接口获取IP 地址
sudo dhclient -r

# 显示区域内无线网络情况
iwlist scan

# 显示网卡和网络设备驱动信息
lshw -C network

# 显示 USB 设备
lsusb

# 显示 USB 相关的硬件上的附加信息
lshw -C usb

# 查看硬盘及分区情况
fdisk -l

# 计算文件的 MD5 消息摘要
md5sum filename.txt

# 查看远程 TCP 端口 8080 是否打开
telnet 192.168.0.100 8080

# 使用 vim 直接编辑远程服务器上的文件
vim scp://root@example.com//home/centos/docker-compose.yml
vim scp://example//home/centos/docker-compose.yml
```

## 参考资料

- [https://zhuanlan.zhihu.com/p/26282070](https://zhuanlan.zhihu.com/p/26282070)
- [https://linuxtools-rst.readthedocs.io/zh_CN/latest/index.html](https://linuxtools-rst.readthedocs.io/zh_CN/latest/index.html)
- [https://www.cnblogs.com/JohnABC/p/4079669.html](https://www.cnblogs.com/JohnABC/p/4079669.html)
