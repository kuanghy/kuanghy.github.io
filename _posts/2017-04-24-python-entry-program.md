---
layout: post
title: "Python 中的 if __name__ == '__main__' 该如何理解"
keywords: __name__ __main__ 入口程序 程序入口 模块名 包结构
description: "如果模块是被直接运行的，则代码块被运行，如果模块是被导入的，则代码块不被运行"
category: Python
tags: python
---

这个问题来自于[知乎](https://www.zhihu.com/)用户的[提问](https://www.zhihu.com/question/49136398)，当时看到这个问题，我只是做了下简单的回答。后来我发现，对于很多人来说，更准确的说应该是大部分的 Python 初学者，对这个问题理解的不是很深刻。所以这里我来做下总结，并试图把这个问题说明白。

## 程序入口

对于很多编程语言来说，程序都必须要有一个入口，比如 C，C++，以及完全面向对象的编程语言 Java，C# 等。如果你接触过这些语言，对于程序入口这个概念应该很好理解，C 和 C++ 都需要有一个 main 函数来作为程序的入口，也就是程序的运行会从 main 函数开始。同样，Java 和 C# 必须要有一个包含 Main 方法的主类来作为程序入口。

而 Python 则有不同，它属于脚本语言，不像编译型语言那样先将程序编译成二进制再运行，而是动态的逐行解释运行。也就是从脚本第一行开始运行，没有统一的入口。

一个 Python 源码文件除了可以被直接运行外，还可以作为模块（也就是库）被导入。不管是导入还是直接运行，最顶层的代码都会被运行（Python 用缩进来区分代码层次）。而实际上在导入的时候，有一部分代码我们是不希望被运行的。

举一个例子来说明一下，假设我们有一个 const.py 文件，内容如下：

```python
PI = 3.14

def main():
    print "PI:", PI

main()
```

我们在这个文件里边定义了一些常量，然后又写了一个 main 函数来输出定义的常量，最后运行 main 函数就相当于对定义做一遍人工检查，看看值设置的都对不对。然后我们直接执行该文件(python const.py),输出：

```python
PI: 3.14
```

现在，我们有一个 area.py 文件，用于计算圆的面积，该文件里边需要用到 const.py 文件中的 PI 变量，那么我们从 const.py 中把 PI 变量导入到 area.py 中：

```python
from const import PI

def calc_round_area(radius):
    return PI * (radius ** 2)

def main():
    print "round area: ", calc_round_area(2)

main()
```

运行 area.py，输出结果：

```
PI: 3.14
round area:  12.56
```

可以看到，const 中的 main 函数也被运行了，实际上我们是不希望它被运行，提供 main 也只是为了对常量定义进行下测试。这时，`if __name__ == '__main__'` 就派上了用场。把 const.py 改一下：

```python
PI = 3.14

def main():
    print "PI:", PI

if __name__ == "__main__":
    main()
```

然后再运行 area.py，输出如下：

```
round area:  12.56
```

再运行下 const.py，输出如下：

```python
PI: 3.14
```

这才是我们想要的效果。

`if __name__ == '__main__'` 就相当于是 Python **模拟的程序入口**。Python 本身并没有规定这么写，这只是一种编码习惯。由于模块之间相互引用，不同模块可能都有这样的定义，而入口程序只能有一个。到底哪个入口程序被选中，这取决于 `__name__` 的值。

## \_\_name__

`__name__` 是内置变量，用于表示当前模块的名字，同时还能反映一个包的结构。来举个例子，假设有如下一个包：

```
a
├── b
│   ├── c.py
│   └── __init__.py
└── __init__.py
```

目录中所有 py 文件的内容都为：

```
print __name__
```

我们执行 `python -c "import a.b.c"`，输出结果：

```
a
a.b
a.b.c
```

由此可见，`__name__` 可以清晰的反映一个模块在包中的层次。其实，所谓模块名就是 import 时需要用到的名字，例如：

```python
import tornado
import tornado.web
```

这里的 tornado 和 tornado.web 就被称为模块的模块名。

如果一个模块被直接运行，则其没有包结构，其 `__name__` 值为 `__main__`。例如在上例中，我们直接运行 c.py 文件（python a/b/c.py），输出结果如下：

```python
__main__
```

所以，`if __name__ == '__main__'` 我们简单的理解就是： **如果模块是被直接运行的，则代码块被运行，如果模块是被导入的，则代码块不被运行**。

实际上，这个问题还可以衍生出其他的一些知识点，例如 `__main__.py` 文件与 Python 的 `-m` 参数。

## \_\_main__.py 文件与 python -m

Python 的 `-m` 参数用于将一个模块或者包作为一个脚本运行，而 `__main__.py` 文件则相当于是一个包的”入口程序“。

首先我们需要来看看 `python xxx.py` 与 `python -m xxx.py` 的区别。两种运行 Python 程序的方式的不同点在于，一种是直接运行，一种是当做模块来运行。

先来看一个简单的例子，假设有一个 Python 文件 run.py，其内容如下：

```python
import sys
print sys.path
```

我们用直接运行的方式启动（python run.py），输出结果(为了说明问题，输出结果只截取了重要部分，下同)：

```python
['/home/huoty/aboutme/pythonstudy/main', ...]
```

然后以模块的方式运行（python -m run.py）:

```python
['', ...]
/usr/bin/python: No module named run.py
```

由于输出结果只列出了关键的部分，应该很容易看出他们之间的差异。直接运行是把 run.py 文件所在的目录放到了 sys.path 属性中。以模块方式运行是把你输入命令的目录（也就是当前工作路径），放到了 sys.path 属性中。以模块方式运行还有一个不同的地方是，多出了一行 `No module named run.py` 的错误。实际上以模块方式运行时，Python 先对 run.py 执行一遍 import，所以 `print sys.path` 被成功执行，然后 Python 才尝试运行 run.py 模块，但是，在 path 变量中并没有 run.py 这个模块，所以报错。而正确的运行方式，应该是 `python -m run`.

这个例子并不能明显的说明问题。接着我们来看看 `__main__.py` 的作用。

仍然先看例子，有如下一个包：

```
package
├── __init__.py
└── __main__.py
```

- \_\_init__.py

```python
import sys
print "__init__"
print sys.path
```

- \_\_main__.py

```python
import sys
print "__main__"
print sys.path
```

用 `python -m package` 运行结果：

```
__init__
['', ...]
__main__
['', ...]
```

用 `python package` 运行结果：

```
__main__
['package', ...]
```

然后我们来总结一下：

- 1、 **加上 -m 参数时会把当前工作目录添加到 sys.path 中，而不加时则会把脚本所在目录添加到 sys.path 中**。
- 2、 **加上 -m 参数时 Python 会先将模块或者包导入，然后再执行**
- 3、 **\_\_main__.py 文件是一个包或者目录的入口程序。**不管是用 `python package` 还是用 `python -m package` 运行时，\_\_main__.py 文件总是被执行。

## 后序

我试图使用长篇大论来阐述，在 Python 中如何理解 `if __name__ == '__main__'` 这个问题，不知道我有没有描述得足够的明白。Python 的确是简单的，优雅的，但也有很多问题是不太容易理解的，例如很多高级的特性，像元类、生成器表达式、描述符、协程等。Python 并没有在太多的地方规定要如何如何，很多的用法只是惯用法，例如 self 和本文讨论的内容。这些用法或是为了让代码看起来更优雅，或是前人的经验。使用 Python 是有无限可能的，你可以写出很多简洁优雅的代码。

## 参考资料

- [http://www.tuicool.com/articles/jMzqYzF](http://www.tuicool.com/articles/jMzqYzF)
- [http://stackoverflow.com/questions/4042905/what-is-main-py](http://stackoverflow.com/questions/4042905/what-is-main-py)
