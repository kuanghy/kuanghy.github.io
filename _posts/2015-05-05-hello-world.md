---
layout: post
title: 你好，世界
category: 日志
tags: 博客 GitHub Jekyll Markdown
---

![imge1](http://7xixhp.com1.z0.glb.clouddn.com/schw.jpg)
虽然毕业参加工作以来还不到一年的时间，但想想自己现在也已经是奔三的年纪。回想自己开始学编程时，已经18岁了。这岂不是远远的被别人落在了起跑线上。

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
{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

if __name__ == '__main__':
    print 'hello world'
    
# Script starts from here
{% endhighlight %}

再接着是这样子的：
{% highlight php %}
<?php  # Script -- php.php

/* 
 * 2015-05-06 12:49:49
 */

echo "Hello World!";

?>
{% endhighlight %}
