---
layout: post
title: Python 对象拷贝 -- 浅拷贝与深拷贝
category: python
tags: 浅拷贝 深拷贝
---

在python中，对象赋值实际上是对象的引用。当创建一个对象，然后把它赋给另一个变量的时候，python并没有拷贝这个对象，而只是拷贝了这个对象的引用。

比如，我们创建一个通用的银行账户档案名为 persion，然后然后创建两个账户，即作两份拷贝。这里我们采用两种不同的拷贝对象的方式，一种是使用切片操作，另一种是采用工厂方法list。为了区分出三个不同的对象，我们使用id()内建函数来显示每个对象的标识符：

<div class="hblock"><pre>
>>> person = ['name', ['savings', 100.00]]
>>> hubby = person[:] # slice copy
>>> wifey = list(person) # fac func copy
>>> [id(x) for x in person, hubby, wifey]
[11826320, 12223552, 11850936]
</pre></div>

这里我们为一对夫妻创建了初始有$100 的个人存款帐户。用户名改为定制的名字。但是,当丈夫取走$50后,他的行为影响到了他妻子的账户,虽然我们进行了分开的拷贝(当然,前提是我们希望他们每个人都拥有自己单独的帐号,而不是一个单一的联合帐号)。为什么会这样呢?

<div class="hblock"><pre>
>>> hubby[0] = 'joe' 
>>> wifey[0] = 'jane' 
>>> hubby, wifey 
(['joe', ['savings', 100.0]], ['jane', ['savings', 100.0]]
>>> hubby[1][1] = 50.00 
>>> hubby, wifey 
(['joe', ['savings', 50.0]], ['jane', ['savings', 50.0]])
</pre></div>

原因是我们仅仅做了一个浅拷贝。对一个对象进行浅拷贝其实是新创建了一个类型跟原对象一样，其内容是原来对象元素的引用，换句话说，这个拷贝的对象本身是新的，但是它的内容不是。序列类型对象的浅拷贝是默认类型拷贝，浅拷贝有以下几种方式：(1)完全切片操作[:]，(2)利用工厂函数,比如 list(),dict()等,(3)使用 copy 模块的 copy 函数.。

也许你会发现，当妻子的名字被赋值时，丈夫的名字却没有跟着变化。这是**因为在这两个列表的两个对象中，第一个对象是不可变的(是个字符串类型)，而第二个是可变的(一个列表)。**正因为如此，当进行浅拷贝时，字符串被显式的拷贝，并新创建了一个字符串对象，而列表元素只是把它的引用复制了一下，并不是它的成员。所以改变名字没有任何问题，但是更改他们银行账号的任何信息都会引发问题。现在，让我们分别看一下每个列表的元素的对象 ID 值，注意，银行账号对象是同一个对象，这也是为什么对一个对象进行修改会影响到另一个的原因。注意在我们改变他们的名字后，新的名字字符串是如何替换原有'名字'字符串的：

BEFORE：

<div class="hblock"><pre>
>>> [id(x) for x in hubby] 
[9919616, 11826320] 
>>> [id(x) for x in wifey] 
[9919616, 11826320] 
</pre></div>

AFTER:

<div class="hblock"><pre>
>>> [id(x) for x in hubby] 
[12092832, 11826320] 
>>> [id(x) for x in wifey] 
[12191712, 11826320] 
</pre></div>

如果要为这对夫妻创建一个联合的账户，这种方案是一个不错的选择。但是，我们需要一个分离的账户，让账户间互不相干。要得到一个完全拷贝或者说深拷贝 -- 创建一个新的容器对象，包含原有对象元素（引用）全新拷贝的引用 -- 需要 **copy.deepcopy()** 函数。我们使用深拷贝来重写整个例子: 

<div class="hblock"><pre>
>>> person = ['name', ['savings', 100.00]] 
>>> hubby = person 
>>> import copy 
>>> wifey = copy.deepcopy(person) 
>>> [id(x) for x in person, hubby, wifey] 
[12242056, 12242056, 12224232] 
>>> hubby[0] = 'joe' 
>>> wifey[0] = 'jane' 
>>> hubby, wifey 
(['joe', ['savings', 100.0]], ['jane', ['savings', 100.0]]) 
>>> hubby[1][1] = 50.00 
>>> hubby, wifey 
(['joe', ['savings', 50.0]], ['jane', ['savings', 100.0]]) 
</pre></div>

这便是我们想要的结果，我们验证一下所有四个对象是否是不同的：

<div class="hblock"><pre>
>>> [id(x) for x in hubby] 
[12191712, 11826280] 
>>> [id(x) for x in wifey] 
[12114080, 12224792] 
</pre></div>

**注：** <span class="emphasis">关于拷贝操作的警告:  第一，非容器类型(比如数字，字符串和其他"原子"类型的对象，像代码，类型和 xrange 对象等)没有被拷贝一说，浅拷贝是用完全切片操作来完成的。第二，如果元组变量只包含原子类型对象，对它的深拷贝将不会进行。</span>如果我们把账户信息改成元组类型，那么即便按我们的要求使用深拷贝操作也只能得到一个浅拷贝。

<div class="hblock"><pre>
>>> person = ['name', ('savings', 100.00)] 
>>> newPerson = copy.deepcopy(person) 
>>> [id(x) for x in person, newPerson] 
[12225352, 12226112] 
>>> [id(x) for x in person] 
[9919616, 11800088] 
>>> [id(x) for x in newPerson] 
[9919616, 11800088] 
</pre></div>

浅拷贝和深拷贝操作都可以在 copy 模块中找到。其实 copy 模块中只有两个函数可用：**copy()进行浅拷贝操作，而 deepcopy()进行深拷贝操作**。 

***本文内容参考《Python核心编程》一书中的第 6.20 节.***
