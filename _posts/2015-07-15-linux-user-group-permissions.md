---
layout: post
title: Linux 系统用户、组以及文件权限简介
keywords: linux permission chmod chgrp chonw useradd usermod chattr lsattr setfacl getfacl group
category: Linux
tags: linux
---

## Linux 安全性模型概述

Linux使用User（用户）和Group（组）控制使用者对文件的存取权限，在Linux系统中被创建的用户，可以使用账号和口令登录Linux。Linux系统将一切视为文件，每个文件都有owner,并且owner属于某个Group。

![Linux filesystem](http://static.konghy.cn/xlwb/imgs/ww1/mw690/c3c88275jw1eu3gjg7nb1j20ko0oin0a.jpg)

## 用户

Linux 系统的每个用户都有一个唯一的 User ID，Use r的信息存储在 `/etc/passwd` 中，该文件的格式示例如下：

> root:x:0:0:root:/root:/bin/bash

每一位对应的含义为：

> 用户名:密码:用户ID:组ID:用户全名:主目录:登录shell

在旧的系统中，直接将用户的密码存在第二位。由于 /etc/passwd 文件所有用户都有读权限，出于安全性考虑，后来的系统将密码单独拿出来存放在了 `/etc/shadow` 文件中， 而 /etc/passwd 文件的第二位只用于存储用户是否需要密码，如果用户存在密码，这该位用 ‘x’ 标记，如果是 “!” 或者为空则说明此用户不能用密码登录。

一般情况下只有拥有 HOME 目录和指定 shell 的用户才能登录系统。User 未经授权将禁止读写或执行其他 User 的文件。Linux 的 root 用户拥有至高无上的权限，可以无条件的对系统中的所有文件进行访问、修改和删除。一般不要随便用 root 登录并操作系统。

有两个命令可以用于添加新的用户，即 `useradd` 和 `adduser`。`useradd` 是系统原生命令，而 `adduser` 则是一个 perl 脚本，是对 useradd 的封装，已提供更好的创建用户的接口。`adduser` 命令的参数选项如下：

```
-b, --base-dir BASE_DIR       指定主目录的基目录，一般默认为 /home
-c, --comment COMMENT         用户注释，即用户的详细信息（如姓名，年龄，电话等）
-d, --home-dir HOME_DIR       为用户指定一个 HOME 目录
-D, --defaults                查看或者改变创建用户时的配置，默认配置在 /etc/default/useradd 中
-e, --expiredate EXPIRE_DATE  指定账户失效日期，格式为 YYYY-MM-DD
-f, --inactive INACTIVE       缓冲时间，指定在密码过期后多少天即关闭该帐号
-g, --gid GROUP               为用户指定一个组或者组 ID
-G, --groups GROUPS           将用户添加到其它的组，多个组时用逗号分隔
-k, --skel SKEL_DIR           指定创建 HOME 目录的模板目录，一般默认为 /etc/skel
-K, --key KEY=VALUE           覆盖 /etc/login.defs 中的缺省配置
-l, --no-log-init             不要将此用户添加到最近登录和登录失败数据库
-m, --create-home             创建用户时一并创建用户的主目录
-M, --no-create-home          不要创建用户主目录
-N, --no-user-group           不创建与用户同名的组
-o, --non-unique              允许 UID 与其他用户相同
-p, --password PASSWORD       指定用户密码
-r, --system                  创建为一个系统账户
-s, --shell SHELL             指定用户的登录 Shell
-u, --uid UID                 为用户指定一个 UID
-U, --user-group              创建一个与用户同名的组
`````

`userdel` 命令用于删除用户，常用的选项是-r，它的作用是把用户的主目录一起删除。

`usermod` 命令用于修改账户信息，常用的选项包括 -c, -d, -m, -g, -G, -s, -u 以及 -o 等，这些选项的意义与useradd命令中的选项一样，可以为用户指定新的资源值。

管理用户相关的命令工具汇总：

```
useradd   ：添加用户
adduser   ：添加用户
passwd    ：为用户设置密码
usermod   ：修改用户命令，可以通过 usermod 来修改登录名、用户的家目录等等
pwcov     ：同步用户从 /etc/passwd 到 /etc/shadow
pwck      ：pwck是校验用户配置文件 /etc/passwd 和/etc/shadow 文件内容是否合法或完整
pwunconv  ：是 pwcov 的立逆向操作，是从 /etc/shadow 和 /etc/passwd 创建 /etc/passwd ，然后会删除 /etc/shadow 文件
finger    ：查看用户信息工具
id        ：查看用户的 UID、GID 及所归属的用户组
chfn      ：更改用户信息工具
su        ：用户切换工具
sudo      ：sudo 是通过另一个用户来执行命令（execute a command as another user）
visudo    ：visodo 是编辑 /etc/sudoers 的命令；也可以不用这个命令，直接用vi 来编辑 /etc/sudoers 的效果是一样的
sudoedit  ：和 sudo 功能差不多
```

## 用户群组概述

Linux 系统的每个 User 都属于一个 Group，具有唯一的标识符 GID。Group 信息存储于 /etc/group 中，且可以为 group 创建密码，密码存放在 /etc/gshadow 文件中，但是一般情况下不需要为用户组创建密码。系统默认会为每个 User 关联一个和 User 同名的 Group，每个 User 也至少存在于自己同名的 Group 中，同时 User 也可以加入其他的 Group。在同一个 Group 中的成员可以共享其他成员的文件。增加一个新的用户组使用 groupadd 命令。 其格式如下：

> 用法：groupadd [选项] 组

可以使用的选项有：

```
-f, --force                如果组已经存在则成功退出，并且如果 GID 已经存在则取消 -g
-g, --gid GID              为新组使用 GID
-h, --help                 显示此帮助信息并推出
-K, --key KEY=VALUE        不使用 /etc/login.defs 中的默认值
-o, --non-unique           允许创建有重复 GID 的组
-p, --password PASSWORD    为新组使用此加密过的密码
-r, --system               创建一个系统账户
-R, --root CHROOT_DIR      chroot 到的目录
```

如果要删除一个已有的用户组，使用 groupdel 命令，其格式为：`groupdel 用户组`。修改用户组的属性使用 groupmod 命令，其语法为：`groupmod 选项 用户组`。

如果需要将一个用户添加到某个用户组中，可以 usermod 命令：

> usermod -a -G 用户组 用户名

参数 -a 代表 append， 也就是将用户添加到新用户组中而不必离开原有的其他用户组，不过需要与 -G 选项配合使用， -G 表示指定用户组（注意：如果仅有 -G 没有 -a 参数，则用户原有的组会被覆盖掉，且仅属于 -G 指定的组）。如果想要改变一个用户原有（默认）的用户组，则采用如下命令（这里这里是小写的 -g 参数）：

> usermod -g 用户组 用户名

管理用户组相关的命令工具汇总：

```
groupadd   ：添加用户组
groupdel   ：删除用户组
groupmod   ：修改用户组信息
groups     ：显示用户所属的用户组
grpck      : 验证组文件 /etc/group 和 /etc/gshadow 的完整性
grpconv    ：通过 /etc/group 和 /etc/gshadow 的文件内容来同步或创建 /etc/gshadow ，如果 /etc/gshadow 不存在则创建；
grpunconv  ：通过 /etc/group 和 /etc/gshadow 文件内容来同步或创建 /etc/group ，然后删除 gshadow 文件；
```

## Linux 文件和目录权限解读

### 1、三种基本权限

**（1）r (read) 读**

针对目录，有读（r）权限就代表能对此目录有列表功能，就是可以执行ls命令进行查看，另外还有cp的功能。
针对文件，有读（r）权限就代表能对此文件有阅读功能，可以通过cat等命令查看文件内容。

**（2）w (write) 写**

针对目录，有写（w）权限就代表着在此目录下创建文件和目录，可以通过touch，mkdir等命令创建文件和目录，另外还可以删除此目录下的文件。
针对文件，有写（w）权限就代表着对此文件可以写入新的内容和修改文件内容。

**（3）x (execute) 执行**

针对目录，有执行（x）权限就代表能进入此目录，利用cd等命令进入此目录
针对文件，有执行（x）权限就代表可以执行此文件。

在 Linux 下每一文件或目录的访问权限都有三组，每组用三位表示，分别为文件属主的读、写和执行权限；和属主同组的用户的读、写和执行权限；系统中其他用户的读、写和执行权限。当用`ls -l`命令显示文件或目录的周详信息时，最左边的一列为文件的访问权限。最左边的一位为文件的类型，例如“-”表示普通文件，“d”表示目录等。`ls -l`所列出的信息各栏含义如下：

<div class="hblock"><pre>
第一个栏位，表示文件的属性。
第二个栏位，表示文件个数，即硬链接数。
第三个栏位，表示该文件或目录的拥有者。
第四个栏位，表示所属的组（group）。
第五栏位，表示文件大小。
第六个栏位，表示创建日期。
第七个栏位，表示文件名。
</pre></div>

### 2、特殊位导致权限变化一般有以下两种

- （1）特权位（s）

特权位只针对文件有效，并且只能添加在权限位的前三位和中间三位。一个可执行文件拥有 s 位并且在前三位时，即有 SUID 特殊权限(SETUID)时，当别的用户来执行此文件，使用的权限是此可执行文件属主权限；如果一个可执行文件拥有 s 位并且在中间三位时，即有 SGID 特殊权限(SETGID) 当别的用户来执行此文件，使用的权限是此可执行文件属组的权限。

例如，有普通用户 user1，当 user1 修改密码时，执行 passwd 命令时，passwd 文件权限为：

```
ll /usr/bin/passwd
-rwsr-xr-x 1 root root 54256 May 17  2017 /usr/bin/passwd
```

那么：

```
1. user1 对于 /usr/bin/passwd 这个程序具有 x 权限，表示 user1 能执行 passwd
2. passwd 文件的所有者是 root 
3. user1 执行 passwd 的过程中，会暂时获得 root 的权限
4. /etc/shadow 就可以被  user1 所执行的 passwd 所修改
```

- （2）粘帖位（t）

粘帖位只针对目录有效。有 t 位的目录，任何用户在有权限的情况下是可以创建文件和目录，就算是有权限删除别人的文件或目录也不能删除，同时互相也不能强制保存修改，自己只能删除自己创建的目录，用于一些共享上传的文件服务器场合。粘滞位只能占用后三位权限位。

例如 `/tmp` 目录，它的权限为：

```
$ ll /tmp -d
drwxrwxrwt 8 root root 4096 Apr  6 15:29 /tmp
```

这表示任何人都可以在 /tmp 目录内新增、修改文件，但是只有该文件或目录的创建者与 root 用户能够删除自己的文件或目录。

**注：** s 位和 t 位都是占用 x 位，那么是否有 x 位，主要是看 s 或 t 的大小写来判别：**大写，表示没有执行权限 x 位；小写，表示有执行权限 x 位**。对于不可执行文件来说，SETUID 和 SETGID 没有任何意义。

### 3、隐藏属性权限

Linux 除了 9 个权限外，还有些隐藏属性，使用 lsattr 和 chattr 命令来查看和设置这些隐藏属性。

```
lsattr -- listfile attributes on a Linux second extended file system
chattr -- change file attributeson a Linux second extended file system
```

chattr命令语法格式：

> chattr [-RVf] [-+=aAcCdDeijsStTu] [-v version] files...

参数说明：

```
-R :  递归处理所有的文件及子目录
-V :  详细显示修改内容，并打印输出
- :  失效属性
+ :  激活属性
= :  指定属性
```

属性:

```
A    no atime update, 不允许修改 atime
S    synchronous updates, 实时写入文件，不使用缓冲区
D    synchoronous directory updates, 实时同步到磁盘，针对目录设置
T    top of directory hierarchy, Orlov 块分配器会将该目录视为目录层次结构的顶部
a    append only, 只允许以 append 模式打开文件
c    compressed, 自动压缩文件，读取时自动解压缩
d    no dump, 当 dump 时，具有 d 属性的文件不加入 dump
e    extent format, 在 ext 文件系统中，表示该文件使用区段(extents)映射磁盘上的块
i    immuttbale, 不允许对文件执行删除，改名，增加软硬链接等操作，且无法写入
j    data journalling, 写入记录 journal
s    secure deletion, 可以安全删除，即硬盘空间被全部收回，不留痕迹
t    no tail-merging, 与其它文件合并时末端不会存在局部块碎片
u    undeletable, 与 s 相反，删除时数据还会存在磁盘中，可恢复
```

### 4、chmod 命令

`chmod` 命令是非常重要的，用于改动文件或目录的访问权限。用户用他控制文件或目录的访问权限。该命令有两种用法。一种是包含字母和操作符表达式的文字设定法；另一种是包含数字的数字设定法。

**文字设定法**

> chmod [who] [+ | - | =] [mode] file...

命令中各选项的含义为：
<div class="hblock"><pre>
操作对象who可是下述字母中的任一个或他们的组合：
u 表示 “用户（user）”，即文件或目录的所有者
g 表示 “同组（group）用户”，即和文件属主有相同组 ID 的所有用户
o 表示 “其他（others）用户”
a 表示 “所有（all）用户”。此为系统默认值
</pre></div>

操作符号可以是：

<div class="hblock"><pre>
+ 添加某个权限。
- 取消某个权限。
= 赋予给定权限并取消其他所有权限（如果有的话）。
</pre></div>

设置 mode 所表示的权限可用下述字母的任意组合：

<div class="hblock"><pre>
r 可读
w 可写
x 可执行
</pre></div>

x 只有目标文件对某些用户是可执行的或该目标文件是目录时才追加 x 属性。

s 在文件执行时把进程的属主或组 ID 置为该文件的文件属主。方式 `u+s` 设置文件的用户 ID 位，`g+s` 设置组 ID 位。

文件可以是以空格分开的要改动权限的文件列表，支持通配符。在一个命令行中可给出多个权限方式，其间用逗号隔开。例如：

```
# 使同组和其他用户对文件有读权限
chmod g+r, o+r file
chmod go+r file

# 给文件加上 SETUID，并去掉同组和其他人的读权限
chmod u+s, go-r file

# 给目录加上粘滞位（粘滞位只占用 others 权限位）
chmod o+t directory
```

**数字设定法**

数字表示的属性的含义：0表示没有权限，1表示可执行权限，2表示可写权限，4表示可读权限。通过将三个值相加来得到要设置的权限。所以数字属性的格式应为3 个从0到7的八进制数，其顺序是（u）（g）（o）。例如，如果想让某个文件的属主有“读/写”二种权限，需要把4（可读）+2（可写）=6（读/写）。数字设定法的一般形式为：

> chmod [mode] file...

例如，将一个文件的权限设置为属主可读可写，同组用户可读可写，其他用户可读，则命令为：

> chmod 664 file

### 5、chgrp和chown命令

**chgrp** 命令用于改动文件或目录所属的组。语法格式如下：

> chgrp [-R] group file...

该命令改动指定文件所属的用户组。其中 group 可以是用户组 ID，也可以是 /etc/group 文件中用户组的组名。文件名是以空格分开的要改动属组的文件列表，支持通配符。如果用户不是该文件的属主或终极用户，则不能改动该文件的组。`-R` 参数递归式地改动指定目录及其下的所有子目录和文件的属组。例如改动 /opt/local /book/ 及其子目录下的所有文件的属组为 book：

> chgrp –R book /opt/local/book


**chown** 命令用于更改某个文件或目录的属主和属组。这个命令也非常常用。例如 root 用户把自己的一个文件拷贝给用户 huoty，为了让用户 huoty 能够存取这个文件，root 用户应该把这个文件的属主设为 huoty，否则，用户 huoty 无法存取这个文件。语法格式如下：

> chown [选项] 用户或组 文件

chown 将指定文件的拥有者改为指定的用户或组。用户能是用户名或用户ID。组能是组名或组ID。文件是以空格分开的要改动权限的文件列表，支持通配符。该命令的各选项含义如下：

<div class="hblock"><pre>
-c, --changes          显示更改的部分的信息
-f, --silent, --quiet  忽略错误信息
-R, --recursive        递归处理指定目录以及其子目录下的所有文件
--reference            参考指定文件或目录的用户和组
-h, --no-dereference   只对符号链接的文件本身做修改，而不更改其他任何相关文件
--dereference          作用于符号链接的指向，而不是链接文件本身，与 -h 参数相反
-v, --verbose          显示详细的处理信息
</pre></div>

**使用例示：**

```
# 改变文件的所有者：
chown www-data test
chown www-data: test

# 改变文件的所属组：
chown :www-data test

# 同时改变文件的所有者和所属组：
chown huoty:huoty test
```

## getfacl和setfacl命令

`setfacl` 命令可以用来细分 Linux 下的文件权限。chmod 命令可以把文件权限分为 u,g,o 三个组，而 setfacl 可以对每一个文件或目录设置更精确的文件权限。
即 setfacl 可以更精确的控制权限的分配，如，让某一个用户对某一个文件具有某种权限。这种独立于传统的 u,g,o 的 rwx 权限之外的具体权限设置叫 ACL（Access Control List）。ACL 可以针对单一用户、单一文件或目录来进行 r,w,x 的权限控制，对于需要特殊权限控制的情况是有用的。

```
setfacl [-bkndRLP] { -m|-M|-x|-X ... } file ...
-m, --modify-acl        更改文件的访问控制列表
-M, --modify-file=file  从文件读取访问控制列表条目更改
-x, --remove=acl        根据文件中访问控制列表移除条目
-X, --remove-file=file  从文件读取访问控制列表条目并删除
-b, --remove-all        删除所有扩展访问控制列表条目
-k, --remove-default    移除默认访问控制列表
    --set=acl           设定替换当前的文件访问控制列表
    --set-file=file     从文件中读取访问控制列表条目设定
    --mask              重新计算有效权限掩码
-n, --no-mask           不重新计算有效权限掩码
-d, --default           应用到默认访问控制列表的操作
-R, --recursive         递归操作子目录
-L, --logical           依照系统逻辑，跟随符号链接
-P, --physical          依照自然逻辑，不跟随符号链接
    --restore=file      恢复访问控制列表，和 getfacl -R 作用相反
    --test              测试模式，并不真正修改访问控制列表属性
-v, --version           显示版本并退出
-h, --help              显示本帮助信息
```

示例：

```
# 设置用户 user1 对 test 文件的访问权限
setfacl -m u:user1:r-x test

# 设置用户组 group1 对 test/ 目录的访问权限
setfacl -m g:group1:rwx test/
```

`getfacl` 用于获取文件的 acl 权限控制：

```
getfacl [-aceEsRLPtpndvh] file ...
-a, --access            仅显示文件访问控制列表
-d, --default           仅显示默认的访问控制列表
-c, --omit-header       不显示注释表头
-e, --all-effective     显示所有的有效权限
-E, --no-effective      显示无效权限
-s, --skip-base         跳过只有基条目(base entries)的文件
-R, --recursive         递归显示子目录
-L, --logical           逻辑遍历(跟随符号链接)
-P, --physical          物理遍历(不跟随符号链接)
-t, --tabular           使用制表符分隔的输出格式
-n, --numeric           显示数字的用户/组标识
-p, --absolute-names    不去除路径前的 '/' 符号
-v, --version           显示版本并退出
-h, --help              显示本帮助信息
```

## 使用示例

- （1）管理 opt 目录

创建 readers 组，表示该组中的用户对文件有只读权限

> groupadd readers

创建 writers 组，表示改该组中的用户对文件用写权限

> groupadd writers

让 writers 组的用户对 /opt 目录可读写:

> setfacl -m g:writers:rwx /opt

如果出现以下错误：

```
setfacl: /opt: Operation not supported
```

则可能是挂在的磁盘没有添加 acl 选项，可以修改 /etc/fstab 文件，加入 acl 选项：

```
LABEL=cloudimg-rootfs   /        ext4   defaults,acl    0 0
```

然后重新挂载磁盘。

给 /opt 目录添加 粘帖权限位（t）:

> chmod o+t /opt

把需要的用户添加到 writers 组：

> usermod -a -G writers user1

把需要的用户添加到 readers 组：

> usermod -a -G readers user1
