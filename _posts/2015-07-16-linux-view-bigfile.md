---
layout: post
title: Linux 下查看大文件的方法总结
keywords: Linux vim LargeFile glogg joe
category: Linux
tags: linux vim
---

1、用 Linux 自带的工具：`more`、`less`

2、安装vim和vim插件[LargFile](http://www.vim.org/scripts/script.php?script_id=1506)

下载完成之后用vim打开，输入 `“:so %”` 回车进行安装，如果需要设定打开大文件的最小标准，可以在 ~/.vimrc 中添加如下一行：
>	let g:LargeFile=10 （这里表示打开文件的最小标准为10M）

3、安装日志查看工具`glogg`
>	sudo apt-get install glogg

4、安装终端编辑器`joe`
>	sudo apt-get install joe
