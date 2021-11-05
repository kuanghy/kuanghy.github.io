---
layout: post
title: "Python 库打包分发(setup.py 编写)简易指南"
keywords: python setup.py setup 打包 setuptools
description: "Python库打包分发的关键在于编写setup.py文件，文件编写的规则是从 setuptools 或者 distuils 模块导入 setup 函数"
category: Python
tags: python
---

Python 有非常丰富的第三方库可以使用，很多开发者会向 [pypi](https://pypi.org/) 上提交自己的 Python 包。要想向 pypi 包仓库提交自己开发的包，首先要将自己的代码打包，才能上传分发。

## distutils 简介

`distutils` 是标准库中负责建立 Python 第三方库的安装器，使用它能够进行 Python 模块的安装和发布。distutils 对于简单的分发很有用，但功能缺少。大部分Python用户会使用更先进的setuptools模块

## setuptools 简介

`setuptools` 是 distutils 增强版，不包括在标准库中。其扩展了很多功能，能够帮助开发者更好的创建和分发 Python 包。大部分 Python 用户都会使用更先进的 [setuptools](https://setuptools.readthedocs.io) 模块。

Setuptools 有一个 fork 分支是 **distribute**。它们共享相同的命名空间，因此如果安装了 distribute，`import setuptools` 时实际上将导入使用 distribute 创建的包。Distribute 已经合并回 setuptools。

还有一个大包分发工具是 **distutils2**，其试图尝试充分利用distutils，detuptools 和 distribute 并成为 Python 标准库中的标准工具。但该计划并没有达到预期的目的，且已经是一个废弃的项目。

因此，setuptools 是一个优秀的，可靠的 Pthon 包安装与分发工具。以下设计到包的安装与分发均针对 setuptools，并不保证 distutils 可用。

## 包格式

Python 库打包的格式包括 `Wheel` 和 `Egg`。Egg 格式是由 setuptools 在 2004 年引入，而 Wheel 格式是由 PEP427 在 2012 年定义。使用 `Wheel` 和 `Egg` 安装都不需要重新构建和编译，其在发布之前就应该完成测试和构建。

`Egg` 和 `Wheel` 本质上都是一个 zip 格式包，Egg 文件使用 `.egg` 扩展名，Wheel 使用 `.whl` 扩展名。Wheel 的出现是为了替代 Egg，其现在被认为是 Python 的二进制包的标准格式。

以下是 Wheel 和 Egg 的主要区别：

- Wheel 有一个官方的 PEP427 来定义，而 Egg 没有 PEP 定义
- Wheel 是一种分发格式，即打包格式。而 Egg 既是一种分发格式，也是一种运行时安装的格式，并且是可以被直接 import
- Wheel 文件不会包含 .pyc 文件
- Wheel 使用和 PEP376 兼容的 .dist-info 目录，而 Egg 使用 .egg-info 目录
- Wheel 有着更丰富的命名规则。
- Wheel 是有版本的。每个 Wheel 文件都包含 wheel 规范的版本和打包的实现
- Wheel 在内部被 sysconfig path type 管理，因此转向其他格式也更容易

详细描述可见：[Wheel vs Egg](https://packaging.python.org/discussions/wheel-vs-egg/)


## setup.py 文件

Python 库打包分发的关键在于编写 `setup.py` 文件。`setup.py` 文件编写的规则是从 setuptools 或者 distuils 模块导入 setup 函数，并传入各类参数进行调用。

```python
# coding:utf-8

from setuptools import setup
# or
# from distutils.core import setup

setup(
        name='demo',     # 包名字
        version='1.0',   # 包版本
        description='This is a test of the setup',   # 简单描述
        author='huoty',  # 作者
        author_email='sudohuoty@163.com',  # 作者邮箱
        url='https://www.konghy.com',      # 包的主页
        packages=['demo'],                 # 包
)
```

#### 参数概述

`setup` 函数常用的参数如下：

| 参数                 | 说明                                                     |
|:---------------------|:---------------------------------------------------------|
| name                 | 包名称                                                   |
| version              | 包版本                                                   |
| author               | 程序的作者                                               |
| author_email         | 程序的作者的邮箱地址                                     |
| maintainer           | 维护者                                                   |
| maintainer_email     | 维护者的邮箱地址                                         |
| url                  | 程序的官网地址                                           |
| license              | 程序的授权信息                                           |
| description          | 程序的简单描述                                           |
| long_description     | 程序的详细描述                                           |
| platforms            | 程序适用的软件平台列表                                   |
| classifiers          | 程序的所属分类列表                                       |
| keywords             | 程序的关键字列表                                         |
| packages             | 需要处理的包目录(通常为包含 `__init__.py` 的文件夹)      |
| py_modules           | 需要打包的 Python 单文件列表                             |
| download_url         | 程序的下载地址                                           |
| cmdclass             | 添加自定义命令                                           |
| package_data         | 指定包内需要包含的数据文件                               |
| include_package_data | 自动包含包内所有受版本控制(cvs/svn/git)的数据文件        |
| exclude_package_data | 当 include_package_data 为 True 时该选项用于排除部分文件 |
| data_files           | 打包时需要打包的数据文件，如图片，配置文件等             |
| ext_modules          | 指定扩展模块                                             |
| scripts              | 指定可执行脚本,安装时脚本会被安装到系统 PATH 路径下      |
| package_dir          | 指定哪些目录下的文件被映射到哪个源码包                   |
| entry_points         | 动态发现服务和插件，下面详细讲                           |
| python_requires      | 指定运行时需要的Python版本                               |
| requires             | 指定依赖的其他包                                         |
| provides             | 指定可以为哪些模块提供依赖                               |
| install_requires     | 安装时需要安装的依赖包                                   |
| extras_require       | 当前包的高级/额外特性需要依赖的分发包                    |
| tests_require        | 在测试时需要使用的依赖包                                 |
| setup_requires       | 指定运行 setup.py 文件本身所依赖的包                     |
| dependency_links     | 指定依赖包的下载地址                                     |
| zip_safe             | 不压缩包，而是以目录的形式安装                           |

更多参数可见：[https://setuptools.readthedocs.io/en/latest/setuptools.html](https://setuptools.readthedocs.io/en/latest/setuptools.html#metadata)

#### find_packages

对于简单工程来说，手动增加 packages 参数是容易。而对于复杂的工程来说，可能添加很多的包，这是手动添加就变得麻烦。Setuptools 模块提供了一个 `find_packages` 函数,它默认在与 setup.py 文件同一目录下搜索各个含有 `__init__.py` 的目录做为要添加的包。

```python
find_packages(where='.', exclude=(), include=('*',))
```

`find_packages` 函数的第一个参数用于指定在哪个目录下搜索包，参数 **exclude** 用于指定排除哪些包，参数 **include** 指出要包含的包。

默认默认情况下 setup.py 文件只在其所在的目录下搜索包。如果不用 find_packages，想要找到其他目录下的包，也可以设置 package_dir 参数，其指定哪些目录下的文件被映射到哪个源码包，如: `package_dir={'': 'src'}` 表示 “root package” 中的模块都在 src 目录中。

#### 包含数据文件

- **package_data:**

该参数是一个从包名称到 glob 模式列表的字典。如果数据文件包含在包的子目录中，则
glob 可以包括子目录名称。其格式一般为 {'package_name': ['files']}，比如：`package_data={'mypkg': ['data/*.dat'],}`。

- **include_package_data:**

该参数被设置为 True 时自动添加包中受版本控制的数据文件，可替代 package_data，同时，`exclude_package_data` 可以排除某些文件。注意当需要加入没有被版本控制的文件时，还是仍然需要使用 package_data 参数才行。

- **data_files:**

该参数通常用于包含不在包内的数据文件，即包的外部文件，如：配置文件，消息目录，数据文件。其指定了一系列二元组，即`(目的安装目录，源文件)` ，表示哪些文件被安装到哪些目录中。如果目录名是相对路径，则相对于安装前缀进行解释。

- **manifest template:**

`manifest template` 即编写 `MANIFEST.in` 文件，文件内容就是需要包含在分发包中的文件。一个 MANIFEST.in 文件如下：

```
include *.txt
recursive-include examples *.txt *.py
prune examples/sample?/build
```

**MANIFEST.in** 文件的编写规则可参考：[https://docs.python.org/3.6/distutils/sourcedist.html](https://docs.python.org/3.6/distutils/sourcedist.html)

#### 生成脚本

有两个参数 `scripts` 参数或 `console_scripts` 可用于生成脚本。

`entry_points ` 参数用来支持自动生成脚本，其值应该为是一个字典，从 entry_point 组名映射到一个表示 entry_point 的字符串或字符串列表，如：

```python
setup(
    # other arguments here...
    entry_points={
        'console_scripts': [
            'foo=foo.entry:main',
            'bar=foo.entry:main',
        ],
    }
)
```

`scripts` 参数是一个 list，安装包时在该参数中列出的文件会被安装到系统 PATH 路径下。如：

```python
scripts=['bin/foo.sh', 'bar.py']
```

用如下方法可以将脚本重命名，例如去掉脚本文件的扩展名(.py、.sh):

```python
from setuptools.command.install_scripts import install_scripts

class InstallScripts(install_scripts):

    def run(self):
        setuptools.command.install_scripts.install_scripts.run(self)

        # Rename some script files
        for script in self.get_outputs():
            if basename.endswith(".py") or basename.endswith(".sh"):
                dest = script[:-3]
            else:
                continue
            print("moving %s to %s" % (script, dest))
            shutil.move(script, dest)

setup(
    # other arguments here...
    cmdclass={
        "install_scripts": InstallScripts
    }
)
```

其中，**cmdclass** 参数表示自定制命令，后文详述。

#### ext_modules

`ext_modules` 参数用于构建 C 和 C++ 扩展扩展包。其是 Extension 实例的列表，每一个 Extension 实例描述了一个独立的扩展模块，扩展模块可以设置扩展包名，头文件、源文件、链接库及其路径、宏定义和编辑参数等。如：

```python
setup(
    # other arguments here...
    ext_modules=[
        Extension('foo',
                  glob(path.join(here, 'src', '*.c')),
                  libraries = [ 'rt' ],
                  include_dirs=[numpy.get_include()])
    ]
)
```

详细了解可参考：[https://docs.python.org/3.6/distutils/setupscript.html#preprocessor-options](https://docs.python.org/3.6/distutils/setupscript.html#preprocessor-options)


#### zip_safe

`zip_safe` 参数决定包是否作为一个 zip 压缩后的 egg 文件安装，还是作为一个以 .egg 结尾的目录安装。因为有些工具不支持 zip 压缩文件，而且压缩后的包也不方便调试，所以建议将其设为 False，即 `zip_safe=False`。

#### 自定义命令

Setup.py 文件有很多内置的的命令，可以使用 `python setup.py --help-commands` 查看。如果想要定制自己需要的命令，可以添加 cmdclass 参数，其值为一个 dict。实现自定义命名需要继承 `setuptools.Command` 或者 `distutils.core.Command` 并重写 **run** 方法。

```
from setuptools import setup, Command

class InstallCommand(Command):
    description = "Installs the foo."
    user_options = [
        ('foo=', None, 'Specify the foo to bar.'),
    ]
    def initialize_options(self):
        self.foo = None
    def finalize_options(self):
        assert self.foo in (None, 'myFoo', 'myFoo2'), 'Invalid foo!'
    def run(self):
        install_all_the_things()

setup(
    ...,
    cmdclass={
        'install': InstallCommand,
    }
)
```

#### 依赖关系

如果包依赖其他的包，可以指定 `install_requires` 参数，其值为一个 list，如：

```python
install_requires=[
    'requests',
    'flask>=1.0'
    'setuptools==38.2.4',
    'django>=1.11, !=1.11.1, <=2',
    'requests[security, socks]>=2.18.4',
]
```

指定该参数后，在安装包时会自定从 pypi 仓库中下载指定的依赖包安装。

可能包中的某些特殊的、偏门的功能，大多数情况下不会被用到，那么这些功能的依赖，就不适合放在 install_requires 里。这时就可以用 `extras_require` 来指定可选的功能与依赖。如：

```python
extras_require={
    'security': ['pyOpenSSL>=0.14', 'cryptography>=1.3.4', 'idna>=2.0.0'],
    'socks': ['PySocks>=1.5.6, !=1.5.7'],
}
```

还可以指定测试时或者执行 setup.py 时的依赖包。如：

```python
tests_require=[
    'pytest>=3.3.1',
    'pytest-cov>=2.5.1',
],
setup_requires=[
    'pytest-runner>=3.0',
]
```

此外，还支持从指定链接下载依赖，即指定 `dependency_links` 参数，如：

```python
dependency_links = [
    "http://packages.example.com/snapshots/foo-1.0.tar.gz",
    "http://example2.com/p/bar-1.0.tar.gz",
]
```

可以用 `python_requires` 来指定运行时需要的 Python 版本，如包只支持在 Python 3.6 及机上版本运行，则可以指定：

```python
python_requires='>=3.6'
```

#### 分类信息

`classifiers` 参数说明包的分类信息。所有支持的分类列表见：[https://pypi.org/pypi?%3Aaction=list_classifiers](https://pypi.org/pypi?%3Aaction=list_classifiers)

示例：

```python
classifiers = [
    # 发展时期,常见的如下
    #   3 - Alpha
    #   4 - Beta
    #   5 - Production/Stable
    'Development Status :: 3 - Alpha',

    # 开发的目标用户
    'Intended Audience :: Developers',

    # 属于什么类型
    'Topic :: Software Development :: Build Tools',

    # 许可证信息
    'License :: OSI Approved :: MIT License',

    # 目标 Python 版本
    'Programming Language :: Python :: 2',
    'Programming Language :: Python :: 2.7',
    'Programming Language :: Python :: 3',
    'Programming Language :: Python :: 3.3',
    'Programming Language :: Python :: 3.4',
    'Programming Language :: Python :: 3.5',
]
```


## setup.py 命令

`setup.py` 文件有很多内置命令可供使用，查看所有支持的命令：

> python setup.py --help-commands

此处列举一些常用命令：

- **build:**

构建安装时所需的所有内容

- **build_ext:**

构建扩展，如用 C/C++, Cython 等编写的扩展，在调试时通常加 `--inplace` 参数，表示原地编译，即生成的扩展与源文件在同样的位置。

- **sdist:**

构建源码分发包，在 Windows 下为 zip 格式，Linux 下为 tag.gz 格式 。执行 sdist 命令时，默认会被打包的文件：

```
所有 py_modules 或 packages 指定的源码文件
所有 ext_modules 指定的文件
所有 package_data 或 data_files 指定的文件
所有 scripts 指定的脚本文件
README、README.txt、setup.py 和 setup.cfg文件
```

该命令构建的包主要用于发布，例如上传到 [pypi](https://pypi.org/) 上。

- **bdist:**

构建一个二进制的分发包。

- **bdist_egg:**

构建一个 egg 分发包，经常用来替代基于 bdist 生成的模式

- **bdist_wheel:**

构建一个 wheel 分发包，egg 包是过时的，whl 包是新的标准

- **install:**

安装包到系统环境中。

- **develop:**

以开发方式安装包，该命名不会真正的安装包，而是在系统环境中创建一个软链接指向包实际所在目录。这边在修改包之后不用再安装就能生效，便于调试。

- **register、upload:**

用于包的上传发布，后文详述。

## setup.cfg 文件

`setup.cfg` 文件用于提供 setup.py 的默认参数，详细的书写规则可参考：[https://docs.python.org/3/distutils/configfile.html](https://docs.python.org/3/distutils/configfile.html)

## 版本命名

包版本的命名格式应为如下形式:

```
N.N[.N]+[{a|b|c|rc}N[.N]+][.postN][.devN]
```

从左向右做一个简单的解释：

- "N.N": 必须的部分，两个 "N" 分别代表了主版本和副版本号
- "[.N]": 次要版本号，可以有零或多个
- "{a|b|c|rc}": 阶段代号，可选, a, b, c, rc 分别代表 alpha, beta, candidate 和 release candidate
- "N[.N]": 阶段版本号，如果提供，则至少有一位主版本号，后面可以加无限多位的副版本号
- ".postN": 发行后更新版本号，可选
- ".devN": 开发期间的发行版本号，可选

## easy_install 与 pip

`easy_insall` 是 setuptool 包提供的第三方包安装工具，而 `pip` 是 Python
 中一个功能完备的包管理工具，是 easy_install 的改进版，提供更好的提示信息，删除包等功能。

pip 相对于 easy_install 进行了以下几个方面的改进:

- 所有的包是在安装之前就下载了，所以不可能出现只安装了一部分的情况
- 在终端上的输出更加友好
- 对于动作的原因进行持续的跟踪。例如，如果一个包正在安装，那么 pip 就会跟踪为什么这个包会被安装
- 错误信息会非常有用
- 代码简洁精悍可以很好的编程
- 不必作为 egg 存档，能扁平化安装(仍然保存 egg 元数据)
- 原生的支持其他版本控制系统(Git, Mercurial and Bazaar)
- 加入卸载包功能
- 可以简单的定义修改一系列的安装依赖，还可以可靠的赋值一系列依赖包

## 发布包

[PyPI](https://pypi.org/)(Python Package Index) 是 Python 官方维护的第三方包仓库，用于统一存储和管理开发者发布的 Python 包。

如果要发布自己的包，需要先到 [pypi](https://pypi.org/account/register/) 上注册账号。然后创建 `~/.pypirc` 文件，此文件中配置 PyPI 访问地址和账号。如的.pypirc文件内容请根据自己的账号来修改。

典型的 .pypirc 文件

```
[distutils]
index-servers = pypi

[pypi]
username = xxx
password = xxx
```

接着注册项目：

```
python setup.py register
```

该命令在 PyPi 上注册项目信息，成功注册之后，可以在 PyPi 上看到项目信息。最后构建源码包发布即可：

```
# 发布源码包
python setup.py sdist upload

# 同时发布源码包和 whl 二进制包
python setup.py sdist bdist_wheel upload
```

不过用 upload 命令上传包已经过时，官方提供了 twine 工具专门用来与 PyPI 交互。其特点是：

- 验证 HTTPS 连接
- 上传不需要执行 setup.py
- 上传已经创建的文件，允许在发布前测试发行版
- 支持上传任何包装格式

其包含三个子命令 check, register, upload。上传包时，直接用 upload 命令：

```
python setup.py sdist bdist_wheel && twine upload dist/*
```

## 参考资料

- [Building and Distributing Packages with Setuptools
](https://setuptools.readthedocs.io/en/latest/setuptools.html)
- [https://blog.zengrong.net/post/2169.html](https://blog.zengrong.net/post/2169.html)
- [Differences between distribute, distutils, setuptools and distutils2?
](https://stackoverflow.com/questions/6344076/differences-between-distribute-distutils-setuptools-and-distutils2)
- [https://www.ibm.com/developerworks/cn/opensource/os-pythonpackaging/index.html](https://www.ibm.com/developerworks/cn/opensource/os-pythonpackaging/index.html)
- [http://python-packaging-zh.readthedocs.io/zh_CN/latest/index.html](http://python-packaging-zh.readthedocs.io/zh_CN/latest/index.html)
- [How to extend distutils with a simple post install script?
](https://stackoverflow.com/questions/1321270/how-to-extend-distutils-with-a-simple-post-install-script/1321345)
- [Why use pip over easy_install?](https://stackoverflow.com/questions/3220404/why-use-pip-over-easy-install)
