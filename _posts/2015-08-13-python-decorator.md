---
layout: post
title: Python 函数式编程、装饰器以及一些相关概念简介
category: python
tags: python 函数式编程 装饰器
---

## 命名空间
Python中通过提供 namespace 来实现重名函数/方法、变量等信息的识别。其大致可以分为三种 namespace，分别为：

- local namespace: 局部空间，作用范围为当前函数或者类方法
- global namespace: 全局空间，作用范围为当前模块
- build-in namespace: 内建空间，在 Python 解释器启动时就已经具有的命名空间，作用范围为所有模块。例如：abs，all，chr，cmp，int，str等内建函数，它们在解释器启动时就被自动载入。

当函数/方法、变量等信息发生重名时，Python会按照 local namespace -> global namespace -> build-in namespace的顺序搜索用户所需元素，并且以第一个找到此元素的 namespace 为准。

<br/>
## 闭包
闭包（Closure）是词法闭包（Lexical Closure）的简称。简单地说，闭包就是根据不同的配置信息得到不同的结果。对闭包的具体定义有很多种说法，大致可以分为两类：

* 一种说法认为闭包是符合一定条件的函数，比如一些参考资源中这样定义闭包：闭包是在其词法上下文中引用了自由变量的函数。

* 另一种说法认为闭包是由函数和与其相关的引用环境组合而成的实体。比如一些参考资源中这样来定义：在实现深约束时，需要创建一个能显式表示引用环境的东西，并将它与相关的子程序捆绑在一起，这样捆绑起来的整体被称为闭包。

以上两种定义从某种意义上来说是对立的，一个认为闭包是函数，另一个认为闭包是函数和引用环境组成的整体。闭包确实可以认为就是函数，但第二种说法更确切些。闭包只是在形式和表现上像函数，但实际上不是函数。函数是一些可执行的代码，这些代码在函数被定义后就确定了，不会在执行时发生变化，所以一个函数只有一个实例。

闭包在运行时可以有多个实例，不同的引用环境和相同的函数组合可以产生不同的实例。所谓引用环境是指在程序执行中的某个点所有处于活跃状态的约束所组成的集合。其中的约束是指一个变量的名字和其所代表的对象之间的联系。那么为什么要把引用环境与函数组合起来呢？这主要是因为在支持嵌套作用域的语言中，有时不能简单直接地确定函数的引用环境。

在 Python 语言中，可以这样简单的理解闭包：一个闭包就是调用了一个函数A，这个函数A返回了一个函数B。这个返回的函数B就叫做闭包。在调用函数A的时候传递的参数就是对不同引用环境所做的配置。如下示例所示：

{% highlight python %}
def make_adder(addend):
    def adder(augend):
        return augend + addend
    return adder

p = make_adder(23)
q = make_adder(44)

print p(100)
print q(100)
{% endhighlight %}

<br/>
## 函数式编程
函数式编程使用一系列的函数解决问题。函数仅接受输入并产生输出，不包含任何能影响产生输出的内部状态。任何情况下，使用相同的参数调用函数始终能产生同样的结果。

函数式编程就是一种抽象程度很高的编程范式，纯粹的函数式编程语言编写的函数没有变量，因此，任意一个函数，只要输入是确定的，输出就是确定的，这种纯函数我们称之为没有副作用。而允许使用变量的程序设计语言，由于函数内部的变量状态不确定，同样的输入，可能得到不同的输出，因此，这种函数是有副作用的。函数式编程的一个特点就是，允许把函数本身作为参数传入另一个函数，还允许返回一个函数！

可以认为函数式编程刚好站在了面向对象编程的对立面。对象通常包含内部状态（字段），和许多能修改这些状态的函数，程序则由不断修改状态构成；函数式编程则极力避免状态改动，并通过在函数间传递数据流进行工作。但这并不是说无法同时使用函数式编程和面向对象编程，事实上，复杂的系统一般会采用面向对象技术建模，但混合使用函数式风格也能体现函数式风格的优点。

<br/>
## 高阶函数
高阶函数即能接受函数作为参数的函数。在Python中，变量可以指向函数，函数名其实也是指向函数的变量。也就是说，我们可以将函数赋给其他变量，也就可以将函数作为参数传递给其他函数。示例：

{% highlight python %}
def add(x, y, f):
	return f(x) + f(y)

add(-6, 9, abs)
{% endhighlight %}

<br/>
## 装饰器（decorator）
Python装饰器的作用就是为已经存在的对象添加额外的功能。例如装饰器可以用来：**引入日志**、**添加计时逻辑来检测性能**、**给函数加入事务处理**。其实总体说起来，装饰器其实也就是一个函数，一个用来包装函数的函数，装饰器在函数申明完成的时候被调用，调用之后申明的函数被换成一个被装饰器装饰过后的函数。简单说，本质上，装饰器就是一个返回函数的高阶函数，也是一个闭包。

