---
layout: post
title: Python模块简介 -- random
category: Python
tags: python random
---

Python中的random模块用于生成随机数，这里主要对该模块中一些常用的函数进行介绍。

<br/>
#### Random

> random.random()

用于生成一个0到1的随机浮点数: 0 <= n < 1.0 

<br/>
#### Uniform

> random.uniform(a, b)

用于生成一个指定范围内的随机符点数，两个参数其中一个是上限，一个是下限。如果a > b，则生成的随机数n: b <= n <= a。如果 a < b， 则 a <= n <= b。

<br/>
#### Randint

> random.randint(a, b)

用于生成一个指定范围内的整数。其中参数a是下限，参数b是上限，生成的随机数n: `a <= n <= b`。

<br>
#### Randrange

> random.randrange(start, stop=None, step=1, _int=<type 'int'>, _maxwidth=9007199254740992L)

从指定范围内，按指定基数递增的集合中 获取一个随机数。如：random.randrange(10, 100, 2)，结果相当于从[10, 12, 14, 16, ... 96, 98]序列中获取一个随机数。random.randrange(10, 100, 2)在结果上与 random.choice(range(10, 100, 2) 等效。

<br/>
#### Choice

> random.choice(seq)

从序列中获取一个随机元素。参数sequence表示一个有序类型(包括list, tuple, 字符串)。

<br/>
#### Shuffle

> random.shuffle(x, random=None)

用于将一个列表中的元素打乱，该方法没有返回值，只原地打乱序列。

<br/>
#### Sample

> random.sample(sequence, k)

从指定序列中随机获取指定长度的片断。sample函数不会修改原有序列。
