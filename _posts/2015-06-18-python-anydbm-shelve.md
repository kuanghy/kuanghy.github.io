---
layout: post
title: Python模块简介 -- anydbm, shelve
keywords: python anydbm shelve python模块
category: Python
tags: python python模块
---

anydbm, shelve 是对象持久化保存方法，将对象保存到文件里面，缺省的数据存储文件是二进制的。这两个模块允许我们将一个磁盘上的文件与一个“dict-like”对象（类字典对象）关联起来，操作这个“dict-like”对象，就像操作dict对象一样，最后可以将“dict-like”的数据持久化到文件。对这个"dict-like"对象进行操作的时候，`anydbm`的key和value的类型必须都是是字符串，而`shelve`的key要求必须是字符串，value则可以是任意合法的python数据类型。

使用这两个模块时，只需要使用open函数获取一个shelf对象，然后对数据进行增删改查操作，最后调用close函数便会将数据写入文件。

 anydbm.open(filename[, flag[, mode]])，filename是关联的文件路径，可选参数flag可以是: 'r': 只读, 'w': 可读写, 'c': 如果数据文件不存在，就创建，允许读写; 'n': 每次调用open()都重新创建一个空的文件。mode是unix下文件模式，如0666表示允许所有用户读写。

shelve模块是anydbm的增强版，它支持在"dict-like"对象中存储任何可以被pickle序列化的对象，其key必须是字符串，而值可以为任意合法的python数据类型。下面为一个使用示例：

```python
import shelve
d = shelve.open(filename) # open, with (g)dbm filename -- no suffix

d[key] = data   # store data at key (overwrites old data if
                            # using an existing key)
data = d[key]   # retrieve a COPY of the data at key (raise
                            # KeyError if no such key) -- NOTE that this
                            # access returns a *copy* of the entry!
del d[key]        # delete data stored at key (raises KeyError
                           # if no such key)
flag = d.has_key(key)   # true if the key exists; same as "key in d"
list = d.keys() # a list of all existing keys (slow!)

d.close()       # close it
```
