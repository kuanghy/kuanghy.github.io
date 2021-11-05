---
layout: post
title: "DNS 域名解析系统概述"
keywords: DNS 域名 域名解析 根域名服务器 CNAME /etc/hosts resolv.conf dig nslookup whois
description: "DNS是域名系统的简称，由域名解析器和域名服务器组成的，域名服务器保存域名与IP的对应关系"
category: 计算机科学
tags: DNS
---

**DNS** 是计算机域名系统 `Domain Name System` 或 `Domain Name Service` 的缩写，它由域名解析器和域名服务器组成的。域名服务器是指保存有该网络中所有主机的域名和对应 IP 地址，并具有将域名转换为 IP 地址功能的服务器。**域名解析** 就是将域名映射为 IP 地址的过程。

那么，**为什么需要 DNS 解析呢？** 因为目前的大部分网络通信都是基于网络层 IP 协议的，所以要向与远程的机器通信，必须知道其 IP 地址。域名的出现是为了解决 IP 地址难以记忆的问题，而实际使用域名时，还是需要将域名转化为 IP 地址。

DNS 系统采用树状结构进行组织，以 blog.konghy.cn 为例，cn 为 **顶级域名**，konghy 为 **二级域名**，blog 为 **三级域名**。而通常说域名的时候都把名字带上，如说 konghy.cn 是顶级域名，blog.konghy.cn 是二级域名，xxx.blog.konghy.cn 则是三级域名。其实真正的网址在配置中应该是 blog.konghy.cn.（最后有一点），一般在使用时省略了最后的点，而这也已经成为了一种习惯，最后的这个点就是 **根域**。

## DNS 服务器

DNS 根据域名的层级，进行分级查询。所谓分级查询，就是从根域名开始依次查询，直到查到最终的IP地址，过程大致为：

- 从 根域名服务器 查询，若有记录则直接返回，否则返回其管辖范围内 顶级域名（如 .cn 等）服务器 的 NS 记录和 A 记录（IP地址）
- 从 顶级域名服务器 查询，若有记录则直接返回，否则返回其管辖范围内 权威域名服务器 的 NS 记录和 A 记录（IP地址）
- 从 权威域名服务器 查询出主机名的 IP 地址并返回

