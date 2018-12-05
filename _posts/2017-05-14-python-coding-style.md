---
layout: post
title: "Python 编码风格参考"
keywords: Python 编码 编码风格 风格参考 编码规范
description: "代码除了用来运行外，更多的是用来读。本文仅是一个 Python 编码风格的参考"
category: Python
tags: python
---

代码除了用来运行外，更多的是用来读。为了是代码的可读性更强，很多编程语言都有自己的编码规范。规范的制定是为了保持代码的一致性，以使代码更美观和易读。代码应该怎么样排版和编写并不是绝对的，所以一些地方会有争议。有时风格指南并不适用，最重要的知道何时不一致。当你无法判断该怎么做时，应该所参考下其他的例子。

本文仅是一个 Python 编码风格的参考，并不是一个规定，规定必须要这么去做。本文的目的应该是起一个指导作用，指导开发者去写更易读的代码。

## 一、代码编排

主要是缩进与空行的排版：

- 1、使用 4 个空格进行缩进（编辑器都可以完成此功能），不推荐使用制表符，更不能混合使用制表符和空格。
- 2、每行不超过 80 个字符，换行可以使用反斜杠，最好使用括号（Python 会将[圆括号, 中括号和花括号中的行隐式的连接起来](https://docs.python.org/3.6/reference/lexical_analysis.html#implicit-line-joining)）。
- 3、类和顶层函数定义之间空两行；类中的方法定义之间空一行；函数内逻辑无关段落之间空一行；其他地方尽量不要再空行。

## 二、文档编排

主要是整个源码文件的布局：

- 1、模块内容的顺序：模块说明，模块文档字符串，导入语句，全局变量或者常量，其他定义。
- 2、模块导入部分顺序：标准库，第三方模块，自定义模块；各部分之间空一行。
- 3、不要在一个 import 语句中一次导入多个模块，比如 `import os, sys` 不推荐。
- 4、导入模块时应该使用合适的方式来避免命名冲突，例如在适当的时候才使用 `from xx import xx`，尽量避免使用 `from xx imoprt *`。
- 5、在自已编写的模块中，如果需要使用 `from xx import *` 时，应该在导入语句后或者模块尾使用 `__all__` 机制来限制导入规则。

## 三、语句编排

- 1、通常每个语句应该独占一行。
- 2、不要在行尾加分号, 也不要用分号将多条语句放在同一行。
- 3、if/for/while 语句中，即使执行语句只有一句，也应尽量另起一行。
- 4、不要在返回语句（return）或条件语句（if/for/while）中使用括号，除非是用于实现行连接。
- 5、对于 if 语句, 在没有 else 且语句比较短时，可以在一行完成（但不推荐），比如：`if foo: bar(foo)`.
- 6、对于简单的类定义，也可以在一行完成（但不推荐），比如定义一个异常：`class UnfoundError(Exception): pass`.
- 7、函数和方法的括号中使用垂直隐式缩进或使用悬挂缩进。

```python
# 一行写不下时，有括号来连接多行，后续行应该使用悬挂缩进
if (this_is_one_thing
        and that_is_another_thing):
    do_something()

# 函数调用参数较多时，对准左括号
f = foo(a, b,
        c, d)

# 不对准左括号，但加多一层缩进，以和后面内容区别
def long_function_name(
        a, b, c,
        d, e):
    print(a, b, c, d, e)

# 列表、元组、字典以及函数调用时可以让右括号回退，这样更加美观
l = [
    1, 2, 3,
    4, 5, 6,
]

result = some_function(
    'a', 'b', 'c',
    'd', 'e', 'f',
)

```

## 四、空格使用

总体原则，避免不必要的空格。

- 1、各种右括号前不要加空格。
- 2、逗号、冒号、分号前不要加空格，但应该在它们后面加(除了在行尾)。
- 3、函数的左括号前不要加空格。如 Func(1)。
- 4、序列的左括号前不要加空格。如 list[2]。
- 5、操作符左右各加一个空格，不要为了对齐增加空格。
- 6、函数默认参数使用的赋值符左右省略空格。

良好的风格：

```python
spam(ham[1], {eggs: 2})

if x == 4:
    print x, y; x, y = y, x

f = foo(1, 2, 3)

ham[1:9], ham[1:9:3], ham[:9:3], ham[1::3], ham[1:9:]
ham[lower:upper], ham[lower:upper:], ham[lower::step]
ham[lower+offset : upper+offset]
ham[: upper_fn(x) : step_fn(x)], ham[:: step_fn(x)]
ham[lower + offset : upper + offset]

x = 1
y = 2
long_variable = 3

def foo(a, b, c=0):
    return moo(m=a, n=b, o=c)
```

不好的风格：

```python
spam( ham[ 1 ], { eggs: 2 } )

if x == 4 :
    print x , y ; x , y = y , x

f = foo (1, 2, 3)

ham[lower + offset:upper + offset]
ham[1: 9], ham[1 :9], ham[1:9 :3]
ham[lower : : upper]
ham[ : upper]

x             = 1
y             = 2
long_variable = 3

def foo(a, b, c = 0):
    return moo(m = a, n = b, o = c)
```

## 五、注释

总体原则，错误的注释不如没有注释。所以当一段代码发生变化时，第一件事就是要修改注释。注释尽量使用英文，最好是完整的句子，首字母大写，句后要有结束符，结束符后跟两个空格，开始下一句。如果是短语，可以省略结束符。注释应该在 `#` 后加一个空格才开始写注释内容。

- 1、块注释，在一段代码前增加的注释。段落之间用只有 ‘#’ 的行间隔。比如：

```
# Description : Module config.
#
# Input : None
#
# Output : None
```

- 2、行注释，在一句代码后加注释。应该尽量在语句后空两格后再开始注释。当有连续的行注释时，为了美观可以让 ‘#’ 对齐。 在语句比较长时，应该尽量少使用行注释。比如：

```python
person = {
    "name": "huoty",  # 姓名
    "age": 26,        # 年龄
    "stature": 169,   # 身高
    "weight": 60,     # 体重
}

print person  # 输出信息
```

- 3、对类或者函数的说明，尽量不要在其定义的前一行或者后一行用块注释的形式来说明，而应该使用文档字符串（docstring）

- 4、使用 `TODO` 注释来标记待完成的工作，团队协作中，必要的时候应该写上你的名字或者联系方式，比如：

```python
# TODO(sudohuoty@gmail.com): Use a "*" here for string repetition.
# TODO(Huoty) Change this to use relations.
```

- 5、避免无谓的注释。[你见过哪些奇趣的代码注释？](https://www.zhihu.com/question/29962541)

```python
# 你可能会认为你读得懂以下的代码。但是你不会懂的，相信我吧。  

# 要是你尝试玩弄这段代码的话，你将会在无尽的通宵中不断地咒骂自己为什么会认为自己聪明到可以优化这段代码。  
# so，现在请关闭这个文件去玩点别的吧。  

# 程序员1（于2010年6月7日）：在这个坑临时加入一些调料  
# 程序员2（于2011年5月22日）：临你个屁啊  
# 程序员3（于2012年7月23日）：楼上都是狗屎，鉴定完毕  
# 程序员4（于2013年8月2日）：fuck 楼上，三年了，这坑还在！！！  
# 程序员5（于2014年8月21日）：哈哈哈，这坑居然坑了这么多人，幸好我也不用填了，系统终止运行了，you're died  
```

## 六、文档描述

- 1、尽量为所有的共有模块、函数、类、方法写 `docstring`。

- 2、前三引号后不应该换行，应该紧接着在后面概括性的说明模块、函数、类、方法的作用，然后再空一行进行详细的说明。后三引号应该单独占一行。比如：

```python
"""Convert an API path to a filesystem path

If given, root will be prepended to the path.
root must be a filesystem path already.
"""
```

- 2、函数和方法的 docstring 层次顺序大致为概述、详细描述、参数、返回值、异常，一般不要求描述实现细节，除非其中涉及非常复杂的算法。大致的层次结构如下所示：

```python
"""函数或方法的概述

详细的描述信息……
详细的描述信息……

参数说明
--------
    参数1：...
    参数2：...

返回值：
    ...

异常：
    异常1：...
    异常2：...
"""
```

一个参考示例：

```python
"""Start a kernel for a session and return its kernel_id.                                                                                             

Parameters
----------
kernel_id : uuid
    The uuid to associate the new kernel with. If this
    is not None, this kernel will be persistent whenever it is
    requested.
path : API path
    The API path (unicode, '/' delimited) for the cwd.
    Will be transformed to an OS path relative to root_dir.
kernel_name : str
    The name identifying which kernel spec to launch. This is ignored if
    an existing kernel is returned, but it may be checked in the future.

Return a kernel id
"""
```

- 3、类的 docstring 的层次顺序大致为概述、详细描述、属性说明。如果类有公开属性值时，应该尽量在 docstring 中进行说明。如下所示：

```python
"""这里是类的概述。

详细的描述信息……
详细的描述信息……

属性(Attributes):
-----------------
    属性1: ...
    属性2: ...
"""
```

## 七、命名规范

- 1、模块命名尽量短小，使用全部小写的方式，可以使用下划线。
- 2、包命名尽量短小，使用全部小写的方式，不可以使用下划线。
- 3、类的命名使用驼峰命令的方式，即单词首字符大写，类名应该全部使用名词。
- 4、异常命令应该使用加 `Error` 后缀的方式，比如：HTTPError。
- 5、全局变量尽量只在模块内有效，并且应该尽量避免使用全局变量。
- 6、函数命名使用全部小写的方式，使用下划线分割单词，并采用动宾结构。
- 7、常量命名使用全部大写的方式，使用下划线分割单词。
- 8、类的属性（方法和变量）命名使用全部小写的方式，使用下划线分割单词。
- 9、变量、类属性等命令尽量不要使用缩写形式，除了计数器和迭代器，尽量不要使用单字符名称。
- 10、类的方法第一个参数必须是 self，而静态方法第一个参数必须是 cls。
- 11、在模块中要表示私有变量或者函数时，可以在变量或者函数前加一个下划线 `_foo`, `_show_msg` 来进行访问控制。
- 12、在 Python 中没有诸如 public、private、protected 等修饰符，而在类的定义中往往会有类似这样的需求，那么可以在属性或者方法前加一个下划线表示 protected，加两个下划线来表示 private。加两个下划线的变量或者方法没法直接访问。比如：类 Foo 中声明 `__a`, 则不能用 `Foo.__a` 的方式访问，但可以用 `Foo._Foo__a` 的方式访问。`

## 八、程序入口

Python 属于脚本语言，代码的运行是通过解释器对代码文件进行逐行解释执行来完成的。它不像其他编程语言那样有统一的入口程序，比如 Java 有 Main 方法，C/C++ 有 main 方法。Python 的代码文件除了可以被直接执行外，还可以作为模块被其他文件导入。所有的顶级代码在模块导入时都会被执行，当希望模块被导入时，应该避免主程序被执行。这样就需要把主程序放到 `if __name__ == '__main__'` 代码块中，比如：

```python
def main():
      ...

if __name__ == '__main__':
    main()
```

一个包除了能够被导入外，也可以通过 `python -m package` 的方式被直接执行，前提是包中需要有 `__main__.py`，这个文件可以说是包的程序入口，包中有了这个文件就可以用 Python 的 `-m` 参数来直接运行。

## 九、编码建议

- 1、尽可能使用 'is' 和 'is not' 取代 '=='，比如 if x is not None 要优于 if x != None，另外用 if x 效率更高。

**Note:** 等于比较运算符（==） 会调用左操作数的 `__eq__` 函数，这个函数可以被其任意定义，而 is 操作只是做 id 比较，并不会被自定义。同时也可以发现 is 函数是要快于等于运算符的，因为不用查找和运行函数。

- 2、用 "is not" 代替 "not ... is"，前者的可读性更好。

- 3、使用基于类的异常，每个模块或包都有自己的异常类，此异常类继承自 Exception。

- 4、异常中尽量不要使用裸露的 except，except 后应该跟具体的 exceptions。

- 5、使用 startswith() 和 endswith() 代替切片进行序列前缀或后缀的检查。

- 6、使用 isinstance() 比较对象的类型，而不是 type()，比如：

```python
# Yes:  
if isinstance(obj, int)

# No:  
if type(obj) is type(1)
```

- 7、判断序列是否为空时，不用使用 len() 函数，序列为空时其 bool 值为 False，比如：

```python
# Yes:  
if not seq
if seq

# No:  
if len(seq)
if not len(seq)
```

- 8、字符串后面不要有大量拖尾空格。

- 9、使用 join 合并的字符串，字符串方法 join 可以合并 list、tuple、iterator 中的元素，效率比连接符 + 高。

- 10、使用 `while 1` 比 `while True` 更快。

- 11、使用 `**` 比 `pow` 快 10 倍以上。

- 12、使用迭代器和生成器代替列表等数据结构效率更高，使用列表（字典）解析式和生成器表达式比用循环效率更高。

- 13、避免在循环中用 + 或 += 来连续拼接字符串。因为字符串是不变型，这会毫无必要地建立很多临时对象，从而成为二次方级别的运算量而不是线性运算时间。

- 14、多去了解标准库，标准库中用很多好用的功能，能够更优雅的解决问题，如 pkgutil.get_data()、operator.methodcaller() 等等。

## 参考资料

- [https://www.python.org/dev/peps/pep-0008/](https://www.python.org/dev/peps/pep-0008/)
- [http://www.elias.cn/Python/PythonStyleGuide](http://www.elias.cn/Python/PythonStyleGuide)
- [https://my.oschina.net/u/1433482/blog/464444](https://my.oschina.net/u/1433482/blog/464444)
- [http://nanshu.wang/post/2015-07-04/](http://nanshu.wang/post/2015-07-04/)
- [https://zhuanlan.zhihu.com/p/25696847](https://zhuanlan.zhihu.com/p/25696847)
- [https://zhuanlan.zhihu.com/p/25715093](https://zhuanlan.zhihu.com/p/25715093)
