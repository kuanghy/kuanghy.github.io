---
layout: post
title: "Linux 中的随机数设备文件"
category: Linux
tags: random urandom
---

Linux 中的随机数可以从两个特殊的文件中产生，一个是 `/dev/urandom`，另外一个是 `/dev/random`。他们产生随机数的原理是利用当前系统的熵池来计算出固定一定数量的随机比特，然后将这些比特作为字节流返回。熵池就是当前系统的环境噪音，熵指的是一个系统的混乱程度，系统噪音可以通过很多参数来评估，如内存的使用，文件的使用量，不同类型的进程数量等等。如果当前环境噪音变化的不是很剧烈或者当前环境噪音很小，比如刚开机的时候，而当前需要大量的随机比特，这时产生的随机数的随机效果就不是很好了。

这就是为什么会有 `/dev/urandom`和 `/dev/random` 这两种不同的文件，后者在不能产生新的随机数时会阻塞程序，而前者不会（ublock），当然产生的随机数效果就不太好了，这对加密解密这样的应用来说就不是一种很好的选择。`/dev/random` 会阻塞当前的程序，直到根据熵池产生新的随机字节之后才返回，所以使用 `/dev/random` 比使用 `/dev/urandom` 产生大量随机数的速度要慢。

很多应用都需要使用random设备提供的随机数，比如 ssh keys, SSL keys, TCP/IP sequence numbers 等等。而 random设备的 random pool 是从基于中断的IRQS里面取值，IRQS跟一些特殊的硬件绑定，基于这些硬件的interrupts将会提供给random设备。linux下可以用 `cat /proc/interrupts` 查看哪些设备绑定了irq。

可以用如下命令对二者进行简单的性能比较：

> dd if=/dev/random of=random1.dat bs=1024b count=1 

> dd if=/dev/urandom of=random2.dat bs=1024b count=1 

可以看到使用/dev/random产生随机数的速度很慢，而且产生的量很有限，当然，/dev/urandom的随机效果则好很多。

举一个应用的例子，例如生成一个 30 位的随机密码可以用如下命令：

> strings /dev/urandom | grep -o '[[:alnum:]]' | head -n 30 | tr -d '\n'; echo

## 参考资料
[http://www.linuxidc.com/Linux/2012-05/60476.htm](http://www.linuxidc.com/Linux/2012-05/60476.htm)

[http://blog.csdn.net/zqy2000zqy/article/details/1154842](http://blog.csdn.net/zqy2000zqy/article/details/1154842)
