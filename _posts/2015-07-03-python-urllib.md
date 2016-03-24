---
layout: post
title: Python模块简介 -- urllib, urllib2
category: Python
tags: urllib python
---

Python的urllib和urllib2模块都做与请求URL相关的操作，但他们提供不同的功能。他们两个最显着的差异如下：

* urllib2可以接受一个Request对象，并以此可以来设置一个URL的headers，但是urllib只接收一个URL。这意味着，你不能伪装你的用户代理字符串等。

* urllib模块可以提供进行urlencode的方法，该方法用于GET查询字符串的生成，urllib2的不具有这样的功能。这就是urllib与urllib2经常在一起使用的原因。

可以说urllib2是对urllib的增强 , 下面所列urllib模块的方法对urllib2模块也使用, 只存在微妙的区别。

<br/>
#### urlopen方法

> urllib.urlopen(url[, data[, proxies]])

创建一个表示远程url的类文件对象，然后像本地文件一样操作这个类文件对象来获取远程数据。

**参数说明:**
参数url表示远程数据的路径，一般是网址；
参数data表示以post方式提交到url的数据(玩过web的人应该知道提交数据的两种方式：post与get。如果你不清楚，也不必太在意，一般情况下很少用到这个参数)；
参数proxies用于设置代理。

urlopen返回 一个类文件对象，它提供了如下方法：
read() , readline() , readlines() , fileno() , close() ：这些方法的使用方式与文件对象完全一样;
info()：返回一个httplib.HTTPMessage 对象，表示远程服务器返回的头信息
getcode()：返回Http状态码。如果是http请求，200表示请求成功完成;404表示网址未找到；
geturl()：返回请求的url；

<br/>
#### urlretrieve方法
> urllib.urlretrieve(url[, filename[, reporthook[, data]]])

直接将远程数据下载到本地。该方法返回一个包含两个元素的元组(filename, headers)，filename表示保存到本地的路径，header表示服务器的响应头。

**参数说明：**
url：外部或者本地url
filename：指定了保存到本地的路径（如果未指定该参数，urllib会生成一个临时文件来保存数据）；
reporthook：是一个回调函数，当连接上服务器、以及相应的数据块传输完毕的时候会触发该回调。我们可以利用这个回调函数来显示当前的下载进度。
data：指post到服务器的数据。

<br/>
#### urlcleanup方法
> urllib.urlcleanup()

清除由于urllib.urlretrieve()所产生的缓存

<br/>
#### quote和quote_plus
urllib.quote(url)和urllib.quote_plus(url)将url数据获取之后，并将其编码，从而适用与URL字符串中，使其能被打印和被web服务器接受。

<br/>
#### unquote和unquote_plus
urllib.unquote(url)和urllib.unquote_plus(url)与上面两个方法相反

<br/>
#### urlencode
urllib.urlencode(query)将URL中的键值对以连接符&划分

<br/>
## 参考资料
http://www.cnblogs.com/wly923/archive/2013/05/07/3057122.html
http://zeping.blog.51cto.com/6140112/1143722
http://zhuoqiang.me/python-urllib2-usage.html
