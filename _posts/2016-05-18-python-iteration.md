---
layout: post
title: "对 Python 迭代的深入研究"
keywords: 迭代 iterable iterator
description: "一个实现了 __iter__() 方法的对象是可迭代的，一个实现了 next() 方法的对象则是迭代器。"
category: Python
tags: python 迭代器
---

在程序设计中，通常会有 loop、iterate、traversal 和 recursion 等概念，他们各自的含义如下：

- 循环（loop），指的是在满足条件的情况下，重复执行同一段代码。比如 Python 中的 while 语句。
- 迭代（iterate），指的是按照某种顺序逐个访问列表中的每一项。比如 Python 中的 for 语句。
- 递归（recursion），指的是一个函数不断调用自身的行为。比如，以编程方式输出著名的斐波纳契数列。
- 遍历（traversal），指的是按照一定的规则访问树形结构中的每个节点，而且每个节点都只访问一次。

在其他语言中，for 与 while 都用于循环，而 Python 则没有类似其他语言的 for 循环，只有 while 来实现循环。在 Python 中， for 用来实现迭代，它的结构是 `for ... in ...`，其在迭代时会产生迭代器，实际是将可迭代对象转换成迭代器，再重复调用 next() 方法实现的。

这里提到两个概念：`可迭代对象`、`迭代器`。本文的主要目的就是研究这两者的区别与联系，同时还讨论与之相关的一些内容。

