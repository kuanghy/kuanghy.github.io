---
layout: post
title:  Python 迭代器、生成器和列表解析
keywords: python 迭代器 生成器 列表解析
category: Python
tags: python 迭代器
---

## 迭代器
迭代器是在版本 2.2 被加入 Python 的, 它为类序列对象提供了一个类序列的接口。 Python 的迭代无缝地支持序列对象, 而且它还允许迭代非序列类型, 包括用户定义的对象。即迭代器可以迭代不是序列但表现出序列行为的对象, 例如字典的 key , 一个文件的行, 等等。迭代器有以下特性：

- 提供了可扩展的迭代器接口.
- 对列表迭代带来了性能上的增强.
- 在字典迭代中性能提升.
- 创建真正的迭代接口, 而不是原来的随机对象访问.
- 与所有已经存在的用户定义的类以及扩展的模拟序列和映射的对象向后兼容
- 迭代非序列集合(例如映射和文件)时, 可以创建更简洁可读的代码.

迭代器对象要求支持迭代器协议的对象，在Python中，支持迭代器协议就是实现对象的 `__iter__()` 和 `next()` 方法。其中 \_\_iter__() 方法返回迭代器对象本身；next()方法返回容器的下一个元素，在结尾时引发 `StopIteration` 异常。

### \_\_iter\_\_() 和 next() 方法

这两个方法是迭代器最基本的方法，一个用来获得迭代器对象，一个用来获取容器中的下一个元素。对于可迭代对象，可以使用内建函数 `iter()` 来获取它的迭代器对象：

```python
li = [1, 2]
it = iter(li)
print it

print it.next()
print it.next()
print it.next()
```

结果如下所示:

<pre>
&lt;listiterator object at 0xb708aa6c>
1
2
Traceback (most recent call last):
  File "iter.py", line 21, in &lt;module>
    print it.next()
StopIteration
</pre>

list 本身是可迭代的，通过 iter() 方法可以获得其迭代器对象，然后就可以通过 next() 方法来访问 list 中的元素。当容器中没有可以访问的元素时， next() 方法将会抛出一个 StopIteration 的异常，从而终止迭代器。当我们使用for语句的时候，for语句就会自动的通过__iter__()方法来获得迭代器对象，并且通过next()方法来获取下一个元素，遇到 StopIteration 异常时会自动结束迭代。

### 自定义迭代器

自己创建迭代器实际上就是实现一个带有 \_\_iter__() 方法和 next() 方法的类，用该类创建的实例即是可迭代对象。例如我们用迭代器来实现斐波那契数列：

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

fibs = Fibs()  // 这将得到一个无穷的数列
for f in fibs:
    if f > 1000:
        print f
        break
    else:
        print f
```

这里有一个问题，大多数的序列或者类序列都不是无穷的，所以在达到一定条件后就该终止。因此我们需要在序列或者类序列需要结束时引发StopIteration异常：

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
for i in myRange:
        print i
```

### 可迭代对象和迭代器对象

可迭代对象即具有 `__iter__`() 方法的对象，该方法可获取其迭代器对象。迭代器对象即具有 `next()` 方法的对象。也就是说，一个实现了 `__iter__()` 的对象是可迭代的，一个实现了 `next()` 方法的对象则是迭代器。可迭代对象也可以是迭代器对象，如文件对象。此时可迭代对象自己有 `next()` 方法，而其`__iter__()`方法返回的就是它自己。对于许多内置对象及其派生对象，如 list、dict 等，由于需要支持多次打开迭代器，因此自己并非迭代器对象，需要用`__iter__()` 方法返回其迭代器对象，并用迭代器对象来访问其它元素。

以上例子中的 myRange 这个对象就是一个可迭代对象，同时它本身也是一个迭代器对象。对于一个可迭代对象，如果它本身又是一个迭代器对象，就会有这样一个问题，其没有办法支持多次迭代。如下所示：

```python
myRange = MyRange(3)
print myRange is iter(myRange)

print [i for i in myRange]
print [i for i in myRange]
```

运行结果：

<div class="hblock"><pre>
True
[0, 1, 2]
[]
</pre></div>

为了解决上面的问题，可以分别定义可迭代类型对象和迭代器类型对象；然后可迭代类型对象的__iter__()方法可以获得一个迭代器类型的对象。如下所示：

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

运行结果：

<div class="hblock"><pre>
False
[0, 1, 2]
[0, 1, 2]
</pre></div>

另外， **reversed()** 内建函数将返回一个反序访问的迭代器，**enumerate()** 内建函数同样也返回迭代器。例如可以用 enumerate() 函数遍历列表:

```python
ll = [1, 2, 3]
print enumerate(ll)

/* 优雅的遍历列表 */
for i, ele in enumerate(ll):
    print i, ll[i]
```

