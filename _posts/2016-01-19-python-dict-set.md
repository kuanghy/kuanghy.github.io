---
layout: post
title: "Python 字典与集合"
keywords: Python 字典 集合
description: "字典是 Python 语言中唯一的映射类型。集合类型是由不同的元素组成的集合。"
category: python
tags: Python 字典 集合
---
{% include JB/setup %}

## 字典

字典是 Python 语言中唯一的映射类型。一个字典对象是可变的,它是一个容器类型,能存储任意个数的 Python 对象,其中也包括其他容器类型。字典类型和序列类型容器类(列表、元组)的区别是存储和访问数据的方式不同。序列类型只用数字类型的键(从序列的开始起按数值顺序索引)。映射类型可以用其他对象类型做键;一般最常见的是用字符串做键(keys)。和序列类型的键不同,映射类型的键(keys)直接,或间接地和存储的数据值相关联。但因为在映射类型中,我们不再用"序列化排序"的键(keys),所以映射类型中的数据是无序排列的。

字典的条目被包含在大括号( { } ) 里，字典的创建如下所示：

<pre>
>>> d1 = {}
>>> d2 = {"name": "huoty", "email": "sudohuoty@163.com"}
>>> d1, d2
({}, {'name': 'huoty', 'email': 'sudohuoty@163.com'})
>>> d3 = dict((['x', 1], ['y', 2]))
>>> d3
{'y': 2, 'x': 1}
</pre>

访问字典中的值需要用字典的键，并用键查找操作符([])进行访问，如下所示：

<pre>
>>> d = {"name": "huoty", "email":"sudohuoty@163.com"}
>>> d["name"]
'huoty'
>>> d["email"]
'sudohuoty@163.com'
</pre>

如果要遍历字典，则需要用 for 进行迭代：

<pre>
>>> for key in d:
...     print "key = %s, value = %s" % (key, d[key])
... 
key = name, value = huoty
key = email, value = sudohuoty@163.com
>>> for key, val in d.items():
...     print "key = %s, value = %s" % (key, val)
... 
key = name, value = huoty
key = email, value = sudohuoty@163.com
</pre>

要更新（添加或修改）字典，如下所示：

<pre>
>>> d
{'name': 'huoty', 'email': 'sudohuoty@163.com'}
>>> d["name"] = "Konghy"  # 更新
>>> d["addr"] = "beijing"  # 增加元素
>>> d
{'addr': 'beijing', 'name': 'Konghy', 'email': 'sudohuoty@163.com'}
</pre>

删除字典元素或者字典本身：

<pre>
>>> d
{'addr': 'beijing', 'name': 'Konghy', 'email': 'sudohuoty@163.com'}
>>> del d["addr"]  # 删除指定元素
>>> d
{'name': 'Konghy', 'email': 'sudohuoty@163.com'}
>>> d.clear()  # 删除所有条目
>>> d
{}
>>> del d  # 删除字典
>>> d
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in &lt;module>
NameError: name 'd' is not defined
</pre>

### 映射类型操作符

字典可以与所有的标准类型操作符一起工作，但并**不像序列那样支持拼接和重复**，而比较运算符和成员关系运算符是可以应用于字典的。如下所示：

<pre>
>>> d1 = {"abc": 123}
>>> d2 = {"abc": 456}
>>> d3 = {"abc": 123, 12.18: 25}
>>> d4 = {"xyz": 123}
>>> d1 > d2
False
>>> (d1 < d2) and (d3 < d4)
False
>>> (d2 < d3) and (d2 < d4)
True
>>> d3 < d4
False
>>> "abc" in d1
True
>>> "abc" in d4
False
</pre>

**字典的比较:**

- （1）首先比较字典的长度
- （2）然后比较字典的键
- （3）如果长度和键都相同，则再比较字典的值

### 映射类型的内建函数和工厂函数 

基本函数：

