---
layout: post
title: Linux系统用户、组以及文件权限简介
category: linux
tags: chmod chgrp chonw
---

## Linux 安全性模型概述
Linux使用User（用户）和Group（组）控制使用者对文件的存取权限，在Linux系统中被创建的用户，可以使用账号和口令登录Linux。Linux系统将一切视为文件，每个文件都有owner,并且owner属于某个Group。

![Linux filesystem](http://ww1.sinaimg.cn/mw690/c3c88275jw1eu3gjg7nb1j20ko0oin0a.jpg)

<br/>
## 用户
Linux系统的每个用户都有一个唯一的 User ID，User的信息存储在 /etc/passwd 中，该文件的格式示例如下：

> root:x:0:0:root:/root:/bin/bash

每一位对应的含义为：

> 用户名:密码:用户ID:组ID:用户全名:主目录:登录shell

在旧的系统中，直接将用户的密码存在第二位。由于 /etc/passwd 文件所有用户都有读权限，出于安全性考虑，后来的系统将密码单独拿出来存放在了 /etc/shadow 文件中， 而 /etc/passwd 文件的第二位只用于存储用户是否需要密码，如果用户存在密码，这该位用 ‘x’ 标记，如果是“!”或者为空则说明此用户不能用密码登录
 
一般情况下只有拥有 HOME 目录和指定shell的用户才能登录系统。User未经授权将禁止读写或执行其他User的文件。Linux 的 root 用户拥有至高无上的权限，可以无条件的对系统中的所有文件进行访问、修改和删除。一般不要随便用root登录并操作系统 。

有两个命令可以为Linux操作系统添加新的用户，即 `useradd` 和 `adduser`。在root权限下，useradd只是创建了一个用户名，如 （useradd  +用户名 ），它并没有在/home目录下创建同名文件夹，也没有创建密码，因此利用这个用户登录系统，是登录不了的，为了避免这样的情况出现，可以用 （useradd -m +用户名）的方式创建，它会在/home目录下创建同名文件夹，然后利用（ passwd + 用户名）为指定的用户名设置密码。其参数选项如下：

<div class="hblock"><pre>
-c comment 指定一段注释性描述。
-d 目录 指定用户主目录，如果此目录不存在，则同时使用-m选项，可以创建主目录。
-g 用户组 指定用户所属的用户组。
-G 用户组，用户组 指定用户所属的附加组。
-s Shell文件 指定用户的登录Shell。
-u 用户号 指定用户的用户号，如果同时有-o选项，则可以重复使用其他用户的标识号。

-m, --create-home
	如果用户不存在，则创建用户主目录。骨架目录中的文件和目录(可以使用 -k 选项指定)，将会复制到主目录。默认上，如果没有指定此选项并且  CREATE_HOME 没有启用，不会创建主目录。
</pre></div>

可以直接利用adduser创建新用户（adduser +用户名），这样在/home目录下会自动创建同名文件夹而不需要提供任何参数。

`userdel`命令用于删除用户，常用的选项是-r，它的作用是把用户的主目录一起删除。

`usermod`命令用于修改账户信息，常用的选项包括-c, -d, -m, -g, -G, -s, -u以及-o等，这些选项的意义与useradd命令中的选项一样，可以为用户指定新的资源值。

**管理用户（user）的工具或命令:**
<div class="hblock"><pre>
useradd    注：添加用户
adduser    注：添加用户
passwd     注：为用户设置密码
usermod    注：修改用户命令，可以通过usermod 来修改登录名、用户的家目录等等；
pwcov      注：同步用户从/etc/passwd 到/etc/shadow
pwck       注：pwck是校验用户配置文件/etc/passwd 和/etc/shadow 文件内容是否合法或完整；
pwunconv   注：是pwcov 的立逆向操作，是从/etc/shadow和 /etc/passwd 创建/etc/passwd ，然后会删除 /etc/shadow 文件；
finger     注：查看用户信息工具
id         注：查看用户的UID、GID及所归属的用户组
chfn       注：更改用户信息工具
su         注：用户切换工具
sudo       注：sudo 是通过另一个用户来执行命令（execute a command as another user），su 是用来切换用户，然后通过切换到的用户来完成相应的任务，但sudo 能后面直接执行命令，比如sudo 不需要root 密码就可以执行root 赋与的执行只有root才能执行相应的命令；但得通过visudo 来编辑/etc/sudoers来实现；
visudo     注：visodo 是编辑 /etc/sudoers 的命令；也可以不用这个命令，直接用vi 来编辑 /etc/sudoers 的效果是一样的；
sudoedit   注：和sudo 功能差不多；
</pre></div>

<br/>
## 用户群组概述
Linux系统的每个User都属于一个Group,具有唯一的标识符gid。Group信息存储于/etc/group中，且可以为group创建密码，密码存放在 /etc/gshadow 文件中，但是一般情况下不需要为用户组创建密码。系统会为每个User关联一个和User同名的Group，每个User至少存在于自己同名的Group中，同时User也可以加入其他的Group。在同一个Group中的成员可以共享其他成员的文件。增加一个新的用户组使用groupadd命令。 其格式如下：

> 用法：groupadd [选项] 组

可以使用的选项有：
<div class="hblock"><pre>
  -f, --force		如果组已经存在则成功退出
			并且如果 GID 已经存在则取消 -g
  -g, --gid GID                 为新组使用 GID
  -h, --help                    显示此帮助信息并推出
  -K, --key KEY=VALUE           不使用 /etc/login.defs 中的默认值
  -o, --non-unique              允许创建有重复 GID 的组
  -p, --password PASSWORD       为新组使用此加密过的密码
  -r, --system                  创建一个系统账户
  -R, --root CHROOT_DIR         chroot 到的目录
</pre></div>

如果要删除一个已有的用户组，使用groupdel命令，其格式为：`groupdel 用户组`。修改用户组的属性使用groupmod命令，其语法为：`groupmod 选项 用户组`

如果需要将一个用户添加到某个用户组中，可以采用如下命令：

> usermod -a -G 用户组 用户名

参数 -a 代表 append， 也就是将用户添加到新用户组中而不必离开原有的其他用户组，不过需要与 -G 选项配合使用， -G 表示指定用户组。如果仅仅只改变一个用户原有的用户组，则采用如下命令：

> useradd -g 用户组

**管理用户组（group）的工具或命令:**
<div class="hblock"><pre>
groupadd    注：添加用户组；
groupdel    注：删除用户组；
groupmod    注：修改用户组信息
groups      注：显示用户所属的用户组
grpck
grpconv     注：通过/etc/group和/etc/gshadow 的文件内容来同步或创建/etc/gshadow ，如果/etc/gshadow 不存在则创建；
grpunconv   注：通过/etc/group 和/etc/gshadow 文件内容来同步或创建/etc/group ，然后删除gshadow文件；
</pre></div>

<br/>
## Linux文件和目录权限解读 
#### 1、三种基本权限
（1）r (read) 读

针对目录，有读（r）权限就代表能对此目录有列表功能，就是可以执行ls命令进行查看，另外还有cp的功能。
针对文件，有读（r）权限就代表能对此文件有阅读功能，可以通过cat等命令查看文件内容。

（2）w (write) 写
针对目录，有写（w）权限就代表着在此目录下创建文件和目录，可以通过touch，mkdir等命令创建文件和目录，另外还可以删除此目录下的文件。
针对文件，有写（w）权限就代表着对此文件可以写入新的内容和修改文件内容。

（3）x (execute) 执行
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

#### 2、特殊位导致权限变化一般有以下两种
（1）特权位（s）

> setuid s位在前三位

> setgid s位在中间三位

特权位只针对文件有效，并且只能添加在权限位的前三位和中间三位；一个可执行文件拥有s位并且在前三位时，当别的用户来执行此文件，使用的权限是此可执行文件属主权限；如果一个可执行文件拥有s位并且在中间三位时，当别人的用户来执行此文件，使用的权限是此可执行文件属组的权限

（2）粘帖位（t）
当一个目录共享给其他用户使用并且用户可以上传文件和删除文件，但是只能删除自己的文件，那么就必须用到粘帖位（t），特别用在/tmp目录。只针对目录有效。有t位的目录，任何用户在有权限的情况下是可以创建文件和目录，就算是有权限删除别人的文件或目录也不能删除，同时互相也不能强制保存修改，自己只能删除自己创建的目录，用于一些共享上传的文件服务器场合

**注：**s位和t位都是占用x位，那么是否有x位，主要是看s或t的大小写来判别：**大写，表示没有执行权限x位；小写，表示有执行权限x位**

#### 3、隐藏属性权限
linux除了9个权限外，还有些隐藏属性， 使用lsattr和chattr命令来查看和设置这些隐藏属性。
<div class="hblock"><pre>
lsattr --listfile attributes on a Linux second extended file system
chattr --change file attributeson a Linux second extended file system
</pre></div>

chattr命令语法格式：

> chattr [-RVf] [-+=aAcCdDeijsStTu] [-v version] files...

参数说明：
<div class="hblock"><pre>
－R：递归处理所有的文件及子目录。
－V：详细显示修改内容，并打印输出。
－：失效属性。
＋：激活属性。
 = ：指定属性。
</pre></div>

属性:
<div class="hblock"><pre>
 A    no atime update 不允许修改atime
 D    synchoronous directory updates
 S     synchronous updates 必须sync
 T     top of directory hierarchy
 a     append only只允许append
 c     compressed自动压缩，读取时自动解压缩，哇！好高级！
 d     no dump当dump时，具有d属性的文件不加入dump
 e     extent format
 i       immuttbale 可厉害了，让一个文件不能删除，改名，增加软硬链接，无法写入
 j       data journalling ext3时会将写入记录 journal
 s     secure deletion 可以安全删除
 t       no tail-merging
 u      undeletable 与s相反，删除时数据还会存在磁盘中
</pre></div>

#### 4、chmod 命令
 chmod命令是非常重要的，用于改动文件或目录的访问权限。用户用他控制文件或目录的访问权限。该命令有两种用法。一种是包含字母和操作符表达式的文字设定法；另一种是包含数字的数字设定法。

**文字设定法**
> chmod [who] [+ | - | =] [mode] file...

命令中各选项的含义为：
<div class="hblock"><pre>
操作对象who可是下述字母中的任一个或他们的组合：
u 表示“用户（user）”，即文件或目录的所有者。
g 表示“同组（group）用户”，即和文件属主有相同组ID的所有用户。
o 表示“其他（others）用户”。
a 表示“所有（all）用户”。他是系统默认值。
</pre></div>

操作符号可以是：
<div class="hblock"><pre>
+ 添加某个权限。
- 取消某个权限。
= 赋予给定权限并取消其他所有权限（如果有的话）。
</pre></div>

设置mode所表示的权限可用下述字母的任意组合：
<div class="hblock"><pre>
r 可读。
w 可写。
x 可执行。
</pre></div>

x 只有目标文件对某些用户是可执行的或该目标文件是目录时才追加x 属性。

s 在文件执行时把进程的属主或组ID置为该文件的文件属主。方式“u+s”设置文件的用户ID位，“g+s”设置组ID位。

<div class="hblock"><pre>
t 保存程式的文本到交换设备上。
u 和文件属主拥有相同的权限。
g 和和文件属主同组的用户拥有相同的权限。
o 和其他用户拥有相同的权限。
</pre></div>

文件可以是以空格分开的要改动权限的文件列表，支持通配符。在一个命令行中可给出多个权限方式，其间用逗号隔开。例如：

> chmod g+r，o+r example

这里的意思是使同组和其他用户对文件example 有读权限。

**数字设定法**

数字表示的属性的含义：0表示没有权限，1表示可执行权限，2表示可写权限，4表示可读权限。通过将三个值相加来得到要设置的权限。所以数字属性的格式应为3 个从0到7的八进制数，其顺序是（u）（g）（o）。例如，如果想让某个文件的属主有“读/写”二种权限，需要把4（可读）+2（可写）=6（读/写）。数字设定法的一般形式为：

> chmod [mode] file...

例如，将一个文件的权限设置为属主可读可写，同组用户可读可写，其他用户可读，则命令为：

> chmod 664 file


#### 5、chgrp和chown命令
**chgrp**命令用于改动文件或目录所属的组。语法格式如下：

> chgrp [-R] group file...

该命令改动指定指定文件所属的用户组。其中group能是用户组ID，也能是/etc/group文件中用户组的组名。文件名是以空格分开的要改动属组的文件列表，支持通配符。如果用户不是该文件的属主或终极用户，则不能改动该文件的组。`-R` 参数递归式地改动指定目录及其下的所有子目录和文件的属组。例如改动 /opt/local /book/ 及其子目录下的所有文件的属组为book：

> chgrp –R book /opt/local /book


**chown**命令用于更改某个文件或目录的属主和属组。这个命令也非常常用。例如root用户把自己的一个文件拷贝给用户huoty，为了让用户huoty能够存取这个文件，root用户应该把这个文件的属主设为huoty，否则，用户huoty无法存取这个文件。语法格式如下：

> chown [选项] 用户或组 文件

chown将指定文件的拥有者改为指定的用户或组。用户能是用户名或用户ID。组能是组名或组ID。文件是以空格分开的要改动权限的文件列表，支持通配符。该命令的各选项含义如下：
<div class="hblock"><pre>
--c 显示更改的部分的信息
-f 忽略错误信息
-h 修复符号链接
-R 处理指定目录以及其子目录下的所有文件
-v 显示详细的处理信息
-deference 作用于符号链接的指向，而不是链接文件本身
</pre></div>

**使用例示：**

改变文件的所有者：

> chown www-data: test

改变文件的所属组：

> chown :www-data test

同时改变文件的所有者和所属组：

> chown huoty:huoty test
