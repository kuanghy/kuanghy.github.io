---
layout: post
title: "Linux 中的 netcat 网络工具简介"
keywords: netcat linux 网络工具 文件传输 端口测试 系统后门
category: Linux
tags: linux netcat
---

`netcat` 是 Linux 系统中的网络工具，其通过 TCP 和 UDP 协议在网络中读写数据。如果与其他工具结合，以及加上重定向功能，还可以实现很多不同的功能。所以其以体积小功能灵活而著称，可以用来做很多网络相关的工作。Posix 版本的 netcat 主要有 GNU 版本和 OpenBSD 两种，都可以在 debian/ubuntu 系统下面安装，但 Windows 系统下则只有 GNU 版本的。

`nc` 命令行工具即是 Linux 系统下的 netcat 工具。在 debian/ubuntu 系统下，可以通过如下命令查看其版本：

```
readlink -f $(which nc)
```

大致可以得到以下两种结果：

- **/bin/nc.traditional:** 默认 GNU 基础版本，一般系统自带
- **/bin/nc.openbsd:** OpenBSD 版本，强大很多

不管是 GNU 版本还是 OpenBSD 版本，都有新老的区别。主要区别是，传送文件时 stdin 发生 EOF 了时，老版本会自动断开，而新的 GNU/OpenBSD 还会一直连着。

### 常用参数

`netcat` 使用的基本形式为：

```
nc 参数 目的地址 端口
```

常用的参数说明如下：

```
-k  在当前连接结束后保持继续监听
-l  用作端口监听，而不是发送数据
-n  不使用 DNS 解析
-N  在遇到 EOF 时关闭网络连接
-p  指定源端口
-u  使用 UDP 协议传输
-v  (Verbose)显示更多的详细信息
-w  指定连接超时时间
-z  不发送数据
```

以下列举一些常用的实例：


### 端口测试

`netcat` 可以替代 telnet 工具来测试远程注意端口是否打开，如命令：

```
telnet 192.168.1.8 8080
```

可以用 nc 来代替：

```
nc -vz 192.168.1.8 8080
```

还可以同时指定多个端口或者一个端口范围

```
nc -v -z -w 3 192.168.56.1 22 80 8000 8080

nc -v -z -w 3 192.168.1.8 8080-8088
```

### 连接测试

如果在主机上配置了防火墙，想要测试一下开放的端口是否可以与外界联通，可以用 netcat 监听该端口，然后从外界尝试连接。

在主机上执行：

```
nc -l -p 8080
```

注意，OpenBSD 版本 netcat 用了 -l 以后可以省略 -p 参数，写做：nc -l 8080 ，但在 GNU 版本的 netcat 无法运行，所以推荐写法是都加上 -p 参数，这样两个版本都通用。

在其它主机上可以尝试连接以上主机打开的端口：

```
nc 192.168.1.8 8080
```

如果两台主机能够正常连通的话，就如同打开了一个聊天室，可以相互发送数据并显示。注意，老版本的 netcat 只要 CTRL+D 发送 EOF 就会断开，新版本一律要 CTRL+C 结束，不管是服务端还是客户端只要任意一边断开了，另一端也就结束了，但是 OpenBSD 版本的 netcat 可以加一个 -k 参数让服务端持续工作。

可以通过如下方式给 “聊天室” 消息加上一个简单的前缀：

```
# Server 端
$ mawk -W interactive '$0="Server: "$0' | nc -l 8080
Client: Hello
Hi
Client: My name is Huoty

# Client 端
$ mawk -W interactive '$0="Client: "$0' | nc localhost 8080
Hello
Server: Hi
My name is Huoty
```

