---
layout: post
title: "Python 模块的一些知识点总结"
keywords: Python  module
description: "模块支持从逻辑上组织 Python 代码。 当代码量变得相当大的时候, 我们最好把代码分成一些有组织的代码段,前提是保证它们的彼此交互。"
category: Python
tags: python
---

模块支持从逻辑上组织 Python 代码。 当代码量变得相当大的时候, 我们最好把代码分成一些有组织的代码段,前提是保证它们的彼此交互。 这些代码片段相互间有一定的联系, 可能是一个包含数据成员和方法的类, 也可能是一组相关但彼此独立的操作函数。 这些代码段是共享的,所以Python 允许 "调入" 一个模块, 允许使用其他模块的属性来利用之前的工作成果, 实现代码重用。这个把其他模块中属性附加到你的模块中的操作叫做导入(import) 。那些自我包含并且有组织的代码片断就是模块( module )。

## 模块导入

推荐所有的模块在 Python 模块的开头部分导入。 而且最好按照这样的顺序:

- Python 标准库模块
- Python 第三方模块
- 应用程序自定义模块

可以用 `as` 关键字为导入的模块指定别名：

```python
from aass import a as aa, b as bb, c
import time as tm, datetime as dt, math
```

**模块导入的特性：**

- 1、加载模块会导致这个模块 **被执行**。 也就是被导入模块的顶层代码将直接被执行。这通常包括设定全局变量以及类和函数的声明。只把函数和模块定义放入模块的顶层是良好的模块编程习惯
- 2、一个模块只被加载一次，无论它被导入多少次。模块在第一次被导入时便被加载到内存，后续如再次导入时，只是在相应的名字空间中创建该模块的引用。

## 模块内建函数

- `__import__()`

该函数作为实际导入模块的函数, 也就是说 import 语句也调用它来完成工作。其原型为：

```python
__import__(name[, globals[, locals[, fromlist[, level]]]])
```

示例：

```
>>> np = __import__("numpy")
>>> np
<module 'numpy' from '/usr/local/lib/python2.7/dist-packages/numpy/__init__.pyc'>
>>> np.version.version
'1.11.0'
```

在导入子模块的时候需要指定 fromlist， fromlist 就相当于给模块指定别名。例如：

导入：

```
from spam.ham import eggs, sausage as saus
```

相当于

```
_temp = __import__('spam.ham', globals(), locals(), ['eggs', 'sausage'], 0)
eggs = _temp.eggs
saus = _temp.sausage
```

- globals() 和 locals()

globals() 和 locals() 内建函数分别返回调用者全局和局部名称空间的字典。 在一个函数内
部, 局部名称空间代表在函数执行时候定义的所有名字, locals() 函数返回的就是包含这些名字
的字典。 globals() 会返回函数可访问的全局名字。

- reload()

reload() 内建函数可以重新导入一个已经导入的模块。它的语法如下:

```
reload(module)
```

该函数一般用于原模块有变化等特殊情况，这样就允许在不退出解释器的情况下重新加载已更改的Python模块。 Python3 不支持该方法，在 Python3 中被挪到了 imp 模块中。

使用示例：

```
import sys
reload(sys) # Python2.5 初始化后会删除 sys.setdefaultencoding 这个方法，我们需要重新载入
sys.setdefaultencoding('utf-8')
```

## 包

包是一个有层次的文件目录结构, 它定义了一个由模块和子包组成的 Python 应用程序执行环境。

## 自动载入的模块

当 Python 解释器在标准模式下启动时, 一些模块会被解释器自动导入, 用于系统相关操作。例如内建的模块是被自动导入的，一些内建的函数可以直接使用。内建的模块是 `__builtin__` , 在 Python3.x 中已经被替换成了 builtins，但是 `__buitins__` 同时存在与 python2.x 和 python3.x 中。`__buitins__` 是对内建模块的引用，无论任何地方要想使用内建模块，都必须在该位置所处的作用域中导入内建模块，而对于 `__builtins__` 却不用导入，它在任何模块都直接可见。

`sys.modules` 变量包含一个由当前载入(完整且成功导入)到解释器的模块组成的字典, 模块名作为键, 一个模块对象作为值。如果在刚启动 python 解释器时做如下的操作：

