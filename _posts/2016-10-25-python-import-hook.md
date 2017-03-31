---
layout: post
title: "Python import hook"
keywords: python import hook 探针 导入 加载 搜索
description: "Python的import hook被译为探针，利用它可以在模块导入的过程中做一些额外的操作"
category: Python
tags: python
---

`import hook` 通常被译为 **探针**。我们可以认为每当导入模块的时候，所触发的操作就是 `import hook`。使用 import 的 hook 机制可以让我们做很多事情，比如加载网络上的模块，在导入模块时对模块进行修改，自动安装缺失模块，上传审计信息，延迟加载等等。

理解 import hook 需要先了解 Python 导入模块的过程。

## 一、 导入过程

Python 通常使用 import 语句来实现类库的引用，当然内建的 `__import__()` 函数等都能实现。 `import` 语句负责做两件事：

- 查找模块
- 加载模块到当前名字空间

那么，一个模块的导入过程大致可以分为三个步骤：**搜索**、**加载** 和 **名字绑定**。

#### 1.1 搜索

搜索是整个导入过程的核心，也是最为复杂的一步。这个过程主要是完成查找要引入模块的功能，查找的过程如下：

- 1、在缓存 sys.modules 中查找要导入的模块，若找到则直接返回该模块对象
- 2、如果在 sys.modules 中没有找到相应模块的缓存，则顺序搜索 `sys.meta_path`，逐个借助其中的 `finder` 来查找模块，若找到则加载后返回相应模块对象。
- 3、如果以上步骤都没找到该模块，则执行默认导入。即如果模块在一个包中（如import a.b），则以 `a.__path__` 为搜索路径进行查找；如果模块不在一个包中（如import a），则以 sys.path 为搜索路径进行查找。
- 4、如果都未找到，则抛出 `ImportError` 异常。

查找过程也会检查⼀些隐式的 `finder` 对象，不同的 Python 实现有不同的隐式finder，但是都会有 `sys.path_hooks`, `sys.path_importer_cache` 以及`sys.path`。

#### 1.2 加载

对于搜索到的模块，如果在缓存 `sys.modules` 中则直接返回模块对象，否则就需要加载模块以创建一个模块对象。加载是对模块的初始化处理，包括以下步骤：

- 设置属性：包括 `__name__`、`__file__`、`__package__`、`__loader__` 和 `__path__` 等
- 编译源码：将模块文件（对于包，则是其对应的 `__init__.py` 文件）编译为字节码（`*.pyc` 或者 `*.pyo`），如果字节码文件已存在且仍然是最新的，则不重新编译
- 执行字节码：执行编译生成的字节码（即模块文件或 `__init__.py` 文件中的语句）

需要注意的是，加载不只是发生在导入时，还可以发生在 reload 时。

#### 1.3 名字绑定

加载完模块后，作为最后一步，import 语句会为 **导入的对象** 绑定名字，并把这些名字加入到当前的名字空间中。其中，导入的对象 根据导入语句的不同有所差异：

- 如果导入语句为 `import obj`，则对象 obj 可以是包或者模块
- 如果导入语句为 `from package import obj`，则对象 obj 可以是 package 的子包、package 的属性或者 package 的子模块
- 如果导入语句为 `from module import obj`，则对象 obj 只能是 module 的属性


## 二、模块缓存

进行搜索时，搜索的第一个地方是便是 `sys.modules`。`sys.modules` 是一个字典，键字为模块名，键值为模块对象。它包含了从 Python 开始运行起，被导入的所有模块的一个缓存，包括中间路径。所以，假如 foo.bar.baz 前期已被导入，那么，sys.modules 将包含进入 foo，foo.bar 和 foo.bar.baz的入口。每个键都有自己的数值，都有对应的模块对象。也就是说，如果导入 foo.bar.baz 则整个层次结构下的模块都被加载到了内存。

可以删除 sys.modules 中对应的的键或者将值设置为 None 来使缓存无效。

当启动 Python 解释器时，打印一下 sys.modules 中的 key：

```python
>>> import sys
>>> sys.modules.keys()
['copy_reg', 'sre_compile', '_sre', 'encodings', 'site', '__builtin__', 'sysconfig', '__main__', 'encodings.encodings', 'abc', 'posixpath', '_weakrefset', 'errno', 'encodings.codecs', 'sre_constants', 're', '_abcoll', 'types', '_codecs', 'encodings.__builtin__', '_warnings', 'genericpath', 'stat', 'zipimport', '_sysconfigdata', 'warnings', 'UserDict', 'encodings.utf_8', 'sys', 'codecs', 'readline', '_sysconfigdata_nd', 'os.path', 'sitecustomize', 'signal', 'traceback', 'linecache', 'posix', 'encodings.aliases', 'exceptions', 'sre_parse', 'keyrings', 'os', '_weakref']
```

