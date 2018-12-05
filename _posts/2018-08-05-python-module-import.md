---
layout: post
title: "浅谈 Python 的模块导入"
keywords: python 模块 导入 惰性 import 命名空间包
description: "包是一种特殊的模块，所有的包都是模块，但不是所有的模块都是包"
category: Python
tags: python
---

本文不讨论 Python 的导入机制（底层实现细节），仅讨论模块与包，以及导入语句相关的概念。通常，导入模块都是使用如下语句：

```
import ...
import ... as ...
from ... import ...
from ... import ... as ...
```

一般情况下，使用以上语句导入模块已经够用的。但是在一些特殊场景中，可能还需要其他的导入方式。例如 Python 还提供了 `__import__` 内建函数和 importlib 模块来实现动态导入。动态导入的好处是可以延迟模块的加载，仅在用到模块时才支持导入动作。

运用 `__import__` 函数和 importlib 模块固然能够实现模块的延迟加载，但其不足之处是，在任何需要用到指定模块的地方都要实现一遍同样的导入语句，这样是不便于维护且非常麻烦的。如果能够在顶层实现惰性导入，则是一个更好的选择，这也是本文最终要讨论的点。

在讨论一些高级用法之前，首先需要了解一下模块与包的概念。

## 模块与包

**模块** 可以理解为是 Python 可以加载并执行的代码文件，代码文件不仅可以是 `.py` 文件，还可以是 `.so` 等其他类型的文件。Python 只有一个 模块 对象型态，而且所有模块都是这个型态。为了便于组织多个模块并提供一个模块层次结构的命名，Python 提供了 **包** 的概念。

可以简单的将包看作是一个文件系统的目录，将模块看作是目录中的代码文件（注意，不能完全地这样认为，因为包和模块并非仅来自文件系统，还可以来自压缩文件、网络等）。类似于文件系统的目录结构，包被分级组织起来，而且包本身也可以包含子包和常规模块。

包其实可以看作是一种特殊的模块。例如常规包（下面会介绍常规包的概念）的目录中需要包含 `__init__.py` 文件，当包被导入时，该文件的顶层代码被隐式执行，就如同模块导入时顶层代码被执行，该文件就像是包的代码一样。所以 **包是一种特殊的模块**。需要记住的是，**所有的包都是模块，但不是所有的模块都是包**。包中子包和模块都有 `__path__` 属性，具体地说，任何包含 `__path__` 属性的模块被认为是包。所有的模块都有一个名称，类似于标准属性访问语法，子包与他们父包的名字之间用点隔开。

Python 定义了两种类型的包，即 **常规包** 和 **命名空间包**。常规包是存在于 Python 3.2 及更早版本中的传统包。常规包即包含 `__init__.py` 文件的目录。当导入一个常规包时，`__init__.py` 文件被隐式执行，而且它定义的对象被绑定到包命名空间中的名称。 `__init__.py` 文件能包含其他任何模块能够包含的相同的 Python 代码，而且在导入时，Python 将给模块增加一些额外的属性。