这里就有一个使用 netcat 实现的简单聊天室脚本：[Aeres-u99/ncChat](https://github.com/Aeres-u99/ncChat)

### 测试 UDP

`netcat` 工具可以指定使用 UDP 协议传输数据，只需家还是那个 `-u` 参数即可。如下则是使用 UDP 方式监听 8080 端口：

```
nc -u -l -p 8080
```

连接主机时也可以指定 UDP 方式：

```
nc -u 192.168.1.8 8080
```

### 文件传输

如何两台主机间想要传输文件，而又不能使用 scp/szrz 等工具时，则可以用 netcat 代替。在需要接受文件的主机上执行：

```
nc -l -p 8080 > test.txt
```

然后再另一台主机上向其传输文件：

```
nc 192.168.1.8 8080 < test.txt
```

注意，老版本 GNU/OpenBSD 的 netcat 在文件结束（标准输入碰到 EOF），发送文件一端就会关闭连接，而新版本不会。这可能就需要再开个窗口到接收文件的主机上看看接收下来的文件是否已经完整。当传输完成后，再在任意一端 CTRL+C 结束连接。对于新版 OpenBSD 的 netcat 有一个 -N 参数，可以指明 stdin 碰到 EOF 就关闭连接（和老版本一致），如：

```
/bin/nc.openbsd -N 192.168.1.8 8080 < test.txt
```

其实 GNU 版本的 netcat 也有可以加个 -q0 参数，达到和 OpenBSD 版本 -N 的效果：

```
/bin/nc.traditional -q0 192.168.1.8 8080 < test.txt
```

此外，也可以用 pv 命令来查看文件传输的进度。`pv` 命令即 **Pipe Viewer**，意思是通过管道显示数据处理进度的信息。其甚至可以用来代替 cp 命令拷贝文件：

```
$ pv ~/Downloads/test.png > ~/Temp/test.png
 656KiB 0:00:00 [ 267MiB/s] [==================================>] 100%
```

于是，使用 netcat 来做文件传输时，可以使用 pv 来显示传输的进度：

```
# 传输端
pv test.txt | nc 192.168.1.8 8080
```

甚至还可以传输一个目录：

```
# 服务端
tar -zcf - debian-10.0.0-amd64-xfce-CD-1.iso  | pv | nc -l -p 8080

# 客户端
nc 192.168.1.8 8080 | pv | tar -zxf -
```

如何对传输的数据不放心，还可以进行加密，如使用 mcrypt 工具加密数据：

```
# 服务端，使用 mcrypt 工具加密数据，需要输入密码
nc localhost 1567 | mcrypt –flush –bare -F -q -d -m ecb > file.txt

# 客户端，使用 mcrypt 工具解密数据，需要输入密码
mcrypt –flush –bare -F -q -m ecb < file.txt | nc -l 1567
```

### 克隆设备

使用 netcat 可以用来对整个磁盘设备进行复制：

```
# 服务端
dd if=/dev/sda | nc -l 1567

# 客户端
nc -n 182.168.1.8 | dd of=/dev/sda
```

`dd` 命令是一个从磁盘读取原始数据的工具，通过 netcat 服务器重定向它的输出流到其他机器并且写入到磁盘中，它会随着分区表拷贝所有的信息。如果多了分区，可以根据情况更改 sda 为 sda1, sda2 等等。

### HTTP 服务器

用 netcat 可以实现一个简单的 HTTP 服务器，用以测试一些功能。首先，穿件一个简单地的 index.html 文件：

```html
<html>
<head>
<title>Test Page</title>
</head>
<body>
<p>Serving this file using Netcat Basic HTTP server!</p>
</body>
</html>
```

然后运行服务端：

```
while : ; do ( echo -ne "HTTP/1.1 200 OK\r\n" ; cat index.html; ) | nc -l -p 8080 ; done
```

### HTTP 客户端

用 netcat 也可以实现一个简单的 HTTP 服务器，用于请求 HTTP 数据。

```
printf "GET / HTTP/1.0\r\n\r\n" | nc konghy.cn 80
```

### 系统后门

GNU 版本的 netcat 有一个 `-e` 参数，可以在连接建立的时候执行一个程序，并把它的标准输入输出重定向到网络连接上来，于是我们可以在主机上用 `-e` 参数执行 bash 命令：

```
/bin/nc.traditional -l -p 8080 -e /bin/bash -i
```

对于 OpenBSD 版本的 netcat，`-e` 命令被删除了，但可以用管道来完成：

```
mkfifo /tmp/f
cat /tmp/f | /bin/bash 2>&1 | /bin/nc.openbsd -l -p 8080 > /tmp/f
```

这样在客户端主机上执行 `nc 192.168.1.8 8080` 便可以连接上服务端主机的 bash 进行一些操作。这种方式有时候可以用来绕过防火墙的限制。

以上列举的只是 netcat 工具使用示例一小部分。`netcat` 就是在命令行以直接的方式操作 TCP/UDP 进行原始的：监听，连接，数据传输等工作。所以只要有足够的想象力，再搭配管道等其他工具，便可以实现许许多多灵活多样的功能，或者进行各种网络测试。

### 参考资料

- [https://zhuanlan.zhihu.com/p/83959309](https://zhuanlan.zhihu.com/p/83959309)
- [https://www.tecmint.com/netcat-nc-command-examples/](https://www.tecmint.com/netcat-nc-command-examples/)
