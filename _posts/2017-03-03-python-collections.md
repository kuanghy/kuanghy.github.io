---
layout: post
title: "Python 模块简介 -- collections"
keywords: Python collections namedtuple deque counter orderdict defaultdict chainmap
description: "collections模块定义了一些扩展的数据类型"
category:
tags: python
---

Python 的内置数据数据类型包括 str, int, list, tuple, set, dict 等，有时候这些数据类型可能满足不了我们的需求。不过标准库的 collections 模块在这些内置数据类型的基础上，提供了几个额外的数据类型：

| 类型        | 说明                                          | 备注                |
|:------------|:----------------------------------------------|:--------------------|
| namedtuple  | 命名元组，使用名字访问元素                    | New in version 2.6. |
| deque       | 双端队列，可以快速的从头/尾两端添加或删除元素 | New in version 2.4. |
| Counter     | 计数器，用于对某项数据进行计数                | New in version 2.7. |
| OrderedDict | 有序字典，按 key 对字典元素排序               | New in version 2.7. |
| defaultdict | 带有默认值的字典                              | New in version 2.5. |
| ChainMap    | 合并多个 map(dict)，但保持原数据结构          | New in version 3.3  |
| UserDict    | 将字典包装起来使得创建字典的子类更容易        |                     |
| UserList    | 列表对象的包装器                              |                     |
| UserString  | 字符串对象的包装器                            |                     |

## namedtuple

`namedtuple` 主要用来产生可以使用名称来访问元素的数据对象，其原型为：

```python
collections.namedtuple(typename, field_names, *, verbose=False, rename=False, module=None)
```

`field_names` 用于指定数据对象的元素，可以是一个 str，例如 `'x y'` 或者 `'x, y'`，也可以是一个包含字符串的序列类型，像 `['x', 'y']`。使用示例：

```python
>>> Point = namedtuple('Point', ['x', 'y', 'z'])
>>> p = Point(10, 11, 12)
>>> p
Point(x=10, y=11, z=12)
>>> p.x
10
>>> p.x + p.y + p.z
33
>>> p2 = Point(11, y=22, z=33)
>>> p2
Point(x=11, y=22, z=33)
>>> d = p2._asdict()      # 转换为字典
>>> d
OrderedDict([('x', 11), ('y', 22), ('z', 33)])
>>> p2._replace(y=100)    # 替换元素值
Point(x=11, y=100, z=33)
>>> p._fields             # 查看对象字段
('x', 'y', 'z')
>>> Point._make(range(3)) # 通过一个序列或者可迭代对象创建一个对象
Point(x=0, y=1, z=2)
```

## deque

`deque` 是 double-ended queue 的缩写，即双端队列。List 存储数据的优势在于按索引查找元素会很快，但是插入和删除元素就很慢了，因为 list 是基于数组实现的。deque 是为了高效实现插入和删除操作的双向列表，list存储数据的优势在于按索引查找元素会很快，但是插入和删除元素就很慢了，因为list是基于数组实现的。deque是为了高效实现插入和删除操作的双向列表，适合用于队列和栈，而且线程安全。其原型：

```python
collections.deque([iterable[, maxlen]])
```

Deque 除了包含 list 的方法外，还新增了`appendleft/popleft` 等方法允许我们高效的在元素的开头来插入/删除元素，其插入删除元素的时间复杂度约为 O(1)，而 list 则为 O(n).

如果 maxlen 没有指定或者为 None，则队列为无限长，否则为有限序列，每次插入元素，先前的元素都会被挤掉。示例:

```python
>>> dq = deque()
>>> dq
deque([])
>>> dq.extend([1, 2, 3])
>>> dq.extend([1, 2, 3])
>>> dq
deque([1, 2, 3, 1, 2, 3])
>>> dq = deque(maxlen=2)
>>> dq
deque([], maxlen=2)
>>> dq.append(1)
>>> dq.append(1)
>>> dq
deque([1, 1], maxlen=2)
>>> dq.append(3)
>>> dq
deque([1, 3], maxlen=2)
>>> dq.append(4)
>>> dq
deque([3, 4], maxlen=2)
>>> dq.appendleft(5)
>>> dq
deque([5, 3], maxlen=2)
```

Deque 还要一些其他的好用方法，如 rotate，下例是一个类似于跑马灯的程序：

```python
import sys
import time
from collections import deque

fancy_loading = deque('>--------------------')

while True:
    print '\r%s' % ''.join(fancy_loading),
    fancy_loading.rotate(1)
    sys.stdout.flush()
    time.sleep(0.08)
```

## Counter

Counter 用来统计相关元素的出现次数。原型：

```python
collections.Counter([iterable-or-mapping])
```

示例：

```python
>>> c = Counter('abracadabra')
>>> c
Counter({'a': 5, 'r': 2, 'b': 2, 'd': 1, 'c': 1})
>>> c.update('zzzbbe')  # 追加元素
>>> c
Counter({'a': 5, 'b': 4, 'z': 3, 'r': 2, 'e': 1, 'c': 1, 'd': 1})
>>> c.most_common(3)  # 获取出现频率最高的前 3 个字符
[('a', 5), ('b', 4), ('z', 3)]
```

## OrderedDict

OrderedDict 是 dict 的一个子类，支持所有 dict 的方法，它能够保持 dict 的有序性。其原型：

> collections.OrderedDict([items])

示例：