## 生成器
迭代器和生成器可能是近几年引入的最强大的两个特性。生成器是一种用普通的函数语法定义的迭代器，也就是说生成器实际上就是一个函数。但是生成器不用 return 返回，而是用 yield 一次返回一个结果，在每个结果之间挂起和继续它们的状态，来自动实现迭代协议。任何包含 yield 语句的函数称为生成器。yield 被人们优雅的称之为语法糖，意思就是包在里边的甜心。在 yield 的内部是一个状态机，维护着挂起和继续的状态。

### 生成器执行流程
先看看下边的列子：

```python
def Zrange(n):
    print "beginning of Zrange"
    i = 0
    while i < n:
        print "before yield", i
        yield i
        i += 1
        print "after yield", i

    print "endding of Zrange"

zrange = Zrange(3)
print "------------"

print zrange.next()
print "------------"

print zrange.next()
print "------------"

print zrange.next()
print "------------"

print zrange.next()def flatten(nested):
    result = []
    try:
        # 不要迭代类似字符串的对象
        try: nested + ""
        except TypeError: pass
        else: raise TypeError
        for sublist in nested:
            for element in flatten(sublist):
                result.append(element)
    except TypeError:
        result.append(nested)
    return result
print "------------"
```

执行结果：

<div class="hblock"><pre>
--------------------
beginning of Zrange
before yield 0
0
--------------------
after yield 1
before yield 1
1
--------------------
after yield 2
before yield 2
2
--------------------
after yield 3
endding of Zrange
Traceback (most recent call last):
  File "one.py", line 38, in &lt;module>
    print zrange.next()
StopIteration
</pre></div>

通过结果可以看到：

- 当调用生成器函数的时候，函数只是返回了一个生成器对象，并没有 执行。

- 当next()方法第一次被调用的时候，生成器函数才开始执行，执行到yield语句处停止

- next()方法的返回值就是yield语句处的参数（yielded value）

- 当继续调用next()方法的时候，函数将接着上一次停止的yield语句处继续执行，并到下一个yield处停止；如果后面没有yield就抛出StopIteration异常

### 递归生成器
生成器可以向函数一样进行递归使用,下面列举两个示例：

**对一个序列进行全排列：**

```python
def permutations(li):
    if len(li) == 0:
        yield li
    else:
        for i in range(len(li)):
            li[0], li[i] = li[i], li[0] #
            for item in permutations(li[1:]):
                yield [li[0]] + item

for item in permutations(range(3)):
    print item
```

这里的实现思路是，每次取序列中不一样的元素放在最前面，直到只有一个元素时返回，并将返回结果往后拼接。

**展开多层嵌套的列表：**

```python
def flatten(nested):
    try:
        # 不要迭代类似于字符串的对象
        try: nested + ""
        except TypeError: pass
        else: raise TypeError
        for sublist in nested:
            for element in flatten(sublist):
                yield element
    except TypeError:
        yield nested

print list(flatten([[[1], 2], 3, 4, [5, [6, 7]], 8]))
```

这里需要注意的是，不应该在 flatten 函数中对类似于字符串的对象进行迭代，这样会导致无穷递归，因为一个字符串的第一个元素是另一个长度为1的字符串，而长度为一个字符串的第一个元素就是字符串本身。

### 通用生成器
生成器可以人为是由两部分组成：生成器的函数和生成器的迭代器。生成器的函数是用 def 语句定义的，包含 yield 部分，生成器的迭代器是这个函数返回的部分。按照一种不是很准确的说法，两个实体经常被当做一个，合起来叫做生成器。如下实例所示：

```python
def simple_generator():
    yield 1

print simple_generator
print simple_generator()
```

运行结果：

<div class="hblock"><pre>
&lt;function simple_generator at 0xb743d79c>
&lt;generator object simple_generator at 0xb71c7be4>
</pre></div>

### 生成器方法
- send(value)

外部作用域访问生成器的 send 方法，就像访问 next() 方法一样。next()方法可以恢复生成器状态并继续执行，其实 send() 是除 next() 外另一个恢复生成器的方法。Python 2.5 中，yield 语句变成了 yield 表达式，也就是说 yield 可以有一个值，而这个值就是send()方法的参数，所以 send(None) 和 next() 是等效的。同样，next()和send()的返回值都是 yield语 句处的参数（yielded value）。使用 send() 方法只有在生成器挂起之后才有意义，如果真想对刚刚启动的生成器使用 send 方法，则可以将 None 作为参数进行调用。也就是说， **第一次调用时，要使用 next() 语句或 send(None)，因为没有 yield 语句来接收这个值**。

- throw()

用于在生成器内引发一个异常。

- close()

