---
layout: post
title: "Linux 后台进程管理利器 Supervisor"
keywords: Supervisor Python
description: "Supervisor 是一个 Python 写的进程管理器。不仅仅可以用来管理进程，还可以用来做开机启动。"
category: Linux
tags: supervisor python
---

[Supervisor](http://supervisord.org/) 是基于 Python 的进程管理工具。其可方便我们启动守护进程，并对进程进行管理（启动、重启和停止进程，异常退出时还能能自动重启），此外还可以管理自定义的开机启动项。

## 安装

由于其基于 Python 开发，任何环境都可以通过 pip 安装：

> pip install supervisor

此外，Ubuntu 系统可用如下方式安装：

> apt-get install supervisor

MacOSX 系统可通过如下方式安装：

> brew install supervisor

安装完成后会有如下几个命令工具

- **supervisord**，Supervisor 的守护进程启动命令，运行时会启动一个守护进程，其负责管理的子进程，且可在所管理的进程出现崩溃时自动重启
- **supervisorctl**，用户与 Supervisor 交互的工具，方便用户管理子进程，可用来 stop、start、restart
- **echo_supervisord_conf**，输出默认配置

安装完成后可以用 echo_supervisord_conf 命令测试是否安装成功。


## 配置

如果是使用 apt 或者 brew 等各平台的软件包管理工具安装的 Supervisor，一般会自动创建默认的配置。如 apt 工具安装后，会创建 /etc/supervisor/supervisord.conf 默认配置；brew 工具安装后，会创建 /usr/local/etc/supervisord.ini 默认配置。但是使用 pip 安装后则可能不会自动创建默认配置，但可以手动创建：

> echo_supervisord_conf > /etc/supervisor/supervisord.conf

通常情况下使用默认配置即可，此外还需要配置 program，即所要启动的子进程的配置。通过查看默认配置文件可知，supervisor 的配置使用的是 INI 格式，子进程的配置在 [program:x] 段。没了便于管理，通常将每个应用的配置写到一个文件中，并将这些文件统一放到一个目录下，如 /etc/supervisor/conf.d。这需要在 supervisord.conf 配置中做如下配置：

```
[include]
files = /etc/supervisor/conf.d/*.conf
```

配置的含义为，包含 `/etc/supervisor/conf.d/` 下所有以 `.conf` 结果的文件。[program:x] 段配置项说明：

```
; 标 * 的为必须项

; * 指定为 program 段，冒号后为进程命令
[program:cat]

; * 进程运行的命令，其中可执行文件可以是绝对路径或相对路径，为相对路径时会在 $PATH 变量中查找
command=/bin/cat

; 指定进程名称，默认为 program 段冒号后指定的名称
; 当 numprocs 为 1 时, process_name=%(program_name)s
; 当 numprocs >=2 时, process_name=%(program_name)s_%(process_num)02d
process_name=%(program_name)s

; 进程数量，supervisor 可对一个 program 启动多个进程
numprocs=1

; 执行目录，当配置该选项时，运行程序前将先 chdir 到指定目录
directory=/tmp

; 掩码:--- -w- -w-, 转换后rwx r-x w-x
umask=022

; 优先级，值越高的程序将最后被启动最先被关闭，默认值 999
priority=999

; 如果是 true, 当 supervisor 启动时, 程序将会自动启动
autostart=true

; * 当检测到程序退出时是否自动重启，其值可以为，false，true，unexpected
autorestart=true

; 程序启动多长时间后才确定为启动成功, 默认 1 秒
startsecs=10

; 启动尝试次数,默认 3 次
startretries=3

; 列出进程预期的退出码
; 如果 autorestart 设置为 unexpected,
; 进程退出码不在配置中，则认为进程意外退出，会被重启
; 在 4.0 版本以前为默认为 0,2，4.0 及之后默认为 0
exitcodes=0

; 停止进程的信号，默认 TERM
; 中断: INT(类似于Ctrl+C)(kill -INT pid), 退出后会将写文件或日志(推荐)
; 终止: TERM(kill -TERM pid)
; 挂起: HUP(kill -HUP pid),注意与Ctrl+Z/kill -stop pid不同
; 从容停止: QUIT(kill -QUIT pid)
; KILL, USR1, USR2，其他见命令(kill -l)
stopsignal=TERM

; 最长结束等待时间, 否则使用 SIGKILL
stopwaitsecs=10

; * 运行进程的用户
user=root

; 结束时结束整个进程组
; 启动的子程序还可能会有子进程（如 Tornado）
; 如果只杀死主进程，子进程不会被清理掉，且还会变成孤儿进程
; 通过这两项配置(改为 true)，可确保所有子进程都能正确停止, 默认是 false
stopasgroup=false
killasgroup=false

; 重定向错误流到标准输出，等价于 2>&1
redirect_stderr=false

; 日志文件相关配置
stdout_logfile=/a/path       ; 标准日志输出文件
stdout_logfile_maxbytes=1MB  ; 标准日志文件大小，默认 50MB
stdout_logfile_backups=10    ; 标准日志文件备份保留的数量，默认 10
stdout_capture_maxbytes=1MB  ; 当 capture 模式时写入到 FIFO 队列最大字节数，默认为 0
stderr_logfile=/a/path
stderr_logfile_maxbytes=1MB
stderr_logfile_backups=10
stderr_capture_maxbytes=1MB

; 环境变量设置
environment=A="1",B="2"

; 服务进程地址
serverurl=AUTO
```

配置示例：

```
[program:notebook]
command=jupyter notebook --notebook-dir=/home/konghy/JupyterNotebook --no-mathjax --no-browser
directory=/home/konghy/JupyterNotebook
stopsignal=QUIT
autostart=true
autorestart=true
startsecs=10
startretries=36
stopasgroup=true
killasgroup=true
stdout_logfile=/home/konghy/JupyterNotebook/.logs/ipython_check.log
stdout_logfile_backups=10
stdout_logfile_maxbytes=10MB
stderr_logfile=/home/konghy/JupyterNotebook/.logs/ipython_check_err.log
stderr_logfile_maxbytes=10MB
stderr_logfile_backups=10
```

## 使用

supervisor 的管理和使用只有两个命令：

- **supervisord:** supervisor 的服务器端部分，用于 supervisor 启动
- **supervisorctl:** 启动supervisor的命令行窗口，在该命令行中可执行 start、stop、status、reload 等操作

启动 supervisor 的服务器会默认启动所有应用：

> supervisord -c /etc/supervisord.conf

### supervisorctl

管理工具 supervisorctl 常用的子命令：

- **help:** 查看子命令帮助
- **status:**  查看程序状态
- **stop:**  关闭程序
- **start:**  启动程序
- **restart:**  重启程序
- **reread:**  读取有更新（增加）的配置文件，不会启动新添加的程序
- **update:**  重新读取所有配置文件并重启配置文件修改过的程序
- **tail:**  查看进程日志

使用 `help` 子命令可以查看所有子命令，以及子命令的帮助信息：

```shell
$ supervisorctl help

default commands (type help <topic>):
=====================================
add    exit      open  reload  restart   start   tail   
avail  fg        pid   remove  shutdown  status  update
clear  maintail  quit  reread  signal    stop    version

$ supervisorctl help status
status <name>		Get status for a single process
status <gname>:*	Get status for all processes in a group
status <name> <name>	Get status for multiple named processes
status			Get all process status info
```

每次修改配置文件后需进入 supervisorctl，执行 reload， 改动部分才能生效，或者可以重启服务：

> service supervisor reload

可以不用进入 supervisorctl 命令行，而直接在其后加上相应命令来完成操作，例如启动应用和查看状态：

```
$ supervisorctl
supervisor> status
supervisor> start app
```

默认的 supervisor 配置文件是放在 /etc/supervisord.conf 目录下，如果使用 supervisorctl 无法找到配置文件，其则无法获取与 supervisord 的连接方式，此时可能会有如下错误：

```
http://localhost:9001 refused connection
```

解决方式是使用 -c 指定配置文件位置：

> supervisorctl -c /path/to/supervisord.conf status

或者将配置文件链接到 /etc 目录下：

> ln -s /path/to/supervisord.conf /etc/

### Web 管理界面

将配置文件中 `[inet_http_server]` 部分打开并做相应配置，然后重启 supervisor 服务即可用浏览器管理所有应用。

```
;[inet_http_server]
;port=127.0.0.1:9001        ; (ip_address:port specifier, *:port for ;all iface)
;username=user              ; (default is no username (open server))
;password=123               ; (default is no password (open server))
```

### 添加开机启动服务

如果用 pip 或者 easy_instal 安装 supervisor，则不会默认将其添加到系统开机启动服务中。但这项工作可以自己来做，如果在 Ubuntu 系统下工作，用 apt 工具来安装则一切工作都会做好。

要添加系统服务首先需要在 `/etc/init.d/` 中创建服务脚本，记得为脚本添加可执行权限 `chmod a+x /etc/init.d/superviser`，然后为将 supervisor 添加到系统服务中：

> update-rc.d supervisor defaults

这样就 supervisor 就可以随系统开机启动，并且可以像系统服务那样来管理。

如果在 MacOSX 系统中使用 brew 安装，则可以使用 brew service 来添加开机启动：

> brew services start supervisor

## 参考资料

- [http://supervisord.org/](http://supervisord.org/)
- [github.com/supervisor](https://github.com/Supervisor/supervisor)