从 Python 3.3 开始，Python 引入了 **命名空间包** 的概念。命名空间包是不同文件集的复合，每个文件集给父包贡献一个子包，所有的包中都不需要包含 `__init__.py` 文件。文件集可以存于文件系统的不同位置。文件集的查找包含导入过程中 Python 搜索的压缩文件，网络或者其他地方。命名空间包可以但也可以不与文件系统的对象直接对应，它们可以是真实的模块但没有具体的表述。更新关于命名空间包的说明可以参考 [PEP 420](https://www.python.org/dev/peps/pep-0420/)。

命名空间包的 `__path__` 属性与常规包不同，其使用自定义的迭代器类型，遍历所有包含该命令空间包的路径。如果他们父包的路径（或者高阶包的 sys.path ）改变，它将在下次试图导入时在该包中自动重新搜索包部分。

如有如下目录结构：

```
.
├── bar-package
│   └── nsp
│       └── bar.py
└── foo-package
    └── nsp
        └── foo.py
```

则 nsp 即可以是一个命名空间包，以下是测试代码（记得用 Python 3.3 及更高版本运行测试）：

```python
import sys
sys.path.extend(['foo-package', 'bar-package'])

import nsp
import nsp.bar
import nsp.foo

print(nsp.__path__)

# 输出：
# _NamespacePath(['foo-package/nsp', 'bar-package/nsp'])
```

命名空间包具有如下特性：

- 1、优先级最低，在已有版本所有的 import 规则之后
- 2、包中不必再包含 `__init__.py` 文件
- 3、可以导入并组织目录分散的代码
- 4、依赖于 sys.path 中从左到右的搜索顺序

## `__import__`

`__import__` 函数可用于导入模块，import 语句也会调用函数。其定义为：

```python
__import__(name[, globals[, locals[, fromlist[, level]]]])
```

参数介绍：

- name (required): 被加载 module 的名称
- globals (optional): 包含全局变量的字典，该选项很少使用，采用默认值 global()
- locals (optional): 包含局部变量的字典，内部标准实现未用到该变量，采用默认值 - local()
- fromlist (Optional): 被导入的 submodule 名称
- level (Optional): 导入路径选项，Python 2 中默认为 -1，表示同时支持 absolute import 和 relative import。Python 3 中默认为 0，表示仅支持 absolute import。如果大于 0，则表示相对导入的父目录的级数，即 1 类似于 '.'，2 类似于 '..'。

使用示例：

```python
# import spam
spam = __import__('spam')

# import spam.ham
spam = __import__('spam.ham')

# from spam.ham import eggs, sausage as saus
_temp = __import__('spam.ham', fromlist=['eggs', 'sausage'])
eggs = _temp.eggs
saus = _temp.sausage
```

## 模块缓存

在执行模块导入时，Python 的导入系统会首先尝试从 sys.modules 查找。`sys.modules` 中是所有已导入模块的一个缓存，包括中间路径。即，假如 foo.bar.baz 被导入，那么，sys.modules 将包含进入 foo，foo.bar 和 foo.bar.baz 模块的缓存。其实一个 dict 类型，每个键都有自己的值，对应相应的模块对象。

导入过程中，首先在 sys.modules 中查找模块名称，如果存在，则返回该模块并结束导入过程。如果未找到模块名称，Python 将继续搜索模块（从 sys.path 中查找并加载）。sys.modules 是可写的，删除一个键会使指定模块的缓存实现，下次导入时又将重新搜索指定的模块，这类似于模块的 reload。

需要注意的是，如果保持模块对象引用，并使 sys.modules 中缓存失效，然后再重新导入指定的模块，则这两个模块对象是不相同的。而相比之下，`importlib.reload()` 重新加载模块时，会使用相同的模块对象，并通过重新运行模块代码简单地重新初始化模块内容。

##  imp 与 importlib 模块

`imp` 模块提供了一些 import 语句内部实现的接口。例如模块查找（find_module）、模块加载（load_module）等等（模块的导入过程会包含模块查找、加载、缓存等步骤）。可以用该模块来简单实现内建的 `__import__` 函数功能：

```python
import imp
import sys

def __import__(name, globals=None, locals=None, fromlist=None):
    # 首先从缓存中查找
    try:
        return sys.modules[name]
    except KeyError:
        pass

    # 如果模块缓存中没有，则开始从 sys.path 中查找模块
    fp, pathname, description = imp.find_module(name)

    # 如何找到模块则将其载入
    try:
        return imp.load_module(name, fp, pathname, description)
    finally:
        if fp:
            fp.close()
```

`importlib` 模块在 python 2.7 被创建，并且仅包含一个函数：

```python
importlib.import_module(name, package=None)
```

这个函数是对 `__import__` 的封装，以用于更加便捷的动态导入模块。例如用其实现相对导入：

```python
import importlib

# 类似于 'from . import b'
b = importlib.import_module('.b', __package__)
```

从 python 3 开始，内建的 reload 函数被移到了 imp 模块中。而从 Python 3.4 开始，imp 模块被否决，不再建议使用，其包含的功能被移到了 importlib 模块下。即从 Python 3.4 开始，importlib 模块是之前 imp 模块和 importlib 模块的合集。

## 惰性导入

前边介绍的大部分内容都是为实现惰性导入做铺垫，其他的小部分内容仅是延伸而已（就是随便多介绍了点内容）。惰性导入即延迟模块导入，在真正用到模块时才执行模块的导入动作，如果模块不被使用则导入动作永远不会发生。

惰性导入的需求还是很常见的。一般推荐模块仅在顶层导入，而有时候在顶层导入模块并非最好的选择。比如，一个模块仅在一个函数或者类方法中用到时，则可使用局部导入（在局部作用域中执行导入），使得仅在函数或方法被执行时才导入模块，这样可以避免在顶层名字空间中引入模块变量。再比如，在我工作所负责的项目中，需要用到 pandas 包，而 pandas 包导入了会占用一些内存（不是很多，但也不算少，几十兆的样子），所以当不会用到 pandas 包时，我们希望他不被导入。我们自己实现的一些包在载入时会很耗时（因为要读取配置等等，在导入时就会耗时几秒到十几秒的样子），所以也极其需要惰性导入的特性。

下面是惰性导入的简单实现，可供参考：

```python
import sys
from types import ModuleType


class LazyModuleType(ModuleType):

    @property
    def _mod(self):
        name = super(LazyModuleType, self).__getattribute__("__name__")
        if name not in sys.modules:
            __import__(name)
        return sys.modules[name]

    def __getattribute__(self, name):
        if name == "_mod":
            return super(LazyModuleType, self).__getattribute__(name)

        try:
            return self._mod.__getattribute__(name)
        except AttributeError:
            return super(LazyModuleType, self).__getattribute__(name)

    def __setattr__(self, name, value):
        self._mod.__setattr__(name, value)


def lazy_import(name, package=None):
    if name.startswith('.'):
        if not package:
            raise TypeError("relative imports require the 'package' argument")
        level = 0
        for character in name:
            if character != '.':
                break
            level += 1

        if not hasattr(package, 'rindex'):
            raise ValueError("'package' not set to a string")
        dot = len(package)
        for _ in range(level, 1, -1):
            try:
                dot = package.rindex('.', 0, dot)
            except ValueError:
                raise ValueError("attempted relative import beyond top-level "
                                 "package")

        name = "{}.{}".format(package[:dot], name[level:])

    return LazyModuleType(name)
```

## 参考资料

- [https://docs.python.org/3/reference/import.html](https://docs.python.org/3/reference/import.html)
- [https://github.com/nipy/nitime](https://github.com/nipy/nitime/blob/master/nitime/lazyimports.py)
- [https://github.com/mnmelo/lazy_import](https://github.com/mnmelo/lazy_import)
