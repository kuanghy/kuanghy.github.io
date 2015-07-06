---
layout: post
title: Python邮件发送方法简介
category: python
tags: smtplib email 邮件 python
---

Python中的邮件发送主要用到`smtplib`和`email`这两个模块，email模块使得处理邮件变得比较简单。

SMTP（Simple Mail Transfer Protocol）即简单邮件传输协议,它是一组用于由源地址到目的地址传送邮件的规则，由它来控制信件的中转方式。SMTP协议属于TCP/IP协议簇，它帮助每台计算机在发送或中转信件时找到下一个目的地。通过SMTP协议所指定的服务器,就可以把E-mail寄到收信人的服务器上了，整个过程只要几分钟。SMTP服务器则是遵循SMTP协议的发送邮件服务器，用来发送或中转发出的电子邮件。

<br/>
#### smtplib模块

> smtplib.SMTP(self, host='', port=0, local_hostname=None, timeout=&lt;object object&gt;)

SMTP类构造函数，表示与SMTP服务器之间的连接，通过这个连接可以向smtp服务器发送指令，执行相关操作（如：登陆、发送邮件）。所有参数都是可选的。其中host参数表示smtp服务器主机名；port表示smtp服务的端口，默认是25；如果在创建SMTP对象的时候提供了这两个参数，在初始化的时候会自动调用connect方法去连接服务器。

 smtplib模块还提供了SMTP_SSL类和LMTP类，对它们的操作与SMTP基本一致。

**smtplib.SMTP提供的方法：**
> SMTP.set_debuglevel(level)

设置是否为调试模式。默认为False，即非调试模式，表示不输出任何调试信息。

> SMTP.connect([host[, port]])

连接到指定的smtp服务器。参数分别表示smpt主机和端口。注意: 也可以在host参数中指定端口号（如：smpt.yeah.net:25），这样就没必要给出port参数。

> SMTP.docmd(cmd[, argstring])

向smtp服务器发送指令。可选参数argstring表示指令的参数。

> SMTP.helo([hostname]) 

使用"helo"指令向服务器确认身份。相当于告诉smtp服务器“我是谁”。

> SMTP.has_extn(name)

判断指定名称在服务器邮件列表中是否存在。出于安全考虑，smtp服务器往往屏蔽了该指令。

> SMTP.verify(address) 

判断指定邮件地址是否在服务器中存在。出于安全考虑，smtp服务器往往屏蔽了该指令。

> SMTP.login(user, password) 

登陆到smtp服务器。现在几乎所有的smtp服务器，都必须在验证用户信息合法之后才允许发送邮件。

> SMTP.sendmail(from_addr, to_addrs, msg[, mail_options, rcpt_options]) 

发送邮件。这里要注意一下第三个参数，msg是字符串，表示邮件。我们知道邮件一般由标题，发信人，收件人，邮件内容，附件等构成，发送邮件的时候，要注意msg的格式。这个格式就是smtp协议中定义的格式。

> SMTP.quit()

断开与smtp服务器的连接，相当于发送"quit"指令。（很多程序中都用到了smtp.close()，具体与quit的区别google了一下，也没找到答案。）

<br>
#### email模块
 emial模块用来处理邮件消息，包括MIME和其他基于`RFC 2822` 的消息文档。使用这些模块来定义邮件的内容，是非常简单的。其包括的类有（更加详细的介绍可见：[http://docs.python.org/library/email.mime.html](http://docs.python.org/library/email.mime.html)）

MIME (Multipurpose Internet Mail Extensions) 是描述消息内容类型的因特网标准。MIME 消息能包含文本、图像、音频、视频以及其他应用程序专用的数据。MIME的详细讲解可参见[MIME 参考手册](http://www.w3school.com.cn/media/media_mimeref.asp)。

email及其相关子模块的一些常用类：
 
> class email.mime.base.MIMEBase(_maintype, _subtype, **_params)

这是MIME的一个基类。一般不需要在使用时创建实例。其中_maintype是内容类型，如text或者image。_subtype是内容的minor type 类型，如plain或者gif。 **_params是一个字典，直接传递给Message.add_header()。

> class email.mime.multipart.MIMEMultipart([_subtype[, boundary[, _subparts[, _params]]]]

MIMEBase的一个子类，多个MIME对象的集合，_subtype默认值为mixed。boundary是MIMEMultipart的边界，默认边界是可数的。

> class email.mime.application.MIMEApplication(_data[, _subtype[, _encoder[, **_params]]])

MIMEMultipart的一个子类。

> class email.mime.audio.MIMEAudio(_audiodata[, _subtype[, _encoder[, **_params]]])

MIME音频对象

> class email.mime.image.MIMEImage(_imagedata[, _subtype[, _encoder[, **_params]]])

MIME二进制文件对象。

> class email.mime.message.MIMEMessage(_msg[, _subtype])

具体的一个message实例，使用方法如下：

{% highlight python %}
msg=mail.Message.Message()    #一个实例 
msg['to']='XXX@XXX.com'      #发送到哪里 
msg['from']='YYY@YYYY.com'       #自己的邮件地址 
msg['date']='2012-3-16'           #时间日期 
msg['subject']='hello world'    #邮件主题 
{% endhighlight %}

> class email.mime.text.MIMEText(_text[, _subtype[, _charset]])

MIME文本对象，其中_text是邮件内容，_subtype邮件类型，可以是text/plain（普通文本邮件），html/plain(html邮件),  _charset编码，可以是gb2312等等, 如果是中文则需要用utf-8编码。
