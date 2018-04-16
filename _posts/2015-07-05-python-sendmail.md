---
layout: post
title: Python 邮件发送方法简介
keywords: smtplib email 邮件 python
category: Python
tags: python 邮件
---

Python 中的邮件发送主要用到 `smtplib` 和 `email` 这两个模块。smtplib 负责发送邮件，mail 负责构造邮件，使得处理邮件变得简单。

SMTP（Simple Mail Transfer Protocol）即简单邮件传输协议,它是一组用于由源地址到目的地址传送邮件的规则，由它来控制信件的中转方式。SMTP 协议属于 TCP/IP 协议簇，它帮助每台计算机在发送或中转信件时找到下一个目的地。通过 SMTP 协议所指定的服务器,就可以把E-mail寄到收信人的服务器上了，整个过程只要几分钟。SMTP 服务器则是遵循SMTP协议的发送邮件服务器，用来发送或中转发出的电子邮件。

## smtplib 模块

```python
class smtplib.SMTP(host='', port=0, local_hostname=None, [timeout, ]source_address=None)
```

SMTP 类构造函数，表示与 SMTP 服务器之间的连接，通过这个连接可以向 smtp 服务器发送指令，执行相关操作（如：登陆、发送邮件）。所有参数都是可选的。其中 host 参数表示 smtp 服务器主机名；port 表示 smtp 服务的端口，默认是25；如果在创建 SMTP 对象的时候提供了这两个参数，在初始化的时候会自动调用 connect 方法去连接服务器。

smtplib 模块还提供了 SMTP_SSL 类和 LMTP 类，对它们的操作与 SMTP 基本一致。

```python
class smtplib.SMTP_SSL(host='', port=0, local_hostname=None, keyfile=None, certfile=None, [timeout, ]context=None, source_address=None)

class smtplib.LMTP(host='', port=LMTP_PORT, local_hostname=None, source_address=None)
```

**smtplib.SMTP提供的方法：**

> SMTP.set_debuglevel(level)

设置是否为调试模式。默认为False，即非调试模式，表示不输出任何调试信息。

> SMTP.connect([host[, port]])

连接到指定的smtp服务器。参数分别表示 smpt 主机和端口。注意: 也可以在 host 参数中指定端口号（如：smpt.yeah.net:25），这样就没必要给出 port 参数。

> SMTP.docmd(cmd[, argstring])

向 smtp 服务器发送指令。可选参数 argstring 表示指令的参数。

> SMTP.helo([hostname])

使用 "helo" 指令向服务器确认身份。相当于告诉 smtp 服务器 “我是谁”。

> SMTP.has_extn(name)

判断指定名称在服务器邮件列表中是否存在。出于安全考虑，smtp 服务器往往屏蔽了该指令。

> SMTP.verify(address)

判断指定邮件地址是否在服务器中存在。出于安全考虑，smtp 服务器往往屏蔽了该指令。

> SMTP.login(user, password)

登陆到 smtp 服务器。现在几乎所有的 smtp 服务器，都必须在验证用户信息合法之后才允许发送邮件。

> SMTP.starttls([keyfile[, certfile]])

将 smtp 连接切换到 tls 模式。

> SMTP.sendmail(from_addr, to_addrs, msg[, mail_options, rcpt_options])

发送邮件。这里要注意一下第三个参数，msg 是字符串，表示邮件。我们知道邮件一般由标题，发信人，收件人，邮件内容，附件等构成，发送邮件的时候，要注意 msg 的格式。这个格式就是 smtp 协议中定义的格式。

> SMTP.quit()

断开与smtp服务器的连接，相当于发送 "quit" 指令。（很多程序中都用到了smtp.close()，具体与quit的区别google了一下，也没找到答案。）

## email模块

emial 模块用来处理邮件消息，包括 MIME 和其他基于 `RFC 2822` 的消息文档。使用该模块来定义邮件的内容，是非常简单的。其包括的类有（更加详细的介绍可见：[http://docs.python.org/library/email.mime.html](http://docs.python.org/library/email.mime.html)）

MIME (Multipurpose Internet Mail Extensions) 是描述消息内容类型的因特网标准。MIME 消息能包含文本、图像、音频、视频以及其他应用程序专用的数据。MIME 的详细讲解可参见[MIME 参考手册](http://www.w3school.com.cn/media/media_mimeref.asp)。

email 及其相关子模块的一些常用类：

```python
class email.mime.base.MIMEBase(_maintype, _subtype, **_params)
```

这是 MIME 的一个基类。一般不需要在使用时创建实例。其中 _maintype 是内容类型，如 text 或者 image。_subtype 是内容的 minor type 类型，如 plain 或者 gif。 _params 是一个字典，直接传递给 Message.add_header()。

```python
class email.mime.multipart.MIMEMultipart([_subtype[, boundary[, _subparts[, _params]]]]
```

MIMEBase 的一个子类，多个 MIME 对象的集合，_subtype 默认值为 mixed。boundary 是MIMEMultipart 的边界，默认边界是可数的。

```python
class email.mime.application.MIMEApplication(_data[, _subtype[, _encoder[, **_params]]])
```

MIMEMultipart 的一个子类。

```python
class email.mime.audio.MIMEAudio(_audiodata[, _subtype[, _encoder[, **_params]]])
```

MIME 音频对象

```python
class email.mime.image.MIMEImage(_imagedata[, _subtype[, _encoder[, **_params]]])
```

MIME 二进制文件对象。

```python
class email.mime.message.MIMEMessage(_msg[, _subtype])
```

具体的一个 message 实例，使用方法如下：

```python
msg = mail.Message.Message()    # 一个实例
msg['to'] = 'XXX@XXX.com'       # 发送到哪里
msg['from'] = 'YYY@YYYY.com'    # 自己的邮件地址
msg['date'] = '2012-3-16'       # 时间日期
msg['subject'] = 'hello world'  # 邮件主题
```

```python
class email.mime.text.MIMEText(_text[, _subtype[, _charset]])
```

MIME 文本对象，其中_text 是邮件内容，_subtype 邮件类型，可以是 text/plain（普通文本邮件），html/plain(html邮件),  _charset 编码，可以是 gb2312 等等, 如果是中文则需要用 utf-8 编码。

## 参考资料

- [http://www.cnblogs.com/xiaowuyi/archive/2012/03/17/2404015.html](http://www.cnblogs.com/xiaowuyi/archive/2012/03/17/2404015.html)
- [http://www.jb51.net/article/49216.htm](http://www.jb51.net/article/49216.htm)
- [廖雪峰的官方网站--SMTP发送邮件](http://www.liaoxuefeng.com/wiki/001374738125095c955c1e6d8bb493182103fac9270762a000/001386832745198026a685614e7462fb57dbf733cc9f3ad000)

## 使用示例

- [https://github.com/kuanghy/kmailbox](https://github.com/kuanghy/kmailbox)