可以看出一些模块已经被解释器导入，但是我们却不能直接使用这些模块。这是因为这些模块还没有被绑定到当前名字空间，仍然需要执行 import 语句才能完成名字绑定。

## 三、查找器和加载器

在搜索过程中我们提到 `sys.meta_path` 中保存了一些 `finder` 对象。在 Python 查找的时候，如果在 sys.modules 中没有查找到，就会依次调用 sys.meta_path 中的 finder 对象，即调用导入协议来查找和加载模块。导入协议包含两个概念性的对象，**查找器**（loader） 和 **加载器**（loader）。`sys.meta_path` 在任何默认查找程序或 sys.path 之前搜索。默认的情况下，在 Python2 中 sys.meta_path 是一个空列表，并没有任何 finder 对象；而在 Python3 中则在 Python 中则默认包含三个查找器：第一个知道如何定位内置模块，第二个知道如何定位冻结模块，第三个搜索模块的导入路径：

```python
[<class '_frozen_importlib.BuiltinImporter'>, <class '_frozen_importlib.FrozenImporter'>, <class '_frozen_importlib.PathFinder'>]
```

在 Python 中，不仅定义了 finder 和 loader 的概念，还定义了 `importor` 的概念：

- 查找器（finder）： 决定自己是否能够通过运用其所知的任何策略找到相应的模块。在 Python2 中，finder 对象必须实现 `find_module()` 方法，在 Python3 中必须要实现 `find_module()` 或者 `find_loader（)` 方法。如果 finder 可以查找到模块，则会返回一个 loader 对象(在 Python 3.4中，修改为返回一个模块分支`module specs`，加载器在导入中仍被使用，但几乎没有责任)，没有找到则返回 None。
- 加载器（loader）： 负责加载模块，它必须实现一个 `load_module()` 的方法
- 导入器（importer）： 实现了 finder 和 loader 这两个接口的对象称为导入器

我们可以想 sys.meta_path 中添加一些自定义的加载器，来实现在加载模块时对模块进行修改。例如一个简单的例子，在每次加载模块时打印模块信息：

```python
from __future__ import print_function
import sys

class Watcher(object):
    @classmethod
    def find_module(cls, name, path, target=None):
        print("Importing", name, path, target)
        return None

sys.meta_path.insert(0, Watcher)

import subprocess
```

输出结果：

```
Importing subprocess None None
Importing gc None None
Importing time None None
Importing select None None
Importing fcntl None None
Importing pickle None None
Importing marshal None None
Importing struct None None
Importing _struct None None
Importing org None None
Importing binascii None None
Importing cStringIO None None
```

## 四、导入钩子程序

Python 的导入机制被设计为可扩展的，其基础的运行机制便是 `import hook（导入钩子程序）`。Python 存在两种导入钩子程序的形态：一类是上文提到的 `meta hook（元钩子程序）`， 另一类是 `path hook（导入路径钩子程序）`。

在其他任何导入程序运行之前，除了 sys.modules 缓存查找，在导入处理开始时调用元钩子程序。这就允许元钩子程序覆盖 sys.path 处理程序，冻结模块，或甚至内建模块。可以通过给 sys.meta_path 添加新的查找器对象来注册元钩子程序。

当相关路径项被冲突时，导入路径钩子程序作为 `sys.path` (或者 `package.__path__`) 处理程序的一部分被调用。可以通过给 sys.path_hooks 添加新的调用来注册导入路径钩子程序。

`sys.path_hooks` 是由可被调用的对象组成，它会顺序的检查以决定他们是否可以处理给定的 sys.path 的一项。每个对象会使用 sys.path 项的路径来作为参数被调用。如果它不能处理该路径，就必须抛出 ImportError 异常，如果可以，则会返回一个 importer 对象。之后，不会再尝试其它的 sys.path_hooks 对象，即使前一个 importer 出错了。

通过 `import hook` 我们可以根据需求来扩展 Python 的 import 机制。一个简单的使用导入钩子的实例，在 import 时判断库是否被安装，否则就自动安装：

```python
from __future__ import print_function
import sys
import pip
from importlib import import_module


class AutoInstall(object):
    _loaded = set()

    @classmethod
    def find_module(cls, name, path, target=None):
        if path is None and name not in cls._loaded:
            cls._loaded.add(name)
            print("Installing", name)
            installed = pip.main(["install", name])
            if installed == 0:
                return import_module(name)
            else:    
                return None

sys.meta_path.append(AutoInstall)
```

