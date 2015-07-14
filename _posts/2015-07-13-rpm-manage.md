---
layout: post
title: RPM包的简单管理以及包的制作过程简介
category: linux
tags: linux rpm rpm2cpio cpio
---

## rpm 命令
RPM[1] 是RPM Package Manager（RPM软件包管理器, 愿意为Red Hat Package Manager，现在是一个递归缩写）的缩写，这一文件格式名称虽然打上了RedHat的标志，但是其原始设计理念是开放式的，现在包括OpenLinux、S.u.S.E.以及Turbo Linux等Linux的分发版本都有采用，可以算是公认的行业标准了。

**rpm 命令参数：**
<div class="hblock"><pre>
-e 卸载rpm包
-q 查询已安装的软件信息
-i 安装rpm包
-u 升级rpm包
--replacepkgs 重新安装rpm包
--justdb 升级数据库，不修改文件系统
--percent 在软件包安装时输出百分比
--help 帮助
--version 显示版本信息
-c 显示所有配置文件
-d 显示所有文档文件
-h 显示安装进度
-l 列出软件包中的文件
-a 显示出文件状态
-p 查询/校验一个软件包文件
-v 显示详细的处理信息
--dump 显示基本文件信息
--nomd5 不验证文件的md5支持
--nofiles 不验证软件包中的文件
--nodeps 不验证软件包的依赖关系
--whatrequires 查询/验证需要一个依赖性的软件包
--whatprovides 查询/验证提供一个依赖性的软件包
</pre><div>

**rmp常用命令组合：**
<div class="hblock"><pre>
－ivh：安装并显示安装进度--install--verbose--hash
－Uvh：升级软件包--Update；
－qpl：列出RPM软件包内的文件信息[Query Package list]；
－qpi：列出RPM软件包的描述信息[Query Package install package(s)]；
－qf：查找指定文件属于哪个RPM软件包[Query File]；
－Va：校验所有的RPM软件包，查找丢失的文件[View Lost]；
－e：删除包
</pre></div>

** rmp 软件包解压：**

> rpm2cpio xxx.rpm | cpio -div

RPM包是使用cpio格式打包的，因此需要先转成cpio然后解压。

<br>
## cpio
cpio是用来建立、还原备份档的工具程序，它可以加入、解开cpio或tar备份档内的文件。

**语法：**

> cpio [-0aABckLovV][-C <输入/输出大小>][-F <备份档>][-H <备份格式>][-O <备份档>][--block-size=<区块大小>][--force-local][--help][--quiet][--version] 或 cpio [-bBcdfikmnrsStuvV][-C <输入/输出大小>][-E <范本文件>][-F <备份档>][-H <备份格式>][-I <备份档>][-M <回传信息>][-R <拥有者><:/.><所属群组>][--block-size=<区块大小>][--force-local][--help][--no-absolute-filenames][--no-preserve-owner][--only-verify-crc][--quiet][--sparse][--version][范本样式...] 或 cpio [-0adkiLmpuvV][-R <拥有者><:/.><所属群组>][--help][--no-preserve-owner][--quiet][--sparse][--version][目的目]

**参数：**

<div class="hblock"><pre>
-0或--null 　接受新增列控制字符，通常配合find指令的"-print0"参数使用。
-a或--reset-access-time 　重新设置文件的存取时间。
-A或--append 　附加到已存在的备份档中，且这个备份档必须存放在磁盘上，而不能放置于磁带机里。
-b或--swap 　此参数的效果和同时指定"-sS"参数相同。
-B 　将输入/输出的区块大小改成5120 Bytes。
-c 　使用旧ASCII备份格式。
-C<区块大小>或--io-size=<区块大小> 　设置输入/输出的区块大小，单位是Byte。
-d或--make-directories 　如有需要cpio会自行建立目录。
-E<范本文件>或--pattern-file=<范本文件> 　指定范本文件，其内含有一个或多个范本样式，让cpio解开符合范本条件的文件，格式为每列一个范本样式。
-f或--nonmatching 　让cpio解开所有不符合范本条件的文件。
-F<备份档>或--file=<备份档> 　指定备份档的名称，用来取代标准输入或输出，也能借此通过网络使用另一台主机的保存设备存取备份档。
-H<备份格式> 　指定备份时欲使用的文件格式。
-i或--extract 　执行copy-in模式，还原备份档。
-l<备份档> 　指定备份档的名称，用来取代标准输入，也能借此通过网络使用另一台主机的保存设备读取备份档。
-k 　此参数将忽略不予处理，仅负责解决cpio不同版本间的兼容性问题。
-l或--link 　以硬连接的方式取代复制文件，可在copy-pass模式下运用。
-L或--dereference 　不建立符号连接，直接复制该连接所指向的原始文件。
-m或preserve-modification-time 　不去更换文件的更改时间。
-M<回传信息>或--message=<回传信息> 　设置更换保存媒体的信息。
-n或--numeric-uid-gid 　使用"-tv"参数列出备份档的内容时，若再加上参数"-n"，则会以用户识别码和群组识别码替代拥有者和群组名称列出文件清单。
-o或--create 　执行copy-out模式，建立备份档。
-O<备份档> 　指定备份档的名称，用来取代标准输出，也能借此通过网络　使用另一台主机的保存设备存放备份档。
-p或--pass-through 　执行copy-pass模式，略过备份步骤，直接将文件复制到目的目录。
-r或--rename 　当有文件名称需要更动时，采用互动模式。
-R<拥有者><:/.><所属群组>或
----owner<拥有者><:/.><所属群组> 　在copy-in模式还原备份档，或copy-pass模式复制文件时，可指定这些备份，复制的文件的拥有者与所属群组。
-s或--swap-bytes 　交换每对字节的内容。
-S或--swap-halfwords 　交换每半个字节的内容。
-t或--list 　将输入的内容呈现出来。
-u或--unconditional 　置换所有文件，不论日期时间的新旧与否，皆不予询问而直接覆盖。
-v或--verbose 　详细显示指令的执行过程。
-V或--dot 　执行指令时，在每个文件的执行程序前面加上"."号
--block-size=<区块大小倍乘> 　设置输入/输出的区块大小，假如设置数值为5，则区块大小为2500KB，若设置成10，则区块大小为5120KB，依次类推。
--force-local 　强制将备份档存放在本地主机。
--help 　在线帮助。
--no-absolute-filenames 　使用相对路径建立文件名称。
--no-preserve-owner 　不保留文件的拥有者，谁解开了备份档，那些文件就归谁所有。
-only-verify-crc 　当备份档采用CRC备份格式时，可使用这项参数检查备份档内的每个文件是否正确无误。
--quiet 　不显示复制了多少区块。
--sparse 　倘若一个文件内含大量的连续0字节，则将此文件存成稀疏文件。
--version 　显示版本信息。
</pre></div>

**cpio 的三种操作模式:**

> 在copy-out模式中, cpio 把文件复制到归档包中。它从标准输入获得文件名列表 (一行一个), 把归档包写到标准输出。生成文件名列表的典型方法是使用find 命令; 你可能要在 find 后面用上 -depth选项, 减少因为进入没有访问权限的目录而引起的麻烦。

> 在copy-in模式中, cpio 从归档包里读取文件, 或者列出归档包里的内容。它从标准输入读入归档包。任何不是选项的命令行参数被视为shell的通配符模式串 (globbing pattern); 在归档包中, 只有文件名匹配这些模式串的文件才能复制出来。 和 shell 中不一样, 文件名起始处的 '.' 可以匹配模式串起始处的通配符, 文件名中的 '/' 也可以匹配通配符。 如果没有给出模式串, 那么将读出所有文件。

> 在copy-pass模式中, cpio把文件从一棵目录树复制到另一棵, 它结合了 copy-in 和 copy-out 的操作, 但不使用归档包。 cpio从标准输入读取欲复制的文件名列表; 目标目录作为非选项的命令行参数给出。

cpio支持下列的归档格式: binary, old ASCII, new ASCII, crc, HPUX binary, HPUX old ASCII, old tar, 和 POSIX.1 tar。

**"binary"**格式是过时格式, 因为它保存文件信息的方法无法应用在不同体系的机器间移植。"old ASCII" 格式可以跨平台使用, 但是不能用于超过 65536 个 i 节点的文件系统中。 "new ASCII" 格式可以跨平台使用, 也适用于任意大小的文件系统, 但不是所有版本的 cpio 都支持; 目前只有 GNU 和 System VR4 的 cpio 支持。"crc" 格式 类似于 "new ASCII" 格式, 同时对每个文件计算校验和。cpio 在创建归档包时算出校验和, 解开文件时进行校验。 "HPUX" 格式用于兼容 HP UNIX 的 cpio, 它用了独特的方法来保存设备文件。

**"tar"** 格式用以兼容 tar 程序。它不能归档文件名超过 100 个字符的文件, 也不能归档特殊文件 (块设备或字符设备)。 "POSIX.1 tar" 格式不能归档文件名超过 255 个字符的文件(小于, 除非文件名的最右边有一个 "/")。
缺省情况下, cpio 为了兼容老式的 cpio 程序, 创建 "binary" 格式的归档包。当展开归档包时, cpio 能够自动识别归档包的格式, 而且可以读取在其他字节顺序的机器上创建的归档包。

cpio命令是通过重定向的方式将文件进行打包备份，还原恢复的工具。其备份和还原的操作方法如下所示：

**备份：**
> cpio -covB > [file|device] 将数据备份到文件或设备上

**还原：**

> cpio -icduv < [file|device} 将数据还原到系统中

例如，将/etc下的所有普通文件都备份到/opt/etc.cpio：

> find /etc –type f | cpio –ocvB >/opt/etc.cpio

将示例中的备份包还原到相应的位置，如果有相同文件进行覆盖:

> cpio –icduv < /opt/etc.cpio

<br/>
## 制作简单的 rpm 包
（该内容我尚未整理）