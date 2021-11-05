---
layout: post
title: "Python 模块简介 -- inspect"
keywords: inspect trace frame traceback 堆栈 栈帧 自省 类型检查
description: "Python 的 inspect 模块提供了一些有用的函数来帮助获取对象的信息，该模块可以检查类的内容、检索方法的源代码、提取函数的参数列表，或者获取并显示详细的堆栈信息"
category: Python
tags: python
---

`inspect` 模块提供了一些有用的函数来帮助获取对象的信息，例如模块、类、方法、函数、堆栈（trace）、栈帧（frame）、代码对象等。该模块可以检查类的内容、检索方法的源代码、提取函数的参数列表，或者获取并显示详细的堆栈信息。

该模块提供了四种主要功能：

- 类型检查
- 获取源码
- 检查类和函数
- 检查解释器堆栈信息

## 成员与类型

- `getcomments`： 获取对象的成员，类似 dir 函数
- `ismodule`： 检查对象是否为模块
- `isclass`： 检查对象是否为类
- `ismethod`： 检查对象是否为方法（绑定方法）
- `isfunction`： 检查对象是否为函数（函数，包括 lambda 函数，非对象方法）
- `isgeneratorfunction`： 检查对象是否为生成器函数
- `isgenerator`： 检查对象是否为生成器
- `istraceback`： 检查对象是否为 traceback
- `isframe`： 检查对象是否为 frame
- `iscode`： 检查对象是否为 code
- `isbuiltin`： 检查对象是否为内建函数或方法
- `isroutine`： 检查对象是否为用户自定义或者内建的函数或方法
- `isabstract`： 检查对象是否为抽象基类
- `ismethoddescriptor`： 检查对象是否为方法描述符
- `isdatadescriptor`： 检查对象是否为数据描述符
- `isgetsetdescriptor`： 检查对象是否为非数据描述符
- `ismemberdescriptor`： 检查对象是否为成员描述符

## 获取源码

- `getdoc`： 获取对象文档字符串，类似访问对象的 `__doc__` 方法
- `getcomments`： 获取对象最开始的注释行
- `getfile`： 获取对象被定义的模块文件（文本或者编译的二进制）的文件名
- `getmodule`： 获取对象所属的模块名
- `getsourcefile`： 获取对象被的模块的源代码文件名，对象不能为内建的模块、类、函数
- `getsourcelines`： 获取对象定义的源代码内容，返回内容和对象定义所在的行号元组
- `getsource`： 获取对象定义的源代码内容，返回字符串
- `cleandoc`：清除 docstring 中的缩进

## 类与函数

- `getclasstree`： 获取给定类列表的继承树
- `getargspec`： 获取函数的参数列表及参数缺省值（在 Python3 中被废弃）
- `getfullargspec`： 获取函数的参数列表、参数缺省值、参数注解等
- `getargvalues`： 获取传递给当前调用栈帧的参数信息
- `formatargspec`： 格式化 getfullargspec() 的返回值
- `formatargvalues`： 格式化 getargvalues() 的返回值
- `getmro`： 获取类的所有基类，返回一个元素，按 mro 的解析顺序返回
- `inspect.getcallargs`： 将传入参数绑定到函数的参数名上，返回一个将参数名字和值作为键值对的字典（按照形参和实际传入参数的位置形成键值对）

## 解析堆栈

类似于 C 语言，Python 解释器也使用栈帧（Stack frame）机制来管理函数调用。栈帧指的是在堆栈中为当前正在运行的函数分配的区域（或空间）。传第给函数的参数、返回地址（当这个函数结束后必须跳转到该返回地址，即调用者函数的断点处）以及函数所用的内部存储单元（即函数存储在堆栈上的局部变量）都在栈帧中。

- `getframeinfo(frame, context=1)`： 获取栈帧信息
- `getouterframes(frame, context=1)`： 从 frame 到栈底的所有栈帧，对于 frame 来说，从它到栈底的帧都被称为外部帧
- `getinnerframes(traceback, context=1)`： 获取一个 traceback 对象中的栈帧。
- `currentframe()`： 获取当前正在运行的代码行所在的栈帧，也即当前栈帧
- `stack(context=1)`： 获取获取当前的所有栈帧信息
- `trace(context=1)`： 获取异常时的栈帧信息

## frame 对象

`frame` 对象表示执行帧，即程序运行时函数调用栈中的某一帧。

如果需要获得某个函数相关的栈帧，则必须在调用这个函数且这个函数尚未返回时获取（函数返回时栈帧会被释放）。当前栈帧可以使用 sys 模块的 `_getframe` 函数、或 inspect 模块的 `currentframe` 函数获取。

`frame` 对象包含了一些属性，这些属性对应着在栈帧里存储的数据。

只读属性：

- `f_back`： 前一个堆栈帧，如果这是底部堆栈帧则为 None 
- `f_code`： 在这个框架中执行的Code对象 
- `f_locals`： 用于查找局部变量的字典 
- `f_globals`： 用于全局变量 
- `f_builtins`： 用于内置名称 

可写属性：

- `f_trace`
- `f_exc_type`
- `f_exc_value`
- `f_exc_traceback`
- `f_lineno`： 当前代码在文件中行号


## 使用示例

**对传入和函数的参数进行检查：**

```python
import functools
import inspect


def check_value(value, name):
    if isinstance(value, str) and (not value or value.isspace()):
        raise Exception("invalid '{}' value: '{!r}'".format(name, value))


def check_arguments(args):
    for name, value in args.items():
        check_value(value, name)


def checked_arguments(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        callargs = inspect.getcallargs(func, *args, **kwargs)
        print("------>", callargs)
        check_arguments(callargs)
        return func(*args, **kwargs)
    return wrapper


@checked_arguments
def test(a, b, c=1):
    print(a, b, c)


test(1, 2)
test(1, 2, 3)

# output:
"""
------> {'a': 1, 'b': 2, 'c': 1}
1 2 1
------> {'a': 1, 'b': 2, 'c': 3}
1 2 3
"""
```

**查看堆栈信息：**

```python
import inspect
import pprint


def show_stack():
    for level in inspect.stack():
        print("{}[{}]\n -> {}".format(
            level.frame.f_code.co_filename,
            level.lineno,
            level.code_context[level.index].strip()
        ))
        pprint.pprint(level.frame.f_locals)
        print("\n")


def recurse(limit):
    local_variable = "*" * limit
    if limit <= 0:
        show_stack()
        return
    recurse(limit - 1)
    return local_variable


recurse(2)
```

这对调试递归调用时的错误非常有用。


