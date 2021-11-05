---
layout: post
title: Python 模块简介 -- urllib, urllib2
keywords: urllib urllib2 python python模块 request
category: Python
tags: python python模块
---

Python 的 urllib 和 urllib2 模块都做与请求 URL 相关的操作，但他们提供不同的功能。他们两个最显着的差异如下：

- urllib2 主要的功能是接受一个 Request 对象，并以此可以来设置一个 URL 的 headers，但 urllib 只接收一个 URL。这意味着不能伪装用户代理字符串等。

- urllib 模块可以提供进行 urlencode 的方法，该方法用于 GET 查询字符串的生成，urllib2 的不具有这样的功能。这就是 urllib 与 urllib2 经常在一起使用的原因。urllib 模块也提供其他一些 url 的处理方法。


#### urlopen 方法

> urllib.urlopen(url[, data[, proxies]])

创建一个表示远程 url 的类文件对象，然后像本地文件一样操作这个类文件对象来获取远程数据。

**参数说明:**
参数url表示远程数据的路径，一般是网址；
参数data表示以post方式提交到url的数据(玩过web的人应该知道提交数据的两种方式：post与get。如果你不清楚，也不必太在意，一般情况下很少用到这个参数)；
参数proxies用于设置代理。

urlopen返回 一个类文件对象，它提供了如下方法：
read() , readline() , readlines() , fileno() , close() ：这些方法的使用方式与文件对象完全一样;
info()：返回一个httplib.HTTPMessage 对象，表示远程服务器返回的头信息
getcode()：返回Http状态码。如果是http请求，200表示请求成功完成;404表示网址未找到；
geturl()：返回请求的url；

#### urlretrieve 方法

> urllib.urlretrieve(url[, filename[, reporthook[, data]]])

直接将远程数据下载到本地。该方法返回一个包含两个元素的元组(filename, headers)，filename 表示保存到本地的路径，header 表示服务器的响应头。

**参数说明：**

- **url：** 外部或者本地 url
- **filename：** 指定了保存到本地的路径（如果未指定该参数，urllib会生成一个临时文件来保存数据）
- **reporthook：** 是一个回调函数，当连接上服务器、以及相应的数据块传输完毕的时候会触发该回调。我们可以利用这个回调函数来显示当前的下载进度
- **data：** 指post到服务器的数据

#### urlcleanup 方法

> urllib.urlcleanup()

清除由于 urllib.urlretrieve() 所产生的缓存

#### quote 和 quote_plus

urllib.quote(url) 和 urllib.quote_plus(url) 将 url 数据获取之后，并将其编码，从而使用于 URL 字符串中，使其能被打印和被 Web 服务器接受。

#### unquote 和 unquote_plus

urllib.unquote(url) 和 urllib.unquote_plus(url) 与上面两个方法相反

#### urlencode

urllib.urlencode(query) 将 URL 中的键值对以连接符 & 划分

#### urllib3 & requests

此外，还有一个第三方开发的 [urllib3](https://github.com/urllib3/urllib3) 库，是 urllib 和 urllib2 功能的增强以及补充。

需要注意的是，到 Python 3 之后，标准库的 urllib 与 urllib2 库已经被合并，统一放到了 urllib 库下，并通过子模块来细分功能：

- **urllib.request：** 请求模块
- **urllib.error：** 异常处理模块
- **urllib.parse：** url解析模块
- **urllib.robotparser：** robots.txt 解析模块

在 Python 中处理网络 HTTP 请求，可以考虑使用另外一个第三方库 [requests](https://github.com/psf/requests)，其功能非常完备，是一个比较全面的 HTTP 客户端库，而且使用也非常简单。

#### 参考资料

- http://www.cnblogs.com/wly923/archive/2013/05/07/3057122.html
- http://zeping.blog.51cto.com/6140112/1143722
- http://zhuoqiang.me/python-urllib2-usage.html
