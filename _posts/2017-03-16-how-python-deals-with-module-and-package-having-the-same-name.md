---
layout: post
title: "Python 如何处理模块和包有相同名字的情况"
keywords: Python 模块 包 导入 规范
description: "How python deals with module and package having the same name?"
category: Python
tags: Python
---

在编程开发中，个人觉得，只要按照规范去做，很少会出问题。刚开始学习一门技术时，的确会遇到很多的坑。踩的坑多了，这是好事，会学到更多东西，也会越来越觉得按照规范做的重要性，规范的制定就是用来规避问题的。有时候确实应该听听有经验人的建议，不要一意孤行。这好像不是本文的重点，其实我重点是想表达，**尽量按规范做事，这样会少走很多弯路**。

我现在使用的主力编程语言是 Python，在接触 Python 至今，我感觉我踩的坑还是极少的，基本上没有遇到什么奇怪的问题。实际上，这并不是一件好事，不踩坑，很多躺在暗处的知识点你不会了解，所以也很难成长。幸好，有一些会踩坑的同事。

一同事问我，在 Python 中，如果一个模块和一个包同名时，是不是只能导入包，如果要导入模块该怎么办。他的意思大概是这样的，在项目的同一级目录下，有一个 `foo.py` 文件和一个 `foo/` 目录，如果 `import foo` 会导入 `foo/` 的内容而不是 `foo.py` 的内容。

被问到这个问题时，我首先感觉到的是诧异，这明显是存在歧义的。如果是我，肯定不会把模块名和包名设计成一样的名字，因为本质上来说在导入的时候没法区分到底要导入谁。除非系统有特别的规定，例如，规定这种情况只能导入包。

我的潜意识里认为这里应该报错，Python 解释器不知道要导入谁。但是，同事告诉我，别人的代码是这么写的，而且在这种情况下会默认导入包。那就是可以的咯，而且解释器已经规定这种情况会总是导入包。为了验证下这一点，我写了个简单的项目，项目结构如下：

```
.
├── main.py
└── same
    ├── api
    │   └── __init__.py
    ├── auth
    │   └── __init__.py
    ├── auth.py
    └── __init__.py
```

其中：

- `same/api/__init__/py` 的内容：

```python
from .. import auth
```

- `same/auth/__init__.py` 的内容：

```python
auth_str = "This is str in package!"
```

- `same/auth.py` 的内容：

```python
auth_str = "This is str in module!"
```

- `main.py` 的内容：

```python
from __future__ import print_function

from same.api import auth

# Script starts from here

if __name__ == "__main__":
    print(auth.auth_str)
```

稍微有些复杂，哈哈，主要是同事那儿大致的结构是这样的，这里是为更好的模拟下。我在 `same.auth` 包中定义了一个 auth_str 字符串，又在同名的 `same.auth` 模块中定义了一个同名的 auth_str 字符串，然后在 `same.api` 包尝试导入 `auth`，最后在 `main.py` 尝试输出 `same.api.auth.auth_str`，看看到底哪个字符串会被打印。同时尝试用 Python2 和 Python3 执行 main.py，得到的结果都是：

```
This is str in package!
```

这里验证了我们的猜想是正确的，解释器的确只导入了包中内容。但是，我并不知道是否有官方的资料说明就是这样的，所以我不敢确信，万一这只是巧合呢。

于是，我开始查资料来验证这一结论。我就说实话吧，对于一个英文水平烂到你无法想象的我，只能先尝试用百度搜索下答案了。事实是，用百度往往都是遗憾的。片刻后，无果，我只能硬着头皮尝试英文搜索了。于是，在 stackoverflow 上找到了如下提问：

[How python deals with module and package having the same name?](http://stackoverflow.com/questions/6393861/how-python-deals-with-module-and-package-having-the-same-name)

其中有一个人回答说 Python 官方文档中在描述模块搜索路径时提到了这一点：[https://docs.python.org/3/tutorial/modules.html#the-module-search-path](https://docs.python.org/3/tutorial/modules.html#the-module-search-path).

文档中有如下一段描述：

> After initialization, Python programs can modify sys.path. The directory containing the script being run is placed at the beginning of the search path, ahead of the standard library path. This means that scripts in that directory will be loaded instead of modules of the same name in the library directory. This is an error unless the replacement is intended. See section Standard Modules for more information.

也就是说，`目录`在库的搜索路径下会首先被搜索，这就意味着目录会代替同名的模块被加载。

这下终于放心了，之前的结论得到证实。**在 Python 中，如果尝试导入同名的模块和包时，包会被导入**。这种情况下，如果想要导入模块，恐怕要用一些 ‘hack’ 的方法，上面提到的 stackoverflow 帖下有一些示例可以参考。当然，最好的方法是避免这样的设计，这样你就不会花那么长时间去查资料，也不会花那么长时间来写类似于本文的文章。