---
layout: post
title: "Python 二分查找与 bisect 模块"
keywords: Python  bisect
description: "Python的bisect模块用于列表的二分法插入，用其实现二分查找效率更高"
category: Python
tags: Python  bisect
---

Python 的列表（list）内部实现是一个数组，也就是一个线性表。在列表中查找元素可以使用 list.index() 方法，其时间复杂度为O(n)。对于大数据量，则可以用二分查找进行优化。二分查找要求对象必须有序，其基本原理如下：

- 1.从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜素过程结束；
- 2.如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较。
- 3.如果在某一步骤数组为空，则代表找不到。

二分查找也成为折半查找，算法每一次比较都使搜索范围缩小一半， 其时间复杂度为 O(logn)。

我们分别用递归和循环来实现二分查找：

{% highlight python %}
def binary_search_recursion(lst, value, low, high):  
    if high < low:  
        return None
    mid = (low + high) / 2  
    if lst[mid] > value:  
        return binary_search_recursion(lst, value, low, mid-1)  
    elif lst[mid] < value:  
        return binary_search_recursion(lst, value, mid+1, high)  
    else:  
        return mid  

def binary_search_loop(lst,value):  
    low, high = 0, len(lst)-1  
    while low <= high:  
        mid = (low + high) / 2  
        if lst[mid] < value:  
            low = mid + 1  
        elif lst[mid] > value:  
            high = mid - 1
        else:
            return mid  
    return None
{% endhighlight %}

接着对这两种实现进行一下性能测试：

{% highlight python %}
if __name__ == "__main__":
    import random
    lst = [random.randint(0, 10000) for _ in xrange(100000)]
    lst.sort()

    def test_recursion():
        binary_search_recursion(lst, 999, 0, len(lst)-1)

    def test_loop():
        binary_search_loop(lst, 999)

    import timeit
    t1 = timeit.Timer("test_recursion()", setup="from __main__ import test_recursion")
    t2 = timeit.Timer("test_loop()", setup="from __main__ import test_loop")

    print "Recursion:", t1.timeit()
    print "Loop:", t2.timeit()
{% endhighlight %}

执行结果如下：

```
Recursion: 3.12596702576
Loop: 2.08254289627
```

可以看出循环方式比递归效率高。

Python 有一个 `bisect` 模块，用于维护有序列表。`bisect` 模块实现了一个算法用于插入元素到有序列表。在一些情况下，这比反复排序列表或构造一个大的列表再排序的效率更高。Bisect 是二分法的意思，这里使用二分法来排序，它会将一个元素插入到一个有序列表的合适位置，这使得不需要每次调用 sort 的方式维护有序列表。

下面是一个简单的使用示例：

{% highlight python %}
import bisect
import random

random.seed(1)

print'New  Pos Contents'
print'---  --- --------'

l = []
for i in range(1, 15):
    r = random.randint(1, 100)
    position = bisect.bisect(l, r)
    bisect.insort(l, r)
    print'%3d  %3d' % (r, position), l
{% endhighlight %}

输出结果：

```
New  Pos Contents
---  --- --------
 14    0 [14]
 85    1 [14, 85]
 77    1 [14, 77, 85]
 26    1 [14, 26, 77, 85]
 50    2 [14, 26, 50, 77, 85]
 45    2 [14, 26, 45, 50, 77, 85]
 66    4 [14, 26, 45, 50, 66, 77, 85]
 79    6 [14, 26, 45, 50, 66, 77, 79, 85]
 10    0 [10, 14, 26, 45, 50, 66, 77, 79, 85]
  3    0 [3, 10, 14, 26, 45, 50, 66, 77, 79, 85]
 84    9 [3, 10, 14, 26, 45, 50, 66, 77, 79, 84, 85]
 44    4 [3, 10, 14, 26, 44, 45, 50, 66, 77, 79, 84, 85]
 77    9 [3, 10, 14, 26, 44, 45, 50, 66, 77, 77, 79, 84, 85]
  1    0 [1, 3, 10, 14, 26, 44, 45, 50, 66, 77, 77, 79, 84, 85]
```

Bisect模块提供的函数有：

- **bisect.bisect_left(a,x, lo=0, hi=len(a)) :**

查找在有序列表 a 中插入 x 的index。lo 和 hi 用于指定列表的区间，默认是使用整个列表。如果 x 已经存在，在其左边插入。返回值为 index。

- **bisect.bisect_right(a,x, lo=0, hi=len(a))**
- **bisect.bisect(a, x,lo=0, hi=len(a)) ：**