```python
>>> d = OrderedDict({'banana': 3, 'apple': 4, 'pear': 1, 'orange': 2})
>>> d
OrderedDict([('banana', 3), ('apple', 4), ('pear', 1), ('orange', 2)])
>>> d['cherry'] = 8
>>> d
OrderedDict([('banana', 3), ('apple', 4), ('pear', 1), ('orange', 2), ('cherry', 8)])
>>> for k, v in d.items():
...     print(k, v)
...
...
banana 3
apple 4
pear 1
orange 2
cherry 8
>>> d.keys()
odict_keys(['banana', 'apple', 'pear', 'orange', 'cherry'])
>>> d.pop('apple')
4
>>> d
OrderedDict([('banana', 3), ('pear', 1), ('orange', 2), ('cherry', 8)])
```

OrderedDict 还额外实现了两个方法：

- popitem(last=True)

按照 LIFO(先进后出) 的顺序删除 dict 中的 key-value，即删除最后一个插入的键值对，如果 last=False 就按照FIFO(先进先出) 删除 dict 中 key-value。

```python
>>> d = OrderedDict({'banana': 3, 'apple': 4, 'pear': 1, 'orange': 2})
>>> d
OrderedDict([('banana', 3), ('apple', 4), ('pear', 1), ('orange', 2)])
>>> d.popitem()
('orange', 2)
>>> d
OrderedDict([('banana', 3), ('apple', 4), ('pear', 1)])
>>> d.popitem(last=False)
('banana', 3)
>>> d
OrderedDict([('apple', 4), ('pear', 1)])
```

- move_to_end(key, last=True)

改变有序的 OrderedDict 对象的 key-value 顺序，通过这个方法可以将排序好的 OrderedDict 对象中的任意一个 key-value 插入到字典的开头或者结尾。

```python
>>> d = OrderedDict.fromkeys('abcd')
>>> d
OrderedDict([('a', None), ('b', None), ('c', None), ('d', None)])
>>> d.move_to_end('b')
>>> d
OrderedDict([('a', None), ('c', None), ('d', None), ('b', None)])
>>> d.move_to_end('d', last=False)
>>> d
OrderedDict([('d', None), ('a', None), ('c', None), ('b', None)])
```

## defaultdict

在普通的 dict 之上添加了 default_factory，使得 key 不存在时会自动生成相应类型的 value，default_factory 参数可以指定成 list, set, int 等各种合法类型。原型：

> collections.defaultdict([default_factory[, ...]])

示例：

```python
>>> d = defaultdict(lambda: None)
>>> d
defaultdict(<function <lambda> at 0x1115ef620>, {})
>>> d['a']
>>> print(d['b'])
None
>>> d
defaultdict(<function <lambda> at 0x1115ef620>, {'a': None, 'b': None})
>>> d = defaultdict(int)
>>> d["hello"]
0
>>> d
defaultdict(<class 'int'>, {'hello': 0})
```

## ChainMap

ChainMap 用来成合并多个字典，但和 update 不同，它不会改变原对象，而且效率更高。原型：

```python
collections.ChainMap(*maps)
```

示例：

```python
>>> dict1 = { 'a' : 1, 'b' : 2 }
>>> dict2 = { 'b' : 3, 'c' : 4 }
>>> chain = ChainMap(dict1, dict2)
>>> chain
ChainMap({'a': 1, 'b': 2}, {'b': 3, 'c': 4})
>>> chain.maps
[{'a': 1, 'b': 2}, {'b': 3, 'c': 4}]
>>> chain.keys()
KeysView(ChainMap({'a': 1, 'b': 2}, {'b': 3, 'c': 4}))
>>> list(chain.keys())
['a', 'b', 'c']
>>> chain['b']  # 获取的是第一个字典中的值
2
>>> chain['a']
1
>>> chain['c']
4
>>> chain['d'] = 5
>>> chain['e'] = 6  # 被添加到了第一个字典中
>>> chain
ChainMap({'a': 1, 'd': 5, 'b': 2, 'e': 6}, {'b': 3, 'c': 4})
>>> chain['b'] = 8  # 修改了第一个字典中的值
>>> chain
ChainMap({'a': 1, 'd': 5, 'b': 8, 'e': 6}, {'b': 3, 'c': 4})
>>> m = chain.new_child()  # 复制一个 ChainMap 对象
>>> m['g'] = 10
>>> m
ChainMap({'g': 10}, {'a': 1, 'd': 5, 'b': 8, 'e': 6}, {'b': 3, 'c': 4})
>>> chain
ChainMap({'a': 1, 'd': 5, 'b': 8, 'e': 6}, {'b': 3, 'c': 4})
>>> dict3 = { 'h' : 5 }
>>> new_chain = chain.new_child(dict3)  # 添加新字典
>>> new_chain
ChainMap({'h': 5}, {'a': 1, 'd': 5, 'b': 8, 'e': 6}, {'b': 3, 'c': 4})
```

有时候用 ChainMap 来代替 update 是一个不错的选择。但是又上例可以看出， **对于改变键值或者新增键值对的操作，ChainMap 只会在第一个字典 `self.maps[0][key]` 进行**， 这一点需要格外注意。

## UserDict、UserList、UserString

这三个类是分别对 dict、list、str 三种数据类型的包装，其主要是为方便用户实现自己的数据类型。在 Python2 之前，这三个类分别位于 UserDict、UserList、UserString 三个模块中，需要用类似于 `from UserDict import UserDict` 的方式导入。在 Python3 之后则被挪到了 collections 模块中。这三个类都是基类，如果用户要扩展这三种类型，只需继承这三个类即可。


## 参考

- [https://segmentfault.com/a/1190000007757806](https://segmentfault.com/a/1190000007757806)
- [http://python.jobbole.com/87201/](http://python.jobbole.com/87201/)
- [http://www.zlovezl.cn/articles/collections-in-python/](http://www.zlovezl.cn/articles/collections-in-python/)
