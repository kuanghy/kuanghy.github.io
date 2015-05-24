---
layout: post
title: Linux 下 grep 命令常用方法简介
category: Linux
tags: grep
---

#### 1、从单个文件中搜索指定的字符串：

> $ grep "literal-string" filename

该命令会输出字符串在文件中所在行的内容，如果字符串没有空格，则可以不加双引号。filename 可以是多个文件，每个文件用空格隔开。

加 `-i` 参数可以忽略大小写。
加 `-u` 参数搜索一个单词而不是搜索含该单词的字符串 

<br/>
#### 2、显示匹配行附近的多行：

* -A 显示匹配行之后的n行
> $ grep -A n "string" filename

* -B 显示匹配行之前的n行
> $ grep -B n "string" filename

* -C 显示匹配行前后的n行
> $ grep -C n "string" filename

<br/>
#### 3、递归搜索：`-r`
> $ grep -r "this" *

搜索当前目录以及子目录下含“this”的全部文件。

<br/>
#### 4、不匹配搜索：`-v`
> $ grep -v "go" demo_text

显示不含搜索字符串“go”的行。

<br/>
#### 5、统计匹配的行数：`-c`
> $ grep -c "go" filename

统计文件中含“go”字符串的行数。

<br/>
#### 6、只显示含字符串的文件的文件名：`-l`
>  $ grep -l "this" filename

显示含“this”字符串的文件的文件名。

<br/>
#### 7、输出时显示行号：
> grep -n "this" filename

显示含文件中含“this”字符串的行的行号。