**根域名服务器** 是域名解析体系的核心，如果要查询域名，均需要从根域名服务器开始查询。全球 IPv4 的根域名服务器只有 13 台，1 个为主根服务器，放置在美国。其余 12 个均为辅根服务器，其中 9 个放置在美国，欧洲 2 个，位于英国和瑞典，亚洲 1 个，位于日本。因为域名解析查询过程采用 UDP 协议，其受限于 UDP 报文 MTU < 512 的影响，MTU 即最大传输单元（Maximum Transmission Unit），故只能架设 13 台。实际上到目前为止，所谓的只有 13 台根域名服务器，只是逻辑上的，分别编号从 a 到 m，而物理上的根域名服务器已远不止 13 台。根域名服务器网站：[https://root-servers.org](https://root-servers.org)。

根域名服务器负责返回顶级域 (如 .com 等) 的权威域名服务器地址。在拿到 **顶级 DNS 服务器** 地址后，再向顶级域名服务器发起查询请求，其返回一级域 (如 example.com) 的权威域名服务器地址

**权威 DNS 服务器** 是最终决定域名解析结果的服务器。域名拥有者可以在域名提供商那里配置、变更、删除具体域名的对应解析结果信息，域名提供商会将其同步至权威 DNS 服务器。此外，还有一种 **递归 DNS 服务器**。

**递归 DNS** 又称为 **Local DNS**，其没有域名解析结果的决定权，主要是代理用户向权威 DNS 获取域名解析结果。递归 DNS 上可能会有缓存模块，当目标域名存在缓存解析结果并且 TTL 未过期时（每个域名都有 TTL 时间，即有效生存时间，若域名解析结果缓存的时间超过 TTL，需要重新向权威 DNS 服务器获取解析结果），递归 DNS 会返回缓存结果，否则，递归 DNS 会一级一级地查询各个层级域名的权威 DNS 直至获取最终完整域名的解析结果。

**公共 DNS** 是递归 DNS 的一种特例，它是一种开放的递归 DNS 服务，而传统的递归 DNS 信息一般由运营商分发给用户，或者用户自己搭建。一个比较典型的公共 DNS 即 Google 的 `8.8.8.8`。可以通过自己搭建递归 DNS 服务器并在操作系统中修改 DNS 服务器配置来优化域名的解析流程。

## DNS 解析流程

在此以在浏览器中输入域名访问网站为例，说明 DNS 的解析流程。其域名会经过如下几个查询过程：

- **浏览器缓存**

通过浏览器访问某域名时，浏览器首先会在自己的缓存中查找是否有该域名对应的 IP 地址（若曾经访问过该域名且没有清空缓存便会存在）；

- **系统缓存**

当浏览器缓存中无域名对应 IP 则会自动检查用户计算机系统 hosts 文件中是否有该域名对应的 IP；

- **路由器缓存**

当浏览器及系统缓存中均无域名对应 IP 则进入路由器缓存中检查，以上均是用于本地机器的 DNS 缓存；

- **ISP（互联网服务提供商）DNS 缓存**

当在本地机器查询不到域名对应 IP 地址时，则将进入 ISP DNS 缓存中进行查询。比如你用的是电信的网络，则会进入电信的 DNS 缓存服务器中进行查找；也可以通过修改本机的 DNS 配置来绕过 ISP 的 DNS 缓存；

- **根域名服务器**

当以上均未完成查询，则进入根服务器进行查询。根域名收到请求后会查看区域文件记录，若无则将其管辖范围内顶级域名（如.com）服务器 IP 告诉 Local DNS 服务器，Local DNS 服务器再向顶级域名服务器其查询；

- **顶级域名服务器**

顶级域名服务器收到请求后查看区域文件记录，若无则将其管辖范围内主域名服务器的 IP 地址告诉 Local DNS 服务器，以继续后续的查询；

- **主域名服务器**

主域名服务器接受到请求后查询自己的缓存，如果没有则进入下一级域名服务器进行查找，并重复该步骤直至找到正确纪录；

- **保存结果至缓存**

本地域名服务器把返回的结果保存到缓存，以备下一次使用，同时将该结果返回，于是并可通过这个 IP 地址与 web 服务器建立通信连接。

如果抛开网络中各节点对 DNS 的缓存，那么 DNS 的查询过程一般只包含三个步骤：

- 从 根域名服务器 查到 顶级域名服务器 的 NS 记录和 A 记录（IP地址）
- 从 顶级域名服务器 查到 次级（二级）域名服务器 的 NS 记录和 A 记录（IP地址）
- 从 次级域名服务器 查出 主机名 的IP地址

## 域名记录类型

域名解析记录主要分为 A 记录、CNAME 记录、MX 记录、NS 记录和 TXT 记录等几种类型：

- **A 记录**

A 代表 `Address`，用来指定域名对应的 IP 地址，如将 blog.konghy.cn 指定到 114.192.210.xxx，将 www.baidu.com 指定到 220.181.38.148 等。A 记录可以将多个域名解析到一个 IP 地址，但是不能将一个域名解析到多个 IP 地址。

- **MX 记录**

MX 即 `Mail Exchange`，就是可以将某个域名下的邮件服务器指向自己的 Mail Server，如 baidu.com 域名的 A 记录 IP 地址是 115.238.25.xxx，如果将 MX 记录设置为 115.238.25.xxx，即 xxx@taobao.com 的邮件路由，DNS 会将邮件发送到 115.238.25.xxx 所在的服务器，而正常通过 Web 请求的话仍然解析到A记录的 IP 地址。

- **CNAME 记录**

CNAME 即 `Canonical Name`，也称别名解析。所谓别名解析就是可以为一个域名设置一个或者多个别名，如将 aaa.com 解析到 bbb.net、将 ccc.com 也解析到 bbb.net，其中 bbb.net 分别是 aaa.com 和 ccc.com 的别名。

- **NS 记录**

为某个域名指定 DNS 解析服务器，也就是这个域名由指定的 IP 地址的 DNS 服务器取解析。

- **TXT 记录**

为某个主机名或域名设置说明，如可以为 ddd.net 设置 TXT 记录为 "这是XXX的博客" 这样的说明。

## DNS 配置

Linux 系统中有关 DNS 的配置文件有如下三个：

- **/etc/hosts：** 记录 hostname 对应的 IP 地址
- **/etc/resolv.conf：** 设置 DNS 服务器的 IP 地址
- **/etc/host.conf：** 指定域名解析的顺序（是先从本地的 hosts 文件解析还是从 DNS 解析）

`/etc/hosts` 是在早期的计算中出现的，仅仅在 hosts 文件中保存 IP 地址与主机名的对应关系即可满足需要，随着网络的逐渐发展，hosts 文件已不再能满足需求，于是并出现了分布式的 DNS 解析服务，但是 /etc/hosts 的形式被保留了下来。

`/etc/resolv.conf` 是客户端本地域名解析器的配置文件，C 标准库中包含一系列函数(如：gethostbyname, getaddrinfo 等)用于向 DNS 服务器查询域名的解析地址。其用于设置 DNS 服务器的 IP 地址，以及主机的域名搜索顺序等。配置示例：

```
# 定义本地域名
domain  konghy.cn

# 定义域名的搜索列表
search  konghy.cn joinquant.com

# 指定域名解析服务器地址（最多三个）
nameserver 10.143.22.116
nameserver 10.143.22.118

# 其他选项
options timeout:2 attempts:3 rotate single-request-reopen
```

配置文件共包含如下几个配置项：

- **nameserver：** 指定域名解析服务器。解析器会按照文件中出现的顺序来查询，且只有当第一个 nameserver 没有响应时才使用下面的 nameserver 继续查询，一般不要指定超过 3 个服务器。
- **domain：** 声明主机的域名。很多程序用到它，如邮件系统；当为没有域名的主机进行 DNS 查询时，也要用到。如果没有域名，主机名将被使用，删除所有在第一个点(.)前面的内容。
- **search：** 指定域名的搜索列表。当要查询没有域名的主机，主机将在 search 声明的域中依次查找。domain 和 search 不能共存，当 search 存在时其会被优先使用。如当 `ping new` 时，如果 search 配置为 *search google.com baidu.com*，那么会依次尝试解析 new.google.com, new.baidu.com。 目前, 查找列表限制在 6 个域名内, 总共不超过 256 个字符。
- **sortlist：** 允许将得到域名结果进行特定的排序。它的参数为网络/掩码对，允许任意的排列顺序。
- **options：** 其他选项设置, 允许修改某些解析器的内部变量。

`/etc/host.conf` 文件指定如何解析主机名。配置示例：

```
# 指域名查询顺序，此为先 /etc/hosts 中查找，然后再使用 DNS 解析器解析
order hosts,bind

# 允许一个域名对应多个 IP 地址
multi on
```

当 `multi on` 开启时，hosts 文件可以有如下的配置：

```
104.168.215.18 blog.kongny.cn
104.168.215.20 blog.kongny.cn
104.168.215.21 blog.kongny.cn
```

## DNS 查询指令

- **dig**

```
dig [@server] [-b address] [-c class] [-f filename] [-k filename] [-m] [-p port#]
    [-q name] [-t type] [-v] [-x addr] [-y [hmac:]name:key] [-4] [-6] [name]
    [type] [class] [queryopt...]

dig [global-queryopt...] [query...]
```

`dig` (domain information groper) 域名查询工具，其执行 DNS 搜索，显示从接受请求的域名服务器返回的答复。

```
$ dig blog.konghy.cn

; <<>> DiG 9.10.6 <<>> blog.konghy.cn
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 45614
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;blog.konghy.cn.			IN	A

;; ANSWER SECTION:
blog.konghy.cn.		599	IN	A	104.168.215.21

;; Query time: 89 msec
;; SERVER: 192.168.1.1#53(192.168.1.1)
;; WHEN: Tue Aug 06 11:26:19 CST 2019
;; MSG SIZE  rcvd: 59
```

dig 命令的输出信息大致分为 5 个部分：

- 第一部分显示为 dig 命令的版本和输入的参数
- 第二部分显示服务返回的一些技术详情，其中如果 status 值为 NOERROR 则说明本次查询成功结束
- 第三部分的 "QUESTION SECTION" 显示要查询的域名
- 第四部分的 "ANSWER SECTION" 是查询到的结果
- 第五部分则是本次查询的一些统计信息，如所花时间，查询的 DNS 服务器，查询的时间等

一些使用示例：

```
# 查询根的 NS 记录
dig
dig -t NS .

# 查询 A 记录并返回简短信息
dig A +noall +answer konghy.cn
dig -t A +noall +answer konghy.cn

# 查询 NS 记录（只有一级域名有 NS 记录）
dig -t NS konghy.cn

# 查询指定记录
dig -t MX mail.konghy.cn
dig blog.konghy.cn AAAA

# 查询所有的记录
dig konghy.cn ANY

# 从文件中读取域名并查询
dig -f domain.txt

# 不使用 Local DNS，而是直接从跟服务器迭代查询，以跟踪域名解析的整个过程
dig +trace blog.konghy.cn

# 仅提供简短的答复
dig +short blog.konghy.cn

# 使用 TCP 方式查询
dig +tcp konghy.cn

# 指定 DNS 服务器
dig @8.8.8.8 blog.konghy.cn

# 指定 DNS 服务器以及端口(默认使用 53 端口)
dig @8.8.8.8 -p 5300 blog.konghy.com

# 设置超时时间和超时次数
dig @8.8.8.8 +time=10 +tries=6 blog.konghy.cn

# 反向查询
dig -x 39.156.69.79
```

- **nslookup**

```
nslookup [-option] [name | -] [server]
```

`nslookup` 支持 交互模式 和 非交互模式 两种，直接输入命令不带任何参数时进入交互模式。

```
$ nslookup blog.konghy.cn
Server:		192.168.1.1
Address:	192.168.1.1#53

Non-authoritative answer:
Name:	blog.konghy.cn
Address: 104.168.215.21
```

- **host**

```
host [-aCdlnrsTwv] [-c class] [-N ndots] [-R number] [-t type] [-W wait]
     [-m flag] [-4] [-6] [-v] [-V]
     {name}
     [server]
```

`host` 也是一个域名 DNS 查询工具。常用参数说明：

```
-a：显示详细的DNS信息；
-c：指定查询类型，默认值为 IN；
-C：查询指定主机的完整的 SOA 记录；
-r：在查询域名时，不使用递归的查询方式；
-t：指定查询的域名信息类型；
-v：显示指令执行的详细信息；
-w：如果域名服务器没有给出应答信息，则总是等待，直到域名服务器给出应答；
-W：指定域名查询的最长时间，如果在指定时间内域名服务器没有给出应答信息，则退出指令；
-4：使用IPv4；
-6：使用IPv6.
```

- **whois**

`whois` 不是一个 DNS 查询工具，且系统不自带该工具，需要手动安装。其用于查询域名的注册信息，包括持有人，管理资料以及技术联络资料, 也包括该域名的域名服务器等等。

## 清除本地 DNS 缓存

在部分 Linux 发行版中，默认安装了 `nscd` 程序。 NSCD(Name Service Cache Daemon)是服务缓存守护进程，它为 NIS 和 LDAP 等服务提供更快的验证。 NSCD 会缓存三种服务 passwd, group, hosts，所以它会记录三个库，分别对应源 /etc/passwd, /etc/hosts 和 /etc/resolv.conf，每一种缓存都保存有生存时间（TTL）。其作用是在本地增加 cache ，加快如 DNS 的解析等的速度。

NSCD 的配置文件示例：

```
$ cat /etc/nscd.conf
#logfile        /var/log/nscd.log
threads         6
max-threads     128
server-user     nobody
debug-level     5
paranoia        no
enable-cache    passwd      no
enable-cache    group       no
enable-cache    hosts       yes
positive-time-to-live   hosts   5
negative-time-to-live   hosts       20
suggested-size  hosts       211
check-files     hosts       yes
persistent      hosts       yes
shared          hosts       yes
max-db-size     hosts       33554432
```

如果需要清除相应缓存，可以使用如下命令：

```
nscd -i passwd
nscd -i group
nscd -i hosts
```

或者重启 nscd 服务（基于 ubuntu 系统）：

```
service nscd restart
```

在 Mac 上，如果是 OSX 12 及以后的版本，可以使用如下命令清除 DNS 缓存：

```
sudo killall -HUP mDNSResponder; sudo killall mDNSResponderHelper; sudo dscacheutil -flushcache
```

在 Windows 系统上清除 DNS 缓存：

```
ipconfig /flushdns
```

## 参考资料

- [https://www.zhihu.com/question/23042131](https://www.zhihu.com/question/23042131)
- [Who reads /etc/resolv.conf?](https://unix.stackexchange.com/questions/449067/who-reads-etc-resolv-conf)
- [http://www.dnspython.org](http://www.dnspython.org)
- [https://blog.csdn.net/reyleon/article/details/12976889](https://blog.csdn.net/reyleon/article/details/12976889)
