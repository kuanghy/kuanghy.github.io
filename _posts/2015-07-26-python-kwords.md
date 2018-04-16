---
layout: post
title: Python 函数参数与可变长参数
category: Python
keywords: Python 可变参数
tags: python
---

Python属于弱类型的语言，它的函数参数定义不需要说明数据类型，直接指定参数名即可。如下例子所示：

```python
def foo(a, b):
    print a
    print b
```

Python支持**默认参数**，即给参数指定默认值，如果在函数调用时没给该参数指定任何值，则会采用默认参数值：

```python
def foo(message, times = 1):
    print message * times

foo("Hello")
foo("Hello", 1)
```

上边例子中的两个函数调用输出结果是一样的。需要注意的一点是：**只有在形参表末尾的那些参数可以有默认参数值，即你不能在声明函数形参的时候，先声明有默认值的形参而后声明没有默认值的形参。这是因为赋给形参的值是根据位置而赋值的。例如，def func(a, b=5)是有效的，但是def func(a=5, b)是 无效 的。 **

在 Python 中，可以通过参数名来给函数传递参数，而不用关心参数列表定义时的顺序，这被称之为**关键参数**。使用关键参数有两个 优势 ：一，由于我们不必担心参数的顺序，使用函数变得更加简单了。二、假设其他参数都有默认值，我们可以只给我们想要的那些参数赋值。示例：

```python
def foo(a, b, c = 5, d = 10):
    print a
    print b
    print c
    print d

foo(1, 2)
print "------ split ------"
foo(1, 2, 100)
print "------ split ------"
foo(c = 10, b = 4, a = 2)
print "------ split ------"
foo(d = 100, c = 10, b = 5, a = 1)
```

有时我们在设计函数接口的时候，可会需要可变长的参数。也就是说，我们事先无法确定传入的参数个数。Python提供了一种元组的方式来接受没有直接定义的参数。这种方式即是在参数前边加`“*”`。例如：

```python
def foo(a, b, *c):
    print a
    print b
    print "length of c is: %d " % len(c)
    print c

foo(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
```

程序执行结果：

<div class="hblock"><pre>
1
2
length of c is: 8
(3, 4, 5, 6, 7, 8, 9, 10)
</pre></div>

从例子可以看到，最前边的两个参数被 a, b 接受，剩下的参数全部被放到了元组 c 里。

在 Python 中，可变长参数也支持关键参数，没有被定义的关键参数会被放到一个字典里。这种方式即是在参数前边加`“**”`。示例：

```python
def foo(a, **b):
    print a
    for x in b:
        print "%s: %s" % (x, str(b[x]))

foo(100, name = "huoty", age = "24", addr = "beijing.haidian")
```

最后来一个终极的例子：

```python
def foo(aa, *args, **kwargs):
    print aa
    print "------- split -------"
    print args
    print "------- split -------"
    print kwargs

foo(1, 2, 3, x = 4, y = 5, *[1, 2, 3], **{'a':1,'b': 2})
```

运行结果：

<div class="hblock"><pre>
1
------- split -------
(2, 3, 1, 2, 3)
------- split -------
{'a': 1, 'y': 5, 'b': 2, 'x': 4}
</pre></div>

<br/>
### 总结
**1：**函数在接收参数事，先将非变长参数赋值完毕，再分配变长参数

**2：**元组和字典参数仅仅是被调函数中最终接收的元组和字典的子集，额外的非关键字及关键字也会分别被包含在最终的元组与字典当中

**3：**元组和字典参数的位置位于最后且字典参数在元组参数后面，非元组与字典参数中，非关键字参数一定要排在关键字参数前面
