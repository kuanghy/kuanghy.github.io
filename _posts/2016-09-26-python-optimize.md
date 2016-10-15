---
layout: post
title: "Python 性能优化技巧"
keywords: Python 性能优化 cpython ctypes pypy numpy
description: "Python 属于解释性语言，性能上可能不是很理想，所以使用 Python 时要注意使用一些效率更高的技巧，以使程序的性能更好"
category: Python
tags: Python
---

Python 属于解释性语言，性能上可能不是很理想，所以使用 Python 时要注意使用一些效率更高的技巧，以使程序的性能更好。

### 使用性能分析工具

- timeit

- profile、cProfile

- memory_profiler

- hotshot

### 使用 C 扩展(Extension)

目前主要有 CPython(python 最常见的实现方式) 原生 API, ctypes, Cython，cffi 三种方式，它们的作用是使得 Python 程序可以调用由 C 编译成的动态链接库，其特点分别是：

- CPython 原生 API:

通过引入 Python.h 头文件，对应的 C 程序中可以直接使用 Python 的数据结构。实现过程相对繁琐，但是有比较大的适用范围。

- ctypes:

通常用于封装(wrap) C 程序，让纯 Python 程序调用动态链接库（Windows 中的dll 或 Unix 中的 so 文件）中的函数。如果想要在 python 中使用已经有的 C 类库，使用 ctypes 是很好的选择，在一些基准测试下，`python2+ctypes` 是性能最好的方式。

- Cython:

Cython 是 CPython 的超集，用于简化编写 C 扩展的过程。Cython 的优点是语法简洁，可以很好地兼容 numpy 等包含大量 C 扩展的库。Cython 的使得场景一般是针对项目中某个算法或过程的优化。在某些测试中，可以有几百倍的性能提升。

- cffi:

cffi 是 ctypes 在 pypy 中的实现，同时也兼容 CPython。cffi 提供了在 python 使用C类库的方式，可以直接在 python 代码中编写 C 代码，同时支持链接到已有的 C 类库。

使用这些优化方式一般是针对已有项目性能瓶颈模块的优化，可以在少量改动原有项目的情况下大幅度地提高整个程序的运行效率。

### 优化算法时间复杂度

算法的时间复杂度对程序的执行效率影响最大，在 Python 中可以通过选择合适的数据结构来优化时间复杂度，如 list 和 set 查找某一个元素的时间复杂度分别是O(n)和O(1)。不同的场景有不同的优化方式，总得来说，一般有分治，分支界限，贪心，动态规划等思想。

### 使用效率高的 C 语言实现

使用 cProfile, cStringIO 和 cPickle 等用 c 实现相同功能（分别对应profile, StringIO, pickle）的包。

### 加上 -O 选项

Python 的命令行选项 `-O` 用于在执行前对解释器产生的字节码进行优化, 效果同设置环境变量 `PYTHONOPTIMIZE=1` 一样。加上该选项可以让程序的加载速度更快, 同时节省内存。

- **-O** 将源码编译为 pyo 而不是 pyc, pyo 文件比 pyc 小, 理论上加载速度快些, 注意是加载速度而不是执行速度
- **-OO** 在 -O 基础上再删除 assert 语句和 docstring, 注意一些模块可能依赖这些语句, 所以要谨慎使用该选项

### 使用最佳的反序列化方式

`json` 比 cPickle 快近 3 倍，比 eval（用于执行外部 python 代码） 快 20 多倍。

### 合理使用 copy 与 deepcopy

对于 dict 和 list 等数据结构的对象，直接赋值使用的是引用的方式。而有些情况下需要复制整个对象，这时可以使用 copy 包里的 copy 和 deepcopy，这两个函数的不同之处在于后者是递归复制的。

### 使用 dict 或 set 查找元素

Python dict 和 set 都是使用 hash 表来实现(类似 c++11 标准库中unordered_map)，查找元素的时间复杂度是O(1):

```python
In [9]: l = range(100000)

In [10]: s = set(l)

In [11]: d = {k: None for k in l}

In [12]: %timeit -n 100000 999 in l
100000 loops, best of 3: 8.93 µs per loop

In [13]: %timeit -n 100000 999 in s
100000 loops, best of 3: 115 ns per loop

In [14]: %timeit -n 100000 999 in d
100000 loops, best of 3: 63 ns per loop
```

可以看出 dict 的效率略高，但是其占用的空间也多一些。

### 优化包含多个判断表达式的顺序