![relationships](http://ww4.sinaimg.cn/mw690/c3c88275gw1f3zbjmfejfj20zc0fytay.jpg)

## 可迭代对象（Iterable）

可迭代对象具有`__iter__` 方法，用于返回一个迭代器，或者定义了 `__getitem__` 方法，可以按 index 索引的对象（并且能够在没有值时抛出一个 IndexError 异常），因此，可迭代对象就是能够通过它得到一个迭代器的对象。所以，可迭代对象都可以通过调用内建的 **iter()** 方法返回一个迭代器。

可迭代器对象具有如下的特性：

- 可以 for 循环: for i in iterable；
- 可以按 index 索引的对象，也就是定义了 `__getitem__` 方法，比如 list,str;
- 定义了`__iter__` 方法，可以随意返回；
- 可以调用 iter(obj) 的对象，并且返回一个iterator。

可以通过`isinstance(obj,  collections.Iterable)` 来判断对象是否为可迭代对象。

## 迭代器对象（Iterator）

迭代器对象是一个含有 `next (Python 2)` 或者 `__next__ (Python 3)` 方法的对象。如果需要自定义迭代器，则需要满足如下迭代器协议：

- 定义了`__iter__` 方法，但是必须返回自身
- 定义了 next 方法,在 python3.x 是 `__next__`。用来返回下一个值，并且当没有数据了，抛出 `StopIteration`
- 可以保持当前的状态

可以通过 `isinstance(obj, collections.Iterator)` 来判断对象是否为迭代器。

**用一句来总结就是，一个实现了 `__iter__()` 方法的对象是可迭代的，一个实现了 `next()` 方法的对象则是迭代器。**

## 可迭代对象和迭代器的分开自定义

使用迭代器时，需要注意的一点是：

> 迭代器只能迭代一次，每次调用调用 next() 方法就会向前一步，不能回退，只能如过河的卒子，不断向前。另外，迭代器也不适合在多线程环境中对可变集合使用。

示例：

```python
class MyRange(object):
    def __init__(self, n):
        self.idx = 0
        self.n = n

    def __iter__(self):
        return self

    def next(self):
        if self.idx < self.n:
            val = self.idx
            self.idx += 1
            return val
        else:
            raise StopIteration()

myRange = MyRange(3)

print [i for i in myRange]
print [i for i in myRange]
```

运行结果：

```
True
[0, 1, 2]
[]
```

也就是说一个迭代器无法多次使用。为了解决这个问题，可以将可迭代对象和迭代器分开自定义：

```python
class Zrange:
    def __init__(self, n):
        self.n = n

    def __iter__(self):
        return ZrangeIterator(self.n)

class ZrangeIterator:
    def __init__(self, n):
        self.i = 0
        self.n = n

    def __iter__(self):
        return self

    def next(self):
        if self.i < self.n:
            i = self.i
            self.i += 1
            return i
        else:
            raise StopIteration()

zrange = Zrange(3)
print zrange is iter(zrange)

print [i for i in zrange]
print [i for i in zrange]
```

## for 语句原理

在 python 中， `for` 语句用于迭代，而 while 语句才是用于真正的循环。它们的意义已完全不同，且有着明显的分工。循环可以通过增加条件跳过不需要的元素，而迭代则只能一个一个的往后取数据。迭代有一个固定的格式，即 `for ... in ...`。

在 for 语句内部，实际是通过调用 `iter()` 方法将可迭代对象转换成迭代器，然后再重复调用 next() 方法实现的。for 语句会自动捕获 `StopIteration` 异常，并在捕获异常后终止迭代。所以，对容器对象调用 iter() 方法再使用 for 语句是多余的。也就是如下的使用方法是不必要的：

```
for i in iter(<list, tuple, set, dict>)
```

例如运行如下代码：

```
x = [1, 2, 3]
for i in x:
    ...
```

那么，实际的运行情况是这样的：

![for](http://wx2.sinaimg.cn/mw690/c3c88275gy1fgdti6lv8lj20wg0au0sw.jpg)

将类似于以上的代码反编译一下：

```
>>> import dis
>>> def foo():
...     for i in [1, 2, 3]:
...         print i
...
>>> dis.dis(foo)
  4           0 SETUP_LOOP              28 (to 31)
              3 LOAD_CONST               1 (1)
              6 LOAD_CONST               2 (2)
              9 LOAD_CONST               3 (3)
             12 BUILD_LIST               3
             15 GET_ITER
        >>   16 FOR_ITER                11 (to 30)
             19 STORE_FAST               0 (i)

  5          22 LOAD_FAST                0 (i)
             25 PRINT_ITEM
             26 PRINT_NEWLINE
             27 JUMP_ABSOLUTE           16
        >>   30 POP_BLOCK
        >>   31 LOAD_CONST               0 (None)
             34 RETURN_VALUE
```

可以看到有一个 GET_ITER 指令，这就相当于调用 iter 方法将可迭代对象转化为迭代器，然后再不断调用 next 方法来访问元素，直到 StopIteration 异常发生。

## 生成器与迭代器的关系

生成器(generator)是一个特殊的迭代器，它的实现更简单优雅。`yield` 是生成器实现 `__next__()` 方法的关键。它作为生成器执行的暂停恢复点，可以对 yield 表达式进行赋值，也可以将 yield 表达式的值返回。任何包含 yield 语句的函数被称为生成器。

既然生成器是一个迭代器，而生成器又是一个包含 yield 语句的函数，同时调用可迭代对象的 `__iter__` 方法时需要返回一个迭代器，那么就可以将 `__iter__` 方法变成一个生成器，从而方便的获得一个迭代器。也就是在 `__iter__` 方法中使用 yield 语句：

```python
class Zrange:
    def __init__(self, n):
        self.i = 0
        self.n = n

    def __iter__(self):
        while self.i < self.n:
            yield self.i
            self.i += 1
```

当然，这样实现的迭代器仍然只能使用一次。为了得到一个可以重复使用的迭代器，可以采用可迭代对象和迭代器的分开自定义方式，同时使用生成器：

```python
class Zrange:
    def __init__(self, n):
        self.n = n

    def __iter__(self):
        return self.__generator()

    def __generator(self):
        i = 0
        while i < self.n:
            yield i
            i += 1

zrange = Zrange(10)
print [i for i in zrange]
print [i for i in zrange]
```

## 惰性计算

创建生成器的方式除了使用 yield 语句外，还有一种方式就是使用生成器表达式。生成器表达式有一个特点，就是**惰性计算**。即：

> 生成器表达式只有在被检索时候，才会被赋值。

惰性计算这个特点很有用

> 惰性计算想像成水龙头，需要的时候打开，接完水了关掉，这时候数据流就暂停了，再需要的时候再打开水龙头，这时候数据仍是接着输出，不需要从头开始循环.

来看一个例子：

```
def add(s, x):
    return s + x

def gen():
    for  i in range(4):
        yield i

base = gen()
for n in [1, 10]:
    base = (add(i, n) for i in base)

print list(base)
```

结果输出是 `[20,21,22,23]`。很多人可能会想不明白，这里确实也很难理解，主要是因为生成器惰性计算的原因。生成器 base 在最后 list(base) 时被检索，此时生成器被赋值并开始计算。但此时 base 生成器一共被创建了三次，而且 n=10，这里注意 `add(i+n)` 绑定的是 n 这个变量而不是它当时的值（因为生成器在被检索时被赋值）。这样，首先通过 gen() 得到 (0, 1, 2, 3)，然后是第一次循环得到 (10 + 0, 10 + 1, 10 + 2, 10 +3)，最后是第二次循环得到 (10 + 10, 11 + 10, 12 + 10, 13 + 10)。

这里可以用管道的思路来理解这个例子。首先 gen() 函数是第一个生成器，下一个是第一次循环的 base = (add(i, n) for i in base)， 最后一个生成器是第二次循环的 base = (add(i, n) for i in base)。这样就相当于三个管道依次连接，但是水(数据)还没有流过，现在到了 list(base)，就相当于驱动器，打开了水的开关，这时候，按照管道的顺序，由第一个产生一个数据，yield 0，然后第一个管道关闭。之后传递给第二个管道就是第一次循环,此时执行了add(0, 10)，然后水继续流，到第二次循环，再执行add(10, 10),此时到管道尾巴了，此时产生了第一个数据20，然后第一个管道再开放：yield 1， 流程跟上面的一样，依次产生21,22,23；直到没有数据。

上面的例子就类似与下面这样的简单写法：

```python
def gen():
    for i in range(4):
        yield i  #  第一个管道

base = (add(i, 10) for i in base) #  第二个管道
base = (add(i, 10) for i in base) #  第三个管道

list(base) #  开关驱动器
```

可以在 [http://pythontutor.com/](http://pythontutor.com/) 上演示程序的执行过程。

## 迭代器节省内存的真相

迭代器能够很好的节能内存，这是因为它不必一次性将数据全部加载到内存中，而是在需要的时候产生一个结果。这在数据量的时候是非常有用的。

有如下示例：

```python
l = range(100000000)

for i in l:
    pass
```

这个例子只是去遍历一个超大的列表，并没有做其他任何多余的操作。但是，在我的机器上运行时内存已经被占满，而且系统几乎卡死。但如果使用迭代器结果就不一样了：

```python
l = xrange(100000000)

for i in l:
    pass
```

这样修改后程序只在 4s 左右就执行完成了，并且对系统没有任何影响。

但是，需要注意的一点是：**并非所有的迭代器都能很好的节省内存**。例如：

```python
l = range(100000000)

for i in iter(l):
    pass
```

这里虽然在迭代时把列表转化成了迭代器，但是所有的数据已经放在内存中，并不会带来任何的效益。

所以，并不是所有的迭代器都能节省内存，只有那些在需要时才产生一个结果的迭代器才有节省内存的特性。

## 迭代器速度

有听说迭代器的速度比列表、元组等容器对象快，这个说法太绝对，我也没有找到一个有力的证据证明迭代器总是比容器对象快。但在某些情况下，迭代器的效率确实会高些，容器对象需要把所有的数据加载到内存中，而读写内存也要消耗时间。因此，在某些情况下，速度会比较快。但是，要明白一点，**不是所有的迭代器都能节省内存**。

说到速度，这里提一点：在 python 中， `map`和`列表解析`要比手动的 for 运行更快，而且更加精简、优雅。因为他们的迭代在解析器内部是以 C 语言的速度执行的，而不是以手动 python 代码执行的，特别对于较大的数据集合，这也是使用 map 函数和列表解析的一个主要的性能优点。但需要注意的一点是，在 python3 之后，map 函数不再返回一个 list，而是返回一个迭代器。

## 参考资料

- [https://segmentfault.com/a/1190000004554823](https://segmentfault.com/a/1190000004554823)
- [http://blog.mimvp.com/2015/02/python-iterator-implementation-principle/](http://blog.mimvp.com/2015/02/python-iterator-implementation-principle/)
- [http://platinhom.github.io/2015/09/07/PyIterator/](http://platinhom.github.io/2015/09/07/PyIterator/)
- [https://docs.python.org/3/tutorial/classes.html#iterators](https://docs.python.org/3/tutorial/classes.html#iterators)
- [http://nvie.com/posts/iterators-vs-generators/](http://nvie.com/posts/iterators-vs-generators/)
- [What exactly are Python's iterator, iterable, and iteration protocols?](http://stackoverflow.com/questions/9884132/what-exactly-are-pythons-iterator-iterable-and-iteration-protocols)
