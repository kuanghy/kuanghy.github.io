---
layout: post
title: "Gitignore 配置语法"
keywords: git gitignore
description: "Git 的 .gitignore 配置文件用于配置不需要加入到版本管理中的文件"
category: 计算机科学
tags: git gitignore
---

Git 的 `.gitignore` 配置文件用于配置不需要加入到版本管理中的文件，配置好该文件能够为项目的管理带来很大的便利。它的配置与 `.gitconfig` 一样可以分为全局和局部两种。通过修改全局配置 git config 中的 excludesfile 配置向可以指定全局忽略文件。设置方法为：

> $git config --global core.excludesfile ~/.gitignore

这样，修改 `~/.gitignore` 这个文件将作用于所有 git 项目，并且作用于项目实例中的所有被跟踪的目录。比如说我们可以在该文件中添加 *.o 来忽略所有 .o 文件。

局部的配置只需要在项目目录中创建 `.gitignore` 文件即可。

## 语法规范

- 空行或是以#开头的行即注释行将被忽略；
- 以斜杠 “/” 结尾表示目录；
- 以星号 “*” 通配多个字符；
- 以问号 “?” 通配单个字符
- 以方括号 “[]” 包含单个字符的匹配列表；
- 以叹号 “!” 表示不忽略(跟踪)匹配到的文件或目录；
- 可以在前面添加斜杠 “/” 来避免递归,下面的例子中可以很明白的看出来与下一条的区别。

## 配置文件示例

```
# 忽略 .a 文件
*.a

# 但否定忽略 lib.a, 尽管已经在前面忽略了 .a 文件
!lib.a

# 仅在当前目录下忽略 TODO 文件， 但不包括子目录下的 subdir/TODO
/TODO

# 忽略 build/ 文件夹下的所有文件
build/

# 忽略 doc/notes.txt, 不包括 doc/server/arch.txt
doc/*.txt

# 忽略所有的 .pdf 文件 在 doc/ directory 下的
doc/**/*.pdf
```

## 配置文件模板

[Github](https://github.com) 上为开发者提供了各种环境以及各种编程语言的 gitignore 文件配置模板：[https://github.com/github/gitignore](https://github.com/github/gitignore)