用于停止生成器，调用它时，会在 yield 运行出引发一个 GeneratorExit 异常。

使用示例：

```python
def Zrange(n):
    i = 0
    while i < n:
        val = yield i
        print "val is", val
        i += 1

zrange = Zrange(5)

print zrange.next()
print zrange.next()
print zrange.send("hello")
print zrange.next()
#print zrange.next()

zrange.close()

print zrange.send("world")
```

### 模拟生成器
在旧的 Python 版本中并不支持生成器，那么我们可以用普通的函数来模拟生成器。如下所示：

```python
def flatten(nested):
    result = []
    try:
        # 不要迭代类似字符串的对象
        try: nested + ""
        except TypeError: pass
        else: raise TypeError
        for sublist in nested:
            for element in flatten(sublist):
                result.append(element)
    except TypeError:
        result.append(nested)
    return result
```

尽管这个版本可能不适用于所有的生成器，但对大多数生成器来说是可行的。比如，它不适用于一个无限的生成器。

## 列表解析和生成器表达式

### 列表解析
**列表解析**( List comprehensions, 或缩略为 list comps ) 来自函数式编程语言 Haskell . 它是一个非常有用, 简单, 而且灵活的工具, 可以用来动态地创建列表。其语法结构为：

> [expr for iter_var in iterable]

这个语句的核心是 for 循环, 它迭代 iterable 对象的所有条目. 前边的 expr 应用于序列的每个成员, 最后的结果值是该表达式产生的列表。 迭代变量并不需要是表达式的一部分。例如用 lambda 函数计算序列成员的平方的表达是为：

> map(lambda x: x ** 2, range(6))

这可以用列表解析来改写：

> [x ** 2 for x in range(6)]

列表解析的表达式可以取代内建的 map() 函数以及 lambda , 而且效率更高。结合 if 语句，列表解析还提供了一个扩展版本的语法：

> [expr for iter_var in iterable if cond_expr]

这个语法在迭代时会过滤/捕获满足条件表达式 cond_expr 的序列成员。例如挑选出序列中的奇数可以用下边的方法:

> [x for x in seq if x % 2]

列表解析还有很多巧妙的应用：

**迭代一个有三行五列的矩阵:**

> [(x+1,y+1) for x in range(3) for y in range(5)]

**计算出所有非空白字符的数目:**

> f = open('hhga.txt', 'r')

> len([word for line in f for word in line.split()])


### 生成器表达式
生成器表达式是列表解析的一个扩展。列表解析的一个不足就是必要生成所有的数据, 用以创建整个列表。这可能对有大量数据的迭代器有负面效应。生成器表达式通过结合列表解析和生成器解决了这个问题。生成器表达式在 Python 2.4 被引入, 它与列表解析非常相似，而且它们的基本语法基本相同; 不过它并不真正创建数字列表, 而是**返回一个生成器**，这个生成器在每次计算出一个条目后，把这个条目“产生”(yield)出来。生成器表达式使用了"延迟计算"(lazy evaluation), 所以它在使用内存上更有效。生成器表达式语法:

> (expr for iter_var in iterable if cond_expr)

生成器并不会让列表解析废弃, 它只是一个内存使用更友好的结构, 基于此, 有很多使用生
成器地方，如下所示：

**快速地计算文件大小:**

上面我们用列表解析计算出了文件中非空白字符的数目，那么只要用 sum() 函数对每个单词的长度求和，则可大致计算出文件的大小。sum() 函数的参数不仅可以是列表，还可以是可迭代对象,比如生成器表达式。这里我们用生成器表达式改写整个过程：

> sum(len(word) for line in data for word in line.split())

**交叉配对：**

生成器表达式就好像是懒惰的列表解析(这反而成了它主要的优势)。它还可以用来处理其他列表或生成器：

```python
rows = [1, 2, 3, 17]

def cols(): # example of simple generator
    yield 56  
    yield 2  
    yield 1

x_product_pairs = ((i, j) for i in rows for j in cols())

for pair in x_product_pairs:
	print pair
```

**寻找文件最长的行：**

```python
def longest(filename):
    glines = (x.strip() for x in open(filename))
    return max([len(l) for l in glines])

# Script starts from here

if __name__ == "__main__":
    print longest("/etc/hosts")
```

这个例子摘自 《Python核心编程》 中生成器表达式一节，作者在原书中只用了一行代码来实现这个功能，即：

> return max(len(x.strip()) for x in open('/etc/motd'))

这行代码会报出如下错误：

<div class="hblock"><pre>
TypeError: object of type 'generator' has no len()
</pre></div>

也就是说生成器没有 len() 方法，所以这样并不可行，但是用列表解析则可以用一行实现：

> return max([len(x.strip()) for x in open("/etc/motd")])
