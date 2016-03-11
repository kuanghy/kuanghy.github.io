---
layout: post
title: "Python Web服务网关接口（WSGI）"
keywords: Python  WSGI wsgiref
description: "WSGI 是作为 Web 服务器与 Web 应用程序或应用框架之间的一种低级别的接口"
category: python
tags: Python  WSGI wsgiref
---
{% include JB/setup %}

## WSGI 简介

`WSGI` 的全称是 `Web Server Gateway Interface`，即 Web 服务网关接口。这是一个规范，描述了 web server 如何与 web application 交互、web application 如何处理请求。该规范的具体描述在[PEP 3333](https://www.python.org/dev/peps/pep-3333/)。

WSGI 是作为 Web 服务器与 Web 应用程序或应用框架之间的一种低级别的接口，以提升可移植 Web 应用开发的共同点。WSGI 是基于现存的 CGI 标准而设计的。WSGI 就像是一座桥梁，一边连着 web 服务器，另一边连着用户的应用。

实现了 WSGI 的模块/库有 wsgiref(python内置)、werkzeug.serving、twisted.web 等，具体可见[Servers which support WSGI](http://wsgi.readthedocs.org/en/latest/servers.html)。

当前运行在 WSGI 之上的 web 框架有`Bottle`、`Flask`、`Django`等，具体可见[Frameworks that run on WSGI](http://wsgi.readthedocs.org/en/latest/frameworks.html)。

`WSGI server`所做的工作仅仅是将从客户端收到的请求传递给`WSGI application`，然后将 WSGI application 的返回值作为响应传给客户端。WSGI applications 可以是栈式的，这个栈的中间部分叫做`中间件`，两端是必须要实现的 application 和 server。

## WSGI application 接口

WSGI 应用接口只要是一个可调用的对象就行，例如函数、方法、类、含 \_\_call__ 方法的实例。这个可调用的对象需要：

- 1、 接受两个位置参数：
    - a、包含 CGI 形式变量的字典，该字典包含了客户端请求的信息以及其他信息，可以认为是请求上下文，一般叫做 environment（编码中多简写为environ、env）；
    - b、应用调用的回调函数，该回调函数的作用是将HTTP响应的状态码和header返回给server。

- 2、将响应 body 部分的内容作为包裹在一个`可迭代的对象`中的（若干）字符串。

几点说明：

- 1、application 的第一个参数env是一个字典，里面包含了CGI形式的环境变量，该字典是由server基于客户请求填充。

- 2、headers在构建的时候，必须遵循以下规则：

> [(Header name1, Header value1), (Header name2, Header value2),]

响应 header 和响应 HTTP 状态码通过应用的第二个参数即回调函数发回给 server。

- 3、body 在构建的时候，必须遵循以下规则:

> [response_body]

即响应 body 必须被包裹在可迭代的对象中，同时通过 return 语句返回给 server。当然这里也可以直接为字符串，因为字符串页是可迭代对象，但这会导致WSGI程序的响应变慢。原因是每一次迭代只能得到1 byte的数据量，这也意味着每一次只向客户端发送1 byte的数据，直到发送完毕为止。所以，推荐使用 `return [response_body]`。

## Wsgiref 简介

`wsgiref`是采用 WSGI 标准实现的 Python 内置的 HTTP 服务器，使用 wsgiref 可以实现简单的 Web 服务器功能，其包含以下几个模块：

- simple_server

    这一模块实现了一个简单的 HTTP 服务器，并给出了一个简单的 demo。

- handlers

    `simple_server`模块将 HTTP 服务器分成了 Server 部分和 Handler 部分，前者负责接收请求，后者负责具体的处理， 其中Handler部分主要在handlers中实现。

- headers

    这一模块主要是为HTTP协议中header部分建立数据结构。

- util

    这一模块包含了一些工具函数，主要用于对环境变量，URL的处理。

-  validate
 
    这一模块提供了一个验证工具，可以用于验证你的实现是否符合WSGI标准
    
下面是一个简单的 web 服务器示例，主要输出客户端请求信息：

- 服务器 showenv.py：

{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  showenv.py
#       Author @  Huoty
#  Create date @  2016-01-30 17:56:23
#  Description @  Show client request info
# *************************************************************

from wsgiref.simple_server import make_server

PORT = 12018
HOST = "127.0.0.1"

def create_template(filename):
    tpl = ""
    with open(filename, "r") as file_obj:
        for line in file_obj.readlines():
            if line != "\n":
                tpl = "".join([tpl, line.strip()])

    return tpl

def application(environ, start_response):
    # Response body
    env_items = [ "<tr><td>%s</td><td>%s</td></tr>" % (key, val) \
            for key, val in sorted(environ.items()) ]
    response_body = create_template("getenv.tpl") % "".join(env_items)

    # Length of response body
    content_len = len(response_body)

    # Status code and response headers
    status = "200 OK"
    response_headers = [("Content-Type", "text/html"), ("Content-Length", str(content_len))]
    
    # Use callback function to send back status code
    # and response headers
    start_response(status, response_headers)

    # return response body through return statement
    return response_body

# Script starts from here

if __name__ == "__main__":
    # Create web server
    httpd = make_server(HOST, PORT, application)

    # Print prompting message
    print "Starting http server at http://%s:%s/" % (HOST, str(PORT))
    print "Quit the server with CONTROL-C."
    
    # Listen http request
    httpd.serve_forever()
{% endhighlight %}

- 模板文件 getenv.tpl：

{% highlight html %}
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Show client request info</title>
        <style type="text/css">
html, body {
	margin: 5px 12px;
}
h2 {
	color:#333333;
	text-align: center;
}
footer {
	color: #AAA;
	margin: 10px 0px;
	font-size: 12px;
	text-align: center;
	letter-spacing: 0.5px;
}
footer a {
	color: #777;
	text-decoration: none;
}
footer a:hover {
	border-bottom: 1px dashed #BBB;
	text-decoration: none;
}
table {
	font-family: verdana,arial,sans-serif;
	font-size:11px;
	color:#333333;
	border-width: 1px;
	border-color: #666666;
	border-collapse: collapse;
}
table th {
	border-width: 1px;
	padding: 8px;
	border-style: solid;
	border-color: #666666;
	background-color: #dedede;
}
table td {
	border-width: 1px;
	padding: 8px;
	border-style: solid;
	border-color: #666666;
	background-color: #ffffff;
}
        </style>
    </head>
    <body>
<h2>Client Response Information</h2>
<table class="gridtable">
<tr>
	<th>Response name</th><th>Value</th>
</tr>
%s
</table>
<footer>Based on python and wsgiref, Powered by <a href="http://konghy.cn/">huoty.</footer>
    </body>
</html> 
{% endhighlight %}

## 参考资料

- [http://www.letiantian.me/2015-09-10-understand-python-wsgi/](http://www.letiantian.me/2015-09-10-understand-python-wsgi/)
- [http://www.cnblogs.com/Security-Darren/p/4085592.html](http://www.cnblogs.com/Security-Darren/p/4085592.html)
- [http://segmentfault.com/a/1190000002717571](http://segmentfault.com/a/1190000002717571)
- [http://blog.csdn.net/on_1y/article/details/18818081](http://blog.csdn.net/on_1y/article/details/18818081)