<pre>
type(obj)  工厂方法，会返回字典类型
str(obj)  工厂方法，返回该字典的字符串表示形式
cmp(boj)  比较字典大小，Python3已废弃
dict([container])   创建字典的工厂函数。如果提供了容器类 (container) ， 就用其中的条目填充字典，否则就创建一个空字典。 
len(mapping)         返回映射的长度(键-值对的个数) 
hash(obj)           返回 obj 的哈希值 
</pre>

内建方法：

<pre>
dict.clear()          删除字典中所有元素 
dict.copy()         返回字典(浅复制)的一个副本 
dict.fromkeys(seq, val=None) 创建并返回一个新字典，以 seq 中的元素做该字典的键，val 做该字典中所有键对应的初始值(如果不提供此值，则默认为 None) 
dict.get(key, default=None)        对字典 dict 中的键 key,返回它对应的值 value，如果字典中不存在此键，则返回 default 的值(注意，参数 default 的默认值为 None) 
dict.has_key(key)   如果键(key)在字典中存在， 返回 True， 否则返回 False. 在 Python2.2 版本引入 in 和 not in 后，此方法几乎已废弃不用了，但仍提供一个可工作的接口。 
dict.items()        返回一个包含字典中(键, 值)对元组的列表 
dict.keys()         返回一个包含字典中键的列表 
dict.iter()         方法 iteritems(), iterkeys(), itervalues()与它们对应的非迭代方法一样，不同的是它们返回一个迭代子，而不是一个列表。 
dict.pop(key[, default])      和方法 get()相似，如果字典中 key 键存在，删除并返回 dict[key]，如果 key 键不存在，且没有给出 default 的值，引发 KeyError 异常。  
dict.setdefault(key, default=None)      和方法 set()相似，如果字典中不存在 key 键，由 dict[key]=default 为它赋值。 
dict.update(dict2)  将字典 dict2 的键-值对添加到字典 dict  
dict.values()       返回一个包含字典中所有值的列表 
</pre>

### 字典的键

-  不允许一个键对应多个值 

-  键必须是可哈希的 

## 集合类型

数学上， 把 set 称做由不同的元素组成的集合，集合(set)的成员通常被称做集合元素(set elements)。 Python 把这个概念引入到它的集合类型对象里。 集合对象是一组无序排列的可哈希的值。是的， 集合成员可以做字典中的键。 数学集合转为Python的集合对象很有效， 集合关系测试和union、intersection 等操作符在 Python 里也同样如我们所预想地那样工作。 

和其他容器类型一样，集合支持用 in 和 not in 操作符检查成员, 由 len() 内建函数得到集合的基数(大小),  用 for 循环迭代集合的成员。但是因为集合本身是无序的，你不可以为集合创建索引或执行切片(slice)操作，也没有键(keys)可用来获取集合中元素的值。 

集合(sets)有两种不同的类型，可变集合(set) 和 不可变集合(frozenset)。如你所想，对可变集合(set)，你可以添加和删除元素，对 不可变集合(frozenset)则不允许这样做。请注意，可变集合(set)不是可哈希的，因此既不能用做字典的键也不能做其他集合中的元素。不可变集合(frozenset)则正好相反，即，他们有哈希值，能被用做字典的键或是作为集合中的一个成员。 

集合与列表( [ ] )和字典( { } ) 不同，没有特别的语法格式。列表和字典可以分别用他们自己的工厂方法 list() 和 dict() 创建，这也是集合被创建的唯一方法 - 用集合的工厂方法 set() 和 frozenset(): 

<pre>
>>> s = set("Hello World")
>>> s
set([' ', 'e', 'd', 'H', 'l', 'o', 'r', 'W'])
>>> t = frozenset("Hello Python")
>>> t
frozenset([' ', 'e', 'H', 'l', 'o', 'n', 'P', 't', 'h', 'y'])
>>> type(t)
&lt;type 'frozenset'>
>>> type(s)
&lt;type 'set'>
>>> len(s)
8
>>> len(t)
10
>>> s == t
False
>>> "k" in s
False
>>> "k" in t
False
>>> for i in s:
...     print i
... 
 
e
d
H
l
o
r
W
</pre>