对于 `and`，应该把满足条件少的放在前面，对于 `or`，把满足条件多的放在前面。

### 使用级联比较 x < y < z

使用 `a > x > b`, 而不是 `a > x and x > b`，因为 `a > x > b` 的效率略高，而且可读性更好。

### 使用 join 合并的字符串

字符串方法 join 可以合并 list、tuple、iterator 中的元素，效率比连接符 + 高。

### 使用解包方式交换变量值

不借助中间变量交换两个变量的值, a, b = b, a

### 用位运算判断奇偶性

```python
def is_even(x):
    return False if x & 1 else True
```

### 使用 `if is`

使用 `if x is True` 比 `if x == True` 将近快一倍。

### 使用 `while 1`

使用 `while 1` 比 `while True` 更快！

### 使用 ** 而不是 pow

`**` 比 pow 快 10 倍以上！

### 使用迭代器

使用迭代器和生成器代替列表等数据结构效率更高，使用列表（字典）解析式和生成器表达式比用循环效率更高。

### 尽量使用局部变量

Python 检索局部变量比检索全局变量快. 这意味着,避免 "global" 关键字.

### 尽量使用 "in"

使用 "in" 关键字. 简洁而快速.

### 使用延迟加载加速

將 `import` 声明移入函数中,仅在需要的时候导入. 换句话说，如果某些模块不需马上使用,稍后导入他们. 例如，你不必在一开使就导入大量模块而加速程序启动. 该技术不能提高整体性能. 但它可以帮助你更均衡的分配模块的加载时间.

### 使用 xrange() 处理长序列：

这样可为你节省大量的系统内存，因为 xrange() 在序列中每次调用只产生一个整数元素。而相反 range()，它將直接给你一个完整的元素列表，用于循环时会有不必要的开销。 在 Python3 中 xrange 被去掉，而 range 则相当于 python2 的 xrange。

### 了解 itertools 模块：

模块 [itertools](https://docs.python.org/3.5/library/itertools.html?highlight=itertools#module-itertools) 对迭代和组合是非常有效的。

### 学习 bisect 模块保持列表排序：

这是一个二分查找实现和快速插入有序序列的工具。该模块能将一个元素插入列表中, 而你不需要再次调用 sort() 来保持容器的排序, 因为在长序列中这会非常昂贵.

### 理解 Python 列表，实际上是一个数组：

Python 中的列表实现并不是以人们通常谈论的计算机科学中的普通单链表实现的。Python 中的列表是一个数组。也就是说，你可以以常量时间 O(1) 检索列表的某个元素，而不需要从头开始搜索。这有什么意义呢？ Python开发人员使用列表对象 insert() 时, 需三思. 例如：list.insert（0，item）

在列表的前面插入一个元素效率不高, 因为列表中的所有后续下标不得不改变. 然而，您可以使用list.append()在列表的尾端有效添加元素。 如果你想快速的在两插入或时，可以使用 deque。它是快速的，因为在 Python 中的 deque 用双链表实现。

### Python 装饰器缓存结果：

`@` 符号是 Python 的装饰语法。它不只用于追查，锁或日志。你可以装饰一个 Python 函数，记住调用结果供后续使用。这种技术被称为 memoization 的。例如 functools.lru_cache 就是一个用于缓存数据的装饰器，他会将传入函数的不同的参数产生的结果进行保存，也就是对每一个输入进行缓存，下次调用则直接返回缓存结果。

### 使用 multiprocessing 模块实现真正的并发

因为 `GIL` 会序列化线程, Python 中的多线程不能在多核机器和集群中加速. 因此 Python 提供了 multiprocessing 模块, 可以派生额外的进程代替线程, 跳出 GIL 的限制. 此外, 你也可以在外部 C 代码中结合该建议, 使得程序更快.

注意, 进程的开销通常比线程昂贵, 因为线程自动共享内存地址空间和文件描述符. 意味着, 创建进程比创建线程会花费更多, 也可能花费更多内存. 这点在计划使用多处理器时要牢记.

### 使用第三方包

有很多为 Python 设计的高性能的第三方库和工具. 下面是一些有用的加速包的简短列表.

- NumPy: 一个开源的相当于 MatLab 的包
- SciPy: 另一个数值处理库
- GPULib: 使用 GPUs 加速代码
- PyPy: 使用 just-in-time 编译器优化 Python 代码
- Cython: 將 Python 优码转成 C
- ShedSkin: 將 Python 代码转成 C++

## 参考资料

- [http://python.jobbole.com/81956/](http://python.jobbole.com/81956/)