这2个函数和 bisect_left 类似，但如果 x 已经存在，在其右边插入。

- **bisect.insort_left(a,x, lo=0, hi=len(a)) ：**

在有序列表 a 中插入 x。和 a.insert(bisect.bisect_left(a,x, lo, hi), x) 的效果相同。

- **bisect.insort_right(a,x, lo=0, hi=len(a))**
- **bisect.insort(a, x,lo=0, hi=len(a)) :**

和 insort_left 类似，但如果 x 已经存在，在其右边插入。

Bisect 模块提供的函数可以分两类： `bisect*` 只用于查找 index， 不进行实际的插入；而 `insort*` 则用于实际插入。该模块比较典型的应用是计算分数等级：

{% highlight python %}
def grade(score,breakpoints=[60, 70, 80, 90], grades='FDCBA'):
    i = bisect.bisect(breakpoints, score)
    return grades[i]

print [grade(score) for score in [33, 99, 77, 70, 89, 90, 100]]
{% endhighlight %}

执行结果：

```
['F', 'A', 'C', 'C', 'B', 'A', 'A']
```

同样，我们可以用 bisect 模块实现二分查找：

{% highlight python %}
def binary_search_bisect(lst, x):
    from bisect import bisect_left
    i = bisect_left(lst, x)
    if i != len(lst) and lst[i] == x:
        return i
    return None
{% endhighlight %}

我们再来测试一下它与递归和循环实现的二分查找的性能：

```
Recursion: 4.00940990448
Loop: 2.6583480835
Bisect: 1.74922895432
```

可以看到其比循环实现略快，比递归实现差不多要快一半。

Python 著名的数据处理库 [numpy](http://www.numpy.org/) 也有一个用于二分查找的函数 [numpy.searchsorted](http://docs.scipy.org/doc/numpy-1.10.0/reference/generated/numpy.searchsorted.html#numpy.searchsorted)， 用法与 bisect 基本相同，只不过如果要右边插入时，需要设置参数 `side='right'`，例如：

```python
>>> import numpy as np
>>> from bisect import bisect_left, bisect_right
>>> data = [2, 4, 7, 9]
>>> bisect_left(data, 4)
1
>>> np.searchsorted(data, 4)
1
>>> bisect_right(data, 4)
2
>>> np.searchsorted(data, 4, side='right')
2
```

那么，我们再来比较一下性能：

```
In [20]: %timeit -n 100 bisect_left(data, 99999)
100 loops, best of 3: 670 ns per loop

In [21]: %timeit -n 100 np.searchsorted(data, 99999)
100 loops, best of 3: 56.9 ms per loop

In [22]: %timeit -n 100 bisect_left(data, 8888)
100 loops, best of 3: 961 ns per loop

In [23]: %timeit -n 100 np.searchsorted(data, 8888)
100 loops, best of 3: 57.6 ms per loop

In [24]: %timeit -n 100 bisect_left(data, 777777)
100 loops, best of 3: 670 ns per loop

In [25]: %timeit -n 100 np.searchsorted(data, 777777)
100 loops, best of 3: 58.4 ms per loop
```

可以发现 numpy.searchsorted 效率是很低的，跟 bisect 根本不在一个数量级上。因此 searchsorted 不适合用于搜索普通的数组，但是它用来搜索 [numpy.ndarray](http://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.html) 是相当快的：

```
In [30]: data_ndarray = np.arange(0, 1000000)

In [31]: %timeit np.searchsorted(data_ndarray, 99999)
The slowest run took 16.04 times longer than the fastest. This could mean that an intermediate result is being cached.
1000000 loops, best of 3: 996 ns per loop

In [32]: %timeit np.searchsorted(data_ndarray, 8888)
The slowest run took 18.22 times longer than the fastest. This could mean that an intermediate result is being cached.
1000000 loops, best of 3: 994 ns per loop

In [33]: %timeit np.searchsorted(data_ndarray, 777777)
The slowest run took 31.32 times longer than the fastest. This could mean that an intermediate result is being cached.
1000000 loops, best of 3: 990 ns per loop
```

`numpy.searchsorted` 可以同时搜索多个值：

```python
>>> np.searchsorted([1,2,3,4,5], 3)
2
>>> np.searchsorted([1,2,3,4,5], 3, side='right')
3
>>> np.searchsorted([1,2,3,4,5], [-10, 10, 2, 3])
array([0, 5, 1, 2])
```