Python 还提供了一些模块和函数，可以用来实现简单的 `import hook`，主要有一下几种：

- `__import__`: Python 的内置函数；
- imputil: Python 的 import 工具库，在 Python2.6 被声明废弃，Python3 中彻底移除；
- imp: Python2 和 Python3 都存在的一个 import 库；
- importlib: Python3 中最新添加，backport 到 Python2.7，但只有很小的子集（只有一个 import_module 函数）。

## 五、site 模块

`site` 模块用于 python 程序启动的时候，做一些自定义的处理。在 Python 程序运行前，site 模块会自动导入，并按照如下顺序完成初始化工作:

- 将 `sys.prefix` 、`sys.exec_prefix` 和 `lib/pythonX.Y/site-packages` 合成 module 的 `search path`。加入sys.path。eg: /home/jay/env/tornado/lib/python2.7/site-packages
- 在添加的路径下寻找 `pth` 文件。 该文件中描述了添加到 sys.path 的子文件夹路径。
- `import sitecustomize`， sitecustomize 内部可以做任意的设置。
- `import usercustomize`， usercustomize 一般放在用户的 path 环境下， 如: `/home/jay/.local/lib/python2.7/site-packagesusercustomize`， 其内部可以做任意的设置。

所以可以设置特殊的 `usercustomize.py` 或者 `usercustomize.py` 文件, 在 python 代码执行之前，添加 `import hook`。

## 六、导入搜索路径

Python 在 import 时会在系统中搜索模块或者包所在的位置，`sys.path` 变量中保存了所有可搜索的库路径，它是一个路径名的列表，其中的路径主要分为以下几部分：

- **程序主目录（默认定义）**： 如果是以脚本方式启动的程序，则为启动脚本所在目录；如果在交互式解释器中，则为当前目录；
- **PYTHONPATH目录（可选扩展）**： 以 os.pathsep 分隔的多个目录名，即环境变量 `os.environ['PYTHONPATH']`（类似 shell 环境变量 PATH）；
- **标准库目录（默认定义）**： Python 标准库所在目录（与安装目录有关）；
- **.pth文件目录（可选扩展）**： 以 “.pth” 为后缀的文件，其中列有一些目录名（每行一个目录名）。

因此如果想要添加库的搜索路径，可以有如下方法：

- 直接修改 sys.path 列表
- 使用 PYTHONPATH 扩展
- 使用 .pth 文件扩展

## 七、重新加载

关于 import，还有一点非常关键：**加载只在第一次导入时发生**。Python 这样设计的目的是因为加载是个代价高昂的操作。

通常情况下，如果模块没有被修改，这正是我们想要的行为；但如果我们修改了某个模块，重复导入不会重新加载该模块，从而无法起到更新模块的作用。有时候我们希望在 **运行时（即不终止程序运行的同时），达到即时更新模块的目的**，内建函数 reload() 提供了这种 **重新加载** 机制（在 Python3 中被挪到了 imp 模块下）。

关于 reload 与 import 的不同：

- import 是语句，而 reload 是函数
- import 使用 **模块名**，而 reload 使用 **模块对象**（即已被import语句成功导入的模块）

重新加载 `reload(module)` 有以下几个特点：

- 会重新编译和执行模块文件中的顶层语句
- 会更新模块的名字空间（字典 `M.__dict__`）：覆盖相同的名字（旧的有，新的也有），保留缺失的名字（旧的有，新的没有），添加新增的名字（旧的没有，新的有）
- 对于由 `import M` 语句导入的模块 M：调用 reload(M) 后，M.x 为 新模块 的属性 x（因为更新M后，会影响M.x的求值结果）
- 对于由 `from M import x` 语句导入的属性 x：调用 reload(M) 后，x 仍然是 旧模块 的属性 x（因为更新M后，不会影响x的求值结果）
- 如果在调用 `reload(M)` 后，重新执行 import M（或者from M import x）语句，那么 M.x（或者x）为 新模块 的属性 x

## 八、参考资料

- [https://github.com/Liuchang0812/slides/tree/master/pycon2015cn](https://github.com/Liuchang0812/slides/tree/master/pycon2015cn)
- [http://www.cnblogs.com/russellluo/p/3328683.html](http://www.cnblogs.com/russellluo/p/3328683.html)
- [http://wiki.jikexueyuan.com/project/python-language-reference/import.html](http://wiki.jikexueyuan.com/project/python-language-reference/import.html)
