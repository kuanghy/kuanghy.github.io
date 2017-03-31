---
layout: post
title: "Python 实现斐波那契数列"
keywords: python 斐波那契数列
description: "斐波那契数列，又称黄金分割数列"
category: Python
tags: python
---

斐波那契数列，又称黄金分割数列，指的是这样一个数列：0、1、1、2、3、5、8、13、21、……在数学上，斐波纳契数列以如下递归的方法定义：

> F（0）=0，F（1）=1，F（n）=F(n-1)+F(n-2)（n≥2，n∈N*）。

![fibonacci](http://ww4.sinaimg.cn/mw690/c3c88275gw1f3rqlz6b76j20ma0dtaei.jpg)

#### 1. 元组实现

```python
fibs = [0, 1]
for i in range(8):
    fibs.append(fibs[-2] + fibs[-1])
```

这能得到一个在指定范围内的斐波那契数列的列表。

#### 2. 迭代器实现

```python
class Fibs:
    def __init__(self):
        self.a = 0
        self.b = 1

    def next(self):
        self.a, self.b = self.b, self.a + self.b
        return self.a

    def __iter__(self):
        return self
```

这将得到一个无穷的数列，可以采用如下方式访问：

```python
fibs = Fibs()
for f in fibs:
    if f > 1000:
        print f
        break
    else:
        print f
```

#### 3. 通过定制类实现

```python
class Fib(object):
    def __getitem__(self, n):
        if isinstance(n, int):
            a, b = 1, 1
            for x in range(n):
                a, b = b, a + b
            return a
        elif isinstance(n, slice):
            start = n.start
            stop = n.stop
            a, b = 1, 1
            L = []
            for x in range(stop):
                if x >= start:
                    L.append(a)
                a, b = b, a + b
            return L
        else:
            raise TypeError("Fib indices must be integers")
```

这样可以得到一个类似于序列的数据结构，可以通过下标来访问数据：

```python
f = Fib()
print f[0:5]
print f[:10]
```
