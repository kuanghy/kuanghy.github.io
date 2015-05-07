---
layout: post
title: 你好，世界
category: 日志
tags: 博客 GitHub Jekyll Markdown
---

虽然毕业参加工作以来还不到一年的时间，但想想自己现在也已经是奔三的年纪。回想自己开始学编程时，已经18岁了。这岂不是远远的被别人落在了起跑线上。

![imge1](http://7xixhp.com1.z0.glb.clouddn.com/schw.jpg)

世界上的第一个程序是 **Hello World**。于是导致后来人在刚开始学习编程的时候，都以 **Hello World** 开篇。以下这个笑话估计只有接触过编程的人才能看懂：

> 某程序员退休后决定练习书法，于是重金购买文房四宝。一日，饭后突生雅兴，一番研墨拟纸，并点上上好檀香。定神片刻，泼墨挥毫，郑重地写下一行字：hello world！

我想，不懂编程的人是体会不到 **Hello World** 的伟大的。

我写的第一个程序是这个样子的：
{% highlight ruby %}
// hello.c
#include <stdio.h>

int main(void)
{
  printf("Hello world!\n");
  
  return 0;
}
{% endhighlight %}

接着是这样子的：
{% highlight cpp %}
#include <iostream>

using namespace std;

int main(void)
{
    cout << "Hello world!" << endl;

    return 0;
}
{% endhighlight %}

再接着是这样子的：
{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

if __name__ == '__main__':
    print 'hello world'
    
# Script starts from here
{% endhighlight %}

然后是这样子的
{% highlight html %}
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="keywords" content="HTML, CSS, XML, XHTML, JavaScript">
        <meta name="description" content="Test on HTML and CSS">
        <meta name="author" content="Huoty">
        <meta http-equiv="refresh" content="30">
        <title>Web 设计</title>
        <link rel="shortcut icon" href="/htmls/images/favicon.ico" type="image/x-icon" />
    </head>
    <body>
       	<h1>Hello world!</h1>
    </body>
</html> 
{% endhighlight %}

再然后是这样子的：
{% highlight php %}
<?php  # Script -- php.php

/* 
 * 2015-05-05 12:49:49
 */

echo "Hello World!";

?>
{% endhighlight %}

再再然后是这样子的：
{% highlight javascript %}
<script type="text/javascript">
	function button_clicked()
	{
		alert("Hello world!");
	}
</script>
{% endhighlight %}

啊，搞得好像我满脑子都是 **Hello World** 似的。一下子罗列了不少的代码，就当我是在测试博客的代码语法效果吧。我不确定在以后的生涯中，我还会遇到多少的 **Hello World**,我只觉得见到它，我有一些莫名的感觉。写到这里，突然不知道该说什么了，我明明记得我有很多话要说的。想要搭建独立博客的心郁积了很久，现在终于舒了一口气，当然是应该好好抒发一下心情的。其实，当一切平静下来的时候，很多东西都不在重要了。

今天终于把博客的基本模型搭建完成，作为一名 **Coder**，第一篇文章也就用了 **Hello World** 开篇。

你好，世界！！！