例如，我们想要知道一个函数被调用时所花的时间，可以采用如下的方式实现：

{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  timeit.py
#       Author @  Huoty
#  Create date @  2015-08-12 10:37:10
#  Description @  
# *************************************************************

import time
 
def foo():
    print 'in foo()'
 
# 定义一个计时器，传入一个函数，并返回另一个附加了计时功能的方法
def timeit(func):
     
    # 定义一个内嵌的包装函数，给传入的函数加上计时功能的包装
    def wrapper():
        start = time.clock()
        func()
        end =time.clock()
        print 'used:', end - start
     
    # 将包装后的函数返回
    return wrapper

# Script starts from here

foo = timeit(foo)
foo()
{% endhighlight %}

Python实现装饰器的目的就是为了让程序更加简洁，上边的代码可以继续用装饰器来简化：

{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  timeit.py
#       Author @  Huoty
#  Create date @  2015-08-12 10:37:10
#  Description @  
# *************************************************************

import time
 
def timeit(func):
    def wrapper():
        start = time.clock()
        func()
        end =time.clock()
        print 'used:', end - start
    return wrapper

@timeit
def foo():
    print 'in foo()'

# Script starts from here

foo()
{% endhighlight %}

装饰器的语法以**@**开头，接着是装饰器要装饰的函数的申明。由上例可以看出，装饰器 @timeit 的作用等价与 foo = timeit(foo)。被装饰器装饰后的执行结果取决于装饰函数的是想，如果装饰函数返回被装饰函数本身，就等于没有装饰，如果装饰函数对被装饰函数进行了包装，并返回包装后的函数，那调用函数时执行的就是包装过的函数。

如果装饰的函数带有参数，则在装饰器中也应该为包装函数提供对应的参数。如果被装饰的函数参数不确定，则可以用如下方式实现：

{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  callin.py
#       Author @  Huoty
#  Create date @  2015-08-12 10:59:11
#  Description @  
# *************************************************************

import time

def log(func):
    def wrapper(*args, **kw):
        print "call %s." % func.__name__
        return func(*args, **kw)
    return wrapper

@log
def now():
    print time.asctime()

# Script starts from here

now()
{% endhighlight python %}

当然，装饰器本身也可以带参数，但是通常对参数会有一定的要求。由于有参数的装饰器函数在调用时只会使用应用时的参数，而不接收被装饰的函数做为参数，所以必须在其内部再创建一个函数。如下示例所示：

{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  decopara.py
#       Author @  Huoty
#  Create date @  2015-08-12 11:13:30
#  Description @  
# *************************************************************

def deco(arg):
    def _deco(func):
        def __deco():
            print("before %s called [%s]." % (func.__name__, arg))
            func()
            print("  after %s called [%s]." % (func.__name__, arg))
        return __deco
    return _deco
 
@deco("module")
def foo():
    print(" foo() called.")
 
@deco("module2")
def hoo():
    print(" hoo() called.")
 
# Script starts from here

foo()
hoo()
{% endhighlight %}

上例中的第一个函数 deco 是装饰器函数，它的参数是用来加强“加强装饰”的。由于此函数并非被装饰的函数对象，所以在内部必须至少创建一个接受被装饰函数的函数，然后返回这个对象（实际上此时foo=decomaker(arg)(foo)）。

#### 内置装饰器
内置的装饰器有三个，分别是staticmethod、classmethod和property，作用分别是把类中定义的实例方法变成静态方法、类方法和类属性。由于模块里可以定义函数，所以静态方法和类方法的用处并不是太多，除非你想要完全的面向对象编程。

#### Functools模块
Python的functools模块主要功能是对函数进行包装，增加原有函数的功能，起主要内容包括：`cmp_to_key`, `partial`, `reduce`, `total_ordering`, `update_wrapper`, `wraps`。

函数也是一个对象，它有`__name__`等属性。以上我们有一个 callin.py 的例子，我们用装饰器装饰之后的 now 函数，当我们用 `now.__name__` 查看时，发现它的 `__name__` 已经从原来的'now'变成了'wrapper'。因为返回的那个wrapper()函数名字就是'wrapper'，所以，需要把原始函数的__name__等属性复制到wrapper()函数中，否则，有些依赖函数签名的代码执行就会出错。当然，我们可以用`wrapper.__name__ = func.__name__`来实现，但是我们不必这么麻烦，用 Python 内置的 functools.wraps 便可实现这样的功能：

{% highlight python %}
import functools

def log(text):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator
{% endhighlight %}

## 参考资料
http://developer.51cto.com/art/201006/208139.htm<br/>
http://www.cnblogs.com/ma6174/archive/2013/04/15/3022548.html<br/>
http://www.cnblogs.com/huxi/archive/2011/06/18/2084316.html<br/>
http://www.cnblogs.com/rollenholt/archive/2012/05/02/2479833.html<br/>