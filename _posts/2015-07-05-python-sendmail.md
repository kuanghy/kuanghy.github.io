---
layout: post
title: Python邮件发送方法简介
category: Python
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

<br/>
## 参考资料
http://www.cnblogs.com/xiaowuyi/archive/2012/03/17/2404015.html<br/>
http://www.jb51.net/article/49216.htm<br/>
[廖雪峰的官方网站--SMTP发送邮件](http://www.liaoxuefeng.com/wiki/001374738125095c955c1e6d8bb493182103fac9270762a000/001386832745198026a685614e7462fb57dbf733cc9f3ad000)

<br/>
## 使用示例
自己实现的一个邮件发送模块，只需要三个方法便可完成邮件发送的整个过程。支持发送附件，以及带图片的html邮件，支持群发。最后还提供了直接在终端控制台发送邮件的实现。

{% highlight python%}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  sendmail.py
#       Author @  Huoty
#  Create date @  2015-07-05 09:25:55
#  Description @  邮件发送
# *************************************************************

import os
import re
import time
import sys
import getopt
import getpass
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import logging
from logging import debug
logging.basicConfig(level = logging.DEBUG)

class SendMail(object):
    '''
    发送邮件
    '''
    def __init__(self, mail_host):
        '''
        构造函数，初始化邮件发送所必须的参数：
            mail_host： 邮件服务器主机地址,支持直接加端口号,例如 "smtp.XXX.com:25"
            mail_user： 邮箱用户名，仅用户名，例如 Huoty
            mail_passwd: 邮箱登录密码
            mail_sender: 邮件发送者，支持两种：一种直接是邮箱地址，例如 sudohuoty@163.com; 另一种是带发送者昵称的，例如 huoty<sudohuoty@163.com>
            mailto_list: 邮件接受者列表，支持群发
            mail_msg: 要发送的邮件信息，包括文本和附件
        '''
        self.mail_host = mail_host
        self.mail_user = ""
        self.mail_passwd = ""
        self.mail_sender = ""
        self.mailto_list = ""
        self.mail_msg = MIMEMultipart()

    def setsender(self, sender, passwd, tolist):
        '''
        设置发件人姓名和邮箱地址，邮箱密码，和收件人列表。sender可以是单纯的邮箱地址，例如 sudohuoty@163.com；也可以是带发送者姓名的邮件地址，例如 Huoty<sudohuoty@163.com>。tolist为收件人列表, 如果为群发, 则用列表或元组包含多个收件地址。
        '''
        print "Setting the sender information ..."
        debug(str("Sender is " + sender))

        # 提取邮箱用户名
        reg_result1 = re.search("^\w+<([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})>$", sender)
        if reg_result1:
            self.mail_user = reg_result1.group(1)
            debug(str("Mail user is " + self.mail_user))
        else:
            reg_result2 = re.search("^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$", sender)
            if reg_result2:
                self.mail_user = reg_result2.group(1)
                debug(str("Mail user is " + self.mail_user))
            else:
                print "Error：The email address of sender is a incorrect format!"
                return False

        self.mail_passwd = passwd
        self.mail_sender = sender
        self.mailto_list = tolist

        return True

    def setcontent(self, subject, content, subtype = "plain", charset = "utf-8", attachments = []):
        '''
        设置邮件内容：
            subject：邮件主题
            content：邮件文本内容
            subtype：发送的邮件类型，其值可以为 plain/text、html、misc, 为 html 时必须包含 body 标签
            charset：邮件内容的编码方式
            attachment：附件列表
        当邮件类型为 html 和 misc 时才需要传递 attachment 参数。当邮件类型为 misc，且文本内容为 html 形式，并包含媒体内容，则在 attachment 中传递媒体资源时，应将其加 “cid + 编号：” 前缀，例如 ”cid0：/home/konghy/temp/psb.jpg“
        '''
        print "Setting the mail content ..."

        self.mail_msg['Subject'] = subject
        self.mail_msg['From'] = self.mail_sender
        self.mail_msg['To'] = ";".join(self.mailto_list)
        self.mail_msg['Date'] = time.strftime("%Y-%m-%d", time.localtime())

        # mail type is plain/text
        if subtype == "plain" or subtype == "text":
            self.mail_msg.attach(MIMEText(content, _subtype = subtype, _charset = charset))
        # mail type is html
        elif subtype == 'html':
            if len(attachments) == 0:
                self.mail_msg.attach(MIMEText(content, _subtype = subtype, _charset = charset))
            else:
                self.mail_msg.attach(MIMEText(content, _subtype = subtype, _charset = charset))

                for i, attachment in enumerate(attachments):
                    fp = open(attachment, 'rb')
                    mime = MIMEImage(fp.read())
                    fp.close()

                    mime.add_header('Content-Disposition', 'attachment', filename = os.path.basename(attachment))
                    mime.add_header('Content-ID', '<' + str(i) + '>')
                    mime.add_header('X-Attachment-Id', str(i))
                    self.mail_msg.attach(mime)
        # mail type is compound
        elif subtype == "misc":
            is_html = re.search("<body>.*</body>", content, re.S)
            if len(attachments) == 0 and not is_html:
                self.mail_msg.attach(MIMEText(content, _subtype = 'plain', _charset = charset))
            else:
                if is_html:
                    self.mail_msg.attach(MIMEText(content, _subtype = 'html', _charset = charset))
                else:
                    self.mail_msg.attach(MIMEText(content, _subtype = 'plain', _charset = charset))

                for i, attachment in enumerate(attachments):
                    html_media = re.search("^cid(\d+):(.+)$", attachment)
                    if html_media: # 判断是否为html中包含的媒体
                        fp = open(html_media.group(2), 'rb')
                        mime = MIMEImage(fp.read())
                        fp.close()

                        mime.add_header('Content-Disposition', 'attachment', filename = os.path.basename(attachment))
                        mime.add_header('Content-ID', '<' + html_media.group(1) + '>')
                        mime.add_header('X-Attachment-Id', html_media.group(1))
                        self.mail_msg.attach(mime)
                    else: # 普通附件文件
                        fp = open(attachment, 'rb')
                        att = MIMEText(fp.read(), 'base64', 'utf-8')
                        fp.close()

                        att.add_header('Content-Type', 'application/octet-stream')
                        att.add_header('Content-Disposition', 'attachment', filename = os.path.basename(attachment))
                        self.mail_msg.attach(att)
        else:
            print "Temporarily does not support this type of email:", subtype
            return False

        #debug(self.mail_msg.as_string())
        return True

    def startup(self):
        '''
        连接邮件服务器,并发送邮件
        '''
        print "Sending mail ..."

        try:
            server = smtplib.SMTP()
            server.connect(self.mail_host)
            server.login(self.mail_user, self.mail_passwd)
            server.sendmail(self.mail_sender, self.mailto_list, self.mail_msg.as_string())
            server.close()

            print "Successfully"
            return True

        except Exception, e:
            print "Failed to send mail:"
            print str(e)
            return False

def testsend():
    content = '''
<body>
Hello!

<p><img src="cid:0"></p>
I am Huoty.

How are you?

Give you a picture:
<p><img src="cid:1"></p>
</body>
'''
    mail = SendMail("smtp.163.com")
    mail.setsender("Huoty<sudohuoty@163.com>", "xxxxxx", ["sudohuoty@163.com", "1346632121@qq.com"])
    mail.setcontent("Test to send email by python", content, subtype = "misc", attachments = ["cid0:/home/konghy/temp/khy_face_130.png", "cid1:/home/konghy/temp/psb.jpg", "/home/konghy/temp/Python.png", "/home/konghy/temp/test.pdf"])
    mail.startup()

# Script starts from here

if __name__ == '__main__':
    #testsend()

    try:
        opts, args = getopt.getopt(sys.argv[1:], "hv", ["help", "version"])
    except getopt.GetoptError:
        print "Invalid option!"

    if opts:
        for o, a in opts:
            if o in ("-h", "--help"):
                print u'''
Usage: sendmail command

sendmail is a simple command line for sending email.

Commands:
    h | --help        Show usage
    v | --version     Show version
'''
                sys.exit()

            if o in ("-v", "--version"):
                print u"Sendmail version: sendmail/1.0 (all platforms)"
                print u"Sendmail built:   2015-07-07"
                print u"Sendmail author:  huoty"
                sys.exit()
    else:
        print "Please enter the following information:"
        mailserver = raw_input("Email server: ")
        mailsender = raw_input("Email sender: ")
        mailpassed = getpass.getpass("Emial passwd: ")

        receivers = raw_input("To list: ").split(",")
        mailtolist = []
        for receiver in receivers:
            mailtolist.append(receiver.strip())
        debug(mailtolist)

        mailsubject = raw_input("Email subject: ")

        mailtype = raw_input("Email type: ")
        while True:
            if not mailtype in ["plain", "text", "html", "misc"]:
                print "The type you entered is incorrect, please input again."
                mailtype = raw_input("Email type: ")
            else:
                break

        print "Email content: "
        mailcontent = ""
        while True:
            strline = raw_input()
            if strline == ">>>end":
                break
            else:
                mailcontent += strline + "\n"

        atts = raw_input("Email attachments: ").split(",")
        mailattachments = []
        for att in atts:
            mailattachments.append(att.strip())
        debug(mailattachments)

        print "\n"
        mail = SendMail(mailserver)
        mail.setsender(mailsender, mailpassed, mailtolist)
        mail.setcontent(mailsubject, mailcontent.strip(), subtype = mailtype, attachments = mailattachments)
        mail.startup()
{% endhighlight %}
