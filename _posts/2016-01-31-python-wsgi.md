---
layout: post
title: "Python Web 服务器网关接口（WSGI）"
keywords: Python  WSGI wsgiref
description: "WSGI 是作为 Web 服务器与 Web 应用程序或应用框架之间的一种低级别的接口"
category: Python
tags: python wsgi
---

## WSGI 简介

`WSGI` 的全称是 `Web Server Gateway Interface`，即 Web 服务器网关接口。这是一个规范，描述了 web server 如何与 web application 交互、web application 如何处理请求。该规范的具体描述在 [PEP 3333](https://www.python.org/dev/peps/pep-3333/)。

WSGI 是作为 Web 服务器与 Web 应用程序或应用框架之间的一种低级别的接口，以提升可移植 Web 应用开发的共同点。WSGI 是基于现存的 CGI 标准而设计的。WSGI 就像是一座桥梁，一边连着 web 服务器，另一边连着用户的应用。

实现了 WSGI 的模块/库有 wsgiref(python内置)、werkzeug.serving、twisted.web 等，具体可见 [Servers which support WSGI](http://wsgi.readthedocs.org/en/latest/servers.html)。

当前运行在 WSGI 之上的 web 框架有 `Bottle`、`Flask`、`Django `等，具体可见 [Frameworks that run on WSGI](http://wsgi.readthedocs.org/en/latest/frameworks.html)。

`WSGI Server` 所做的工作仅仅是将从客户端收到的请求传递给 `WSGI Application`，然后将 WSGI Application 的返回值作为响应传给客户端。WSGI Applications 可以是栈式的，这个栈的中间部分叫做`中间件`，两端是必须要实现的 application 和 server。

## WSGI Application 接口

![WSGI](https://raw.githubusercontent.com/kuanghy/pichub/master/2020/05/d18f161d2eb9071b829afccd1b5a5552.png)

WSGI 协议规定，一个基本的 wsgi application，需要实现以下功能：

- 必须是一个可调用的对象，如函数、方法、类、实现了 `__call__` 方法的对象
- 接收两个必须的位置参数 environ、start_response，**environ** 是一个字典，存放 CGI 规定的变量以及一些别的变量（包括 HTTP 的请求头，WSGI 参数，环境变量等），**start_response** 是一个可调用对象，由 application 回调，用以发送 HTTP 的响应头部
- 必须返回一个可迭代对象，用以发送 HTTP Body 数据

一个简单的 application 定义大致为：

```python
def application(environ, start_response):
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain')]
    start_response(status, response_headers)
    return ["Hello world!"]
```

`application` 的 environ 参数由 Web Server 解析客户请求后填充。参数 start_response 必须是一个可调用对象，需由 Server 实现，其需要接收两个必须的位置参数，一个是响应的状态码，一个是响应的头部字段数据，以及一个可选的 exc_info 参数，其定义大致为：

```python
def start_response(status, response_headers, exc_info=None):
    if exc_info:
         try:
            if headers_sent:
                reraise(*exc_info)
         finally:
             exc_info = None

    return write
```

`response_headers` 需要是一个包含若干 (header_name, header_value) 元组的 list，其必须是一个 Python list 结构。如果 exc_info 被设置, 并且 HTTP Headers 数据已经发送, start_response 必选将 exc_info 异常重新抛出。start_response 需要返回一个 `write()` 回调，用于支持旧式的无缓冲的 application 框架。

WSGI 应用必须返回一个可迭代的(iterable)的对象，Server 会迭代其数据发送给客户端。应用也可以调用 `write()` 回调发送 HTTP body 数据，但不建议这个做。即使应用程序使用 write() 发送了全部数据，start_response 也必须返回一个可调用对象。

实际上 start_response 也可以返回一个字符串，因为字符串也是可迭代对象，但这是不推荐的。因为这样每次迭代只能得到 1 byte 的数据量，也就意味着每次只向客户端发送 1 byte 的数据，直到发送完毕为止，效率会非常低。所以，即使响应只有一个字符串数据，也推荐使用 `return [response_body]` 的形式返回。

如果应用提供了 **Content-Length** 头，则服务器不应该向客户端发送超过其指定的字节数，并且应在发送了足够的数据后停止对响应的迭代，如果应用尝试调用 write() 也应抛出异常。当然，如果应用没有提供足够的数据来满足其指定的内容长度，服务器应该关闭连接并记录，或以其他方式报告错误。如果没有提供该头部字段指定内容长度，则服务器在发送完所有数据后直接关闭客户端连接即可。

## Wsgiref 简介

`wsgiref` 是采用 WSGI 标准实现的 Python 内置的 HTTP 服务器，使用 wsgiref 可以实现简单的 Web 服务器功能，其包含以下几个模块：

- **simple_server：** 实现了一个简单的 HTTP 服务器，并给出了一个简单的 demo
- **handlers：** `simple_server` 模块将 HTTP 服务器分成了 Server 部分和 Handler 部分，前者负责接收请求，后者负责具体的处理，其中 Handler 部分主要在 handlers 中实现
- **headers：** 主要是为 HTTP 协议中 header 部分建立数据结构
- **util：** 这一模块包含了一些工具函数，主要用于对环境变量，URL的处理
- **validate：** 这一模块提供了一个验证工具，可以用于验证你的实现是否符合WSGI标准

下面是一个简单的 web 服务器示例，主要输出客户端请求信息：

- 服务器 showenv.py：

```python
# -*- coding: utf-8 -*-

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
    response_headers = [
        ("Content-Type", "text/html"),
        ("Content-Length", str(content_len))
    ]

    # Use callback function to send back status code
    # and response headers
    start_response(status, response_headers)

    # return response body through return statement
    return [response_body]


if __name__ == "__main__":
    # Create web server
    httpd = make_server(HOST, PORT, application)

    # Print prompting message
    print "Starting http server at http://%s:%s/" % (HOST, str(PORT))
    print "Quit the server with CONTROL-C."

    # Listen http request
    httpd.serve_forever()
```

- 模板文件 getenv.tpl：

```html
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
```

## 参考资料

- [http://www.letiantian.me/2015-09-10-understand-python-wsgi/](http://www.letiantian.me/2015-09-10-understand-python-wsgi/)
- [http://www.cnblogs.com/Security-Darren/p/4085592.html](http://www.cnblogs.com/Security-Darren/p/4085592.html)
- [http://segmentfault.com/a/1190000002717571](http://segmentfault.com/a/1190000002717571)
- [http://blog.csdn.net/on_1y/article/details/18818081](http://blog.csdn.net/on_1y/article/details/18818081)
