---
layout: post
title: Linux find命令用法简介
category: linux
tags: find linux
---


Linux 下 find 命令用于在目录结构中查找文件，同时还可以对查找结果进行指定的操作。Find 命令具有很强大的搜索功能，可以遍历整个文件系统。所以 find 命令很耗资源，有时候甚至会耗费很长时间，因此建议把它放在后台执行。Find 命令格式如下所示：

> find pathname -options [-print -exec -ok ...]

介绍一种简单易记的格式：

> find <指定目录> <指定条件> <指定动作>

## 动作参数

- \-exec 命令名称 {} \;  

对符合条件的文件执行所给的 unix 命令，而不询问用户是否需要执行该命令。{}表示命令的参数即为所找到的文件，命令的末尾必须以“ \;”结束，"{}"和"\;"之间必须有一个空格。 

- \-ok 命令名称 {} \;   

对符合条件的文件执行所给的 Linux 命令，与exec不同的是，它会询问用户是否需要执行该命令。 

- \-ls 

详细列出所找到的所有文件。 

- \-fprintf 文件名 

将找到的文件名写入指定文件。 

- \-print 

在标准输出设备上显示查找出的文件名。 

- \-printf 

格式的写法可考有关C语言的书。 

## 命令选项

- \-name   

按照文件名查找文件。

- \-perm

按照文件权限来查找文件。

- \-prune 

使用这一选项可以使find命令不在当前指定的目录中查找，如果同时使用-depth选项，那么-prune将被find命令忽略。

- \-user

按照文件属主来查找文件。

- \-group  

按照文件所属的组来查找文件。

- \-nogroup  

查找无有效所属组的文件，即该文件所属的组在/etc/groups中不存在。

- \-nouser

查找无有效属主的文件，即该文件的属主在/etc/passwd中不存在。

- \-newer file1 ! file2  

查找更改时间比文件file1新但比文件file2旧的文件。

- \-regex pattern

文件名与正则表达式 pattern 匹配。这是对整个路径的匹配，不是搜索文件。例如，要匹配名为 './fubar3' 的文件，可以使用正则表达式 '.*bar.' 或者 '.\*b.*3'，但是不能用`b.*r3'。


- \-type  

查找某一类型的文件，诸如：

<div class="hblock"><pre>
b - 块设备文件。
d - 目录。
c - 字符设备文件。
p - 管道文件。
l - 符号链接文件。
f - 普通文件
</pre></div>

- \-size n：[c] 

查找文件长度为n块的文件，带有c时表示文件长度以字节计。

- \-depth

在查找文件时，首先查找当前目录中的文件，然后再在其子目录中查找。

- \-fstype

查找位于某一类型文件系统中的文件，这些文件系统类型通常可以在配置文件/etc/fstab中找到，该配置文件中包含了本系统中有关文件系统的信息。

- \-mount

在查找文件时不跨越文件系统mount点。

- \-follow

如果find命令遇到符号链接文件，就跟踪至链接所指向的文件。

- \-cpio

对匹配的文件使用cpio命令，将这些文件备份到磁带设备中。

- 时间控制

> -mtime -n +n 

按照文件的更改时间来查找文件， - n表示文件更改时间距现在n天以内，+ n表示文件更改时间距现在n天以前。find命令还有-atime和-ctime 选项，但它们都和-mtime选项一样，按照时间节点来查找文件，但也有一些区别：

<div class="hblock"><pre>
-amin n   查找系统中最后N分钟访问的文件
-atime n  查找系统中最后n*24小时访问的文件
-cmin n   查找系统中最后N分钟被改变文件状态的文件
-ctime n  查找系统中最后n*24小时被改变文件状态的文件
-mmin n   查找系统中最后N分钟被改变文件数据的文件
-mtime n  查找系统中最后n*24小时被改变文件数据的文件
</pre></div>


## 罗辑控制

- 罗辑与

> expr1 -a expr2

> expr1 -and expr2

查找同时满足条件 expr1 和 expr2 的文件，例如在整个系统中查找既没有属主又没有属组的文件：

> find  /  -nogroup –a –nouser

- 罗辑或

> expr1 -o expr2

> expr1 -or expr2

查找满足条件 expr1 或者 expr2 的文件， 例如查找 tmp 目录下以 “.sh” 结尾或者以 “.log” 结尾的文件：

> find /tmp -name "*.sh" -o -name "*.log"

- 罗辑非

> -not expr

查找不满足条件 expr 的文件，例如查找 /tmp 目录下所属用户不是 root 的文件：

> find /tmp -not -user root -exec ls -l {} \;


## 一些典型的应用

#### 递归修改目录下的所有目录权限（只修改目录，不修改文件）

> 1、 find path -type d -exec chmod 744{} \;    (这句的句末有分号)

> 2、 find path -type d | xargs chmod 744

> 3、 chmod 755 \`find -type d\`

#### 递归修改目录下的所有普通文件的权限（只修改文件，不修改目录）

> 1、 find path -type f -exec chmod 644 {} \;

> 2、 find path -type f | xargs chmod 644

> 3、 chmod 755 \`find -type f\`


#### 递归删除所有执行类型的文件

例如，递归删除当前目录下的 `.exe` 普通文件：

> find  . -name  '*.exe' -type  f -print -exec  rm -rf  {} \;

除了用 `-exec` 外，还可以利用管道来实现，例如递归删除当前目录下的 `.deb` 文件：

> find . -name *.deb |xargs rm -rf

#### 统计代码行数

> find . -regex ".*\.\(py\|html\|js\|css\)$" | xargs wc -l

该命令可能在其他平台会失败，那么可以用 grep 来过滤文件：

> wc -l \`find $path | grep ".*\.\(py\|html\|js\|css\)$"\`