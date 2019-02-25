---
layout: post
title: "DOS 命令使用笔记"
keywords: DOS windows cmd 命令行
description: "DOS 命令是与操作系统交互的人机交互指令"
category: 计算机科学
tags: windows
---

**DOS** 是 `Disk Operating System` 的缩写，即“磁盘操作系统”。DOS 命令是与操作系统交互的人机交互指令，用于操作文件、目录、网络、进程等，以便管理系统。在 DOS 系统中，大小写不敏感。

## 常用命令概览

**文件夹管理**

- cd 显示当前目录名或改变当前目录
- md/mkdir 创建目录
- rd/rmdir 删除一个目录
- dir 显示目录中的文件和子目录列表
- tree 以图形显示驱动器或路径的文件夹结构
- path 为可执行文件显示或设置一个搜索路径
- xcopy 复制文件和目录树

**文件管理**

- type 显示文本文件的内容
- copy 将一份或多份文件复制到另一个位置
- del 删除一个或数个文件
- move 移动文件并重命名文件和目录。(Windows XP Home Edition 中没有)
- ren/rename 重命名文件
- replace 替换文件
- attrib 显示或更改文件属性
- find 搜索字符串
- findstr 搜索字符串，是 find 的扩展，功能更强大
- fc 比较两个文件或两个文件集并显示它们之间的不同

**网络命令**

- ping 进行网络连接测试、名称解析
- ftp 文件传输
- net 网络命令集及用户管理
- telnet 远程登陆
- ipconfig 显示、修改 TCP/IP 设置
- msg 给用户发送消息
- arp 显示、修改局域网的 IP 地址 - 物理地址映射列表
- netstat 进程网络使用情况统计

**系统管理**

- at 安排在特定日期和时间运行命令和程序
- shutdown 立即或定时关机或重启
- tskill 结束进程
- taskkill 结束进程(比 tskill 高级，但 WinXPHome 版中无该命令)
- tasklist 显示进程列表(Windows XP Home Edition 中没有)
- sc 系统服务设置与控制
- reg 注册表控制台工具
- powercfg 控制系统上的电源设置

**其他**

- cls 清除屏幕
- echo 显示信息，或将命令回显打开或关上
- more 逐屏显示输出
- set 显示、设置或删除环境变量
- start 启动另一个窗口运行指定的程序或命令
- systeminfo 显示本地或远程机器(包括服务包级别)的操作系统配置的信息
- exit 退出命令解释器或当前批处理脚本
- help 提供命令帮助信息

【NOTE】：DOS 命令查看帮助使用 `<command> /?` 的形式，如：dir /?

## 使用示例

### 目录跳转

我们通常需要在不同的目录间切换以完成工作，切换目录使用 `cd` 命令，即 change directory 的缩写，cd 不加参数时显示当前目录位置，如果要切换驱动器则需加上 /d 命令，或者使用驱动器号加冒号，如 `D:` 先切换到相应驱动器再做目录跳转。

```
C:\Users\Huoty>cd
C:\Users\Huoty

C:\Users\Huoty>cd "C:\Program Files"

C:\Program Files>cd /d D:/

D:\>C:

C:\Program Files>
```

### 字符串查找

`find` 和 `findstr` 命令用于从文件或者管道中搜索字符串:

```
FINDSTR [/B] [/E] [/L] [/R] [/S] [/I] [/X] [/V] [/N] [/M] [/O] [/P] [/F:file]
        [/C:string] [/G:file] [/D:dir list] [/A:color attributes] [/OFF[LINE]]
        strings [[drive:][path]filename[ ...]]

  /B         在一行的开始配对模式。
  /E         在一行的结尾配对模式。
  /L         按字使用搜索字符串。
  /R         将搜索字符串作为一般表达式使用。
  /S         在当前目录和所有子目录中搜索匹配文件。
  /I         指定搜索不分大小写。
  /X         打印完全匹配的行。
  /V         只打印不包含匹配的行。
  /N         在匹配的每行前打印行数。
  /M         如果文件含有匹配项，只打印其文件名。
  /O         在每个匹配行前打印字符偏移量。
  /P         忽略有不可打印字符的文件。  
  /OFF[LINE] 不跳过带有脱机属性集的文件。
  /A:attr    指定有十六进位数字的颜色属性。请见 "color /?"
  /F:file    从指定文件读文件列表 (/ 代表控制台)。
  /C:string  使用指定字符串作为文字搜索字符串。
  /G:file    从指定的文件获得搜索字符串。 (/ 代表控制台)。
  /D:dir     查找以分号为分隔符的目录列表
  strings    要查找的文字。
  [drive:][path]filename
             指定要查找的文件。

除非参数有 /C 前缀，请使用空格隔开搜索字符串。
例如: 'FINDSTR "hello there" x.y' 在文件 x.y 中寻找 "hello" 或
"there"。'FINDSTR /C:"hello there" x.y' 文件 x.y  寻找
"hello there"。

一般表达式的快速参考:
  .        通配符: 任何字符
  *        重复: 以前字符或类出现零或零以上次数
  ^        行位置: 行的开始
  $        行位置: 行的终点
  [class]  字符类: 任何在字符集中的字符
  [^class] 补字符类: 任何不在字符集中的字符
  [x-y]    范围: 在指定范围内的任何字符
  \x       Escape: 元字符 x 的文字用法
  \<xyz    字位置: 字的开始
  xyz\>    字位置: 字的结束
```

### 查看端口占用

Windows 环境下可以用 `netstat` 命令查看进程的网络统计情况，使用 `netstat –ano` 可以显示系统中打开的端口和对应的进程号。

- **netstat -a**：本选项显示一个所有的有效连接信息列表，包括已建立的连接（ESTABLISHED ），也包括监听连接请求（LISTENING ）的那些连接，断开连接（CLOSE_WAIT ）或者处于联机等待状态（TIME_WAIT ）等
- **netstat -n**：显示所有已建立的有效连接
- **netstat -o**：显示与每个连接相关的所属进程 ID

可以使用 findstr 来查找端口号被什么进程占用：

> netstat -ano | findstr "<端口号>"

然后再通过进程号查找相应进程

> tasklist | findstr "<PID号>"

### 设置环境变量

设置环境变量用 `set` 命令，该命令在没有任何参数时显示当前所有环境变量，如果仅指定变量名则显示该环境变量的值。

```
# 显示当前所有环境变量
set

# 查看某个环境变量，如PATH
set PATH

# 添加环境变量，如 xxx=aa
set xxx=aa

# 将环境变量（如 xxx）的值置为空
set xxx=

# 在某个环境变量（如 PATH）后添加新的值（如 d:\xxx）
set PATH=%PATH%;d:\xxx
```

【NOTE】：以命令行方式对环境变量的操作只对当前窗口的应用有效

## 参考资料

- [CMD命令速查手册](https://www.jb51.net/help/cmd.htm)
- [https://wsgzao.github.io/post/windows-batch/](https://wsgzao.github.io/post/windows-batch/)
