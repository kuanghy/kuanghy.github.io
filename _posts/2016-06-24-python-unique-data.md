---
layout: post
title: "Python 快速统计数据的去重数和去重数据"
keywords: Python  统计  去重数
description: "在Python中用numpy和pandas来处理数据，其性能会得到很大的提升"
category: Python
tags: python
---

之前用 Python 写过一个脚本，用来处理上千万用户的一些数据，其中有一个需求是统计用户的某一数据的去重数量。为了加快程序的速度，我启用了多进程。但不幸的是，程序跑了近一个星期，还没处理完。这时，我感觉到了不对，于是开始查看程序的性能瓶颈。

对于统计去重数，我是将用户的数据放到一个列表中，然后用 `len(set(data))` 去统计去重数量。刚开始我以为这的数据量并不大，每个用户的数据不会过百，我并没有注意到有的用户会有上万条的数据，因此消耗了大量的时间（其实我的脚本消耗时间最大的地方是因为从远程 redis 中取大量数据时发生长时间的阻塞，甚至连接超时，最后我采用的方式分而治之，每次取少量的数据，这样大大的提高了性能）。

为了做优化，我开始寻求高效的方法。我发现，有大量的人认为采用字典效率会更高，即：

```python
data_unique = {}.fromkeys(data).keys()
len(data_unique)
```

于是，我做了下测试：

```
In [1]: import random

In [2]: data = [random.randint(0, 1000) for _ in xrange(1000000)]

In [3]: %timeit len(set(data))
10 loops, best of 3: 39.7 ms per loop

In [4]: %timeit len({}.fromkeys(data).keys())
10 loops, best of 3: 43.5 ms per loop
```

由此可见，采用字典和采用集合的性能是差不多的，甚至可能还要慢些。

在 Python 中其实有很多高效的库，例如用 numpy、pandas 来处理数据，其性能接近于 C 语言。那么，我们就用 numpy 和 pandas 来解决这个问题，这里我还比较了获取去重数据的性能，代码如下：

```python
import collections
import random as py_random
import timeit

import numpy.random as np_random
import pandas as pd

DATA_SIZE = 10000000

def py_cal_len():
    data = [py_random.randint(0, 1000) for _ in xrange(DATA_SIZE)]
    len(set(data))

def pd_cal_len():
    data = np_random.randint(1000, size=DATA_SIZE)
    data = pd.Series(data)
    data_unique = data.value_counts()
    data_unique.size

def py_count():
    data = [py_random.randint(0, 1000) for _ in xrange(DATA_SIZE)]
    collections.Counter(data)

def pd_count():
    data = np_random.randint(1000, size=DATA_SIZE)
    data = pd.Series(data)
    data.value_counts()

# Script starts from here

if __name__ == "__main__":
    t1 = timeit.Timer("py_cal_len()", setup="from __main__ import py_cal_len")
    t2 = timeit.Timer("pd_cal_len()", setup="from __main__ import pd_cal_len")
    t3 = timeit.Timer("py_count()", setup="from __main__ import py_count")
    t4 = timeit.Timer("pd_count()", setup="from __main__ import pd_count")

    print t1.timeit(number=1)
    print t2.timeit(number=1)
    print t3.timeit(number=1)
    print t4.timeit(number=1)
```

运行结果：

```
12.438587904
0.435907125473
14.6431810856
0.258564949036
```

利用 pandas 统计数据的去重数和去重数据，其性能是 Python 原生函数的 10 倍以上。