```
Python 2.7.6 (default, Jun 22 2015, 17:58:13)
[GCC 4.8.2] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import sys
>>> sys.modules.keys()
['copy_reg', 'sre_compile', '_sre', 'encodings', 'site', '__builtin__', 'sysconfig', '__main__', 'encodings.encodings', 'abc', 'posixpath', '_weakrefset', 'errno', 'encodings.codecs', 'sre_constants', 're', '_abcoll', 'types', '_codecs', 'encodings.__builtin__', '_warnings', 'genericpath', 'stat', 'zipimport', '_sysconfigdata', 'warnings', 'UserDict', 'encodings.utf_8', 'sys', 'codecs', 'readline', '_sysconfigdata_nd', 'os.path', 'sitecustomize', 'signal', 'traceback', 'linecache', 'posix', 'encodings.aliases', 'exceptions', 'sre_parse', 'keyrings', 'os', '_weakref']
```

其中，`sys.modules.keys()` 所列出的模块就是解释器在启动时自动加载的模块，这里我们会发现像一些我们熟知的模块已经被自动加载了，例如 os、re、errno 等。但是，我们在解释器中却不能直接使用 os 模块，这是何原因？

`sys.modules.keys()` 中的每个模块确实在 python 启动的时候被导入了，但是它们不像 `__builtins__` 那样直接暴露了出来，它们还隐藏着，对当前作用域是不可见的，需要 import 把它们加入进来后才能使用。所以 Python 模块的加载与否与模块的可见与否是两回事。先来看一个例子：

```
>>> import json
>>> json
<module 'json' from '/usr/lib/python2.7/json/__init__.pyc'>
>>> del json
>>> del json
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'json' is not defined
>>> josn
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'josn' is not defined
>>> import sys
>>> sys.modules.keys()
['json.decoder', 'encodings.binascii', 'copy_reg', 'sre_compile', '_sre', 'encodings', 'site', '__builtin__', 'sysconfig', '__main__', 'encodings.encodings', 'encodings.hex_codec', 'json.struct', 'abc', 'posixpath', '_weakrefset', 'errno', '_json', 'encodings.codecs', 'sre_constants', 're', 'json', '_abcoll', 'types', '_codecs', 'encodings.__builtin__', '_struct', '_warnings', 'json._json', 'genericpath', 'stat', 'zipimport', '_sysconfigdata', 'warnings', 'UserDict', 'json.json', 'encodings.utf_8', 'json.sys', 'sys', 'json.scanner', 'codecs', 'json.encoder', 'readline', '_sysconfigdata_nd', 'os.path', 'struct', 'json.re', 'sitecustomize', 'signal', 'traceback', 'linecache', 'posix', 'encodings.aliases', 'binascii', 'exceptions', 'sre_parse', 'keyrings', 'os', '_weakref']
```

由例子可知，可以将导入的模块从当前作用域中删除，但是被导入的模块仍然存在于 `sys.modules` 中，即使该模块对当前作用域不可见。所以，Python 程序在运行的时候会将所有导入的模块都加载到内存，直到程序结束才被释放。再来另外一个例子：

- a.py

```python
import sys
import time

__all__ = ["foo"]

sys.test = "This is test in sys."
time.test = "This is test in time."

def foo():
    print "dadada"
```

- b.py

```python
from a import *
print dir()
```

- testsys.py

```python
import sys
from b import *

print sys.test
print time.test
```

运行 testsys.py 的输出结果为：

```
['__builtins__', '__doc__', '__file__', '__name__', '__package__', 'foo']
This is test in sys.
This is test in time.
```

这里，我们用 b.py 作为一个桥梁将 b.py 导入，在 a.py 中我们用 `__all__` 来限制属性的导入，所以在 b.py 中是没有 sys 模块的， `print dir()` 的输出结果可以证明，但是在 testsys.py 中重新导入 sys 模块，并打印在 a.py 中给 sys 添加的属性 test，这却没有抛出 `AttributeError` 异常。这就说明 sys 模块一直存在于程序的整个运行过程中。

因此，解释器在启动的时候自动载入一些模块是为了保存某些全局的变量以便于程序使用。
