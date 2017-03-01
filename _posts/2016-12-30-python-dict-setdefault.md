---
layout: post
title: "Python 字典的 setdefault 方法"
keywords: Python dict setdefault 字典 缺省值
description: "Python字典的setdefault方法用于设置缺省值并返回"
category: Python
tags: Python dict 
---

Python 字典的 setdefault 方法原型如下：

```python
dict.setdefault(key, default=None)
```

如果给定的 key 在字典中则返回该值，如果不在字典中，就将 key 插入到字典中，并将值设置为指定的 default 参数，default 的缺省值为 None。使用 setdefault 方法相当于如下的操作：

```python
if key in dict:
    reurn dict[key]
else:
    dict[key] = default
    return default
```

该方法与字典的 get 方法有些相似，但有些区别。dict.get 和 dict.setdefault 方法在 key 存在于字典中时都能返回该值，在 key 不在字典中时，也都能返回缺省的值。两个方法的区别在于，当 key 不在字典中时 setdefault 方法会在字典插入缺省的键值并返回，而 get 方法只返回缺省值，不向字典中插入新的 key。

示例：

```python
>>> dct = {}
>>> dct
{}
>>> dct["name"] = "huoty"
>>> dct
{'name': 'huoty'}
>>> dct.setdefault("name", "esenich")
'huoty'
>>> dct
{'name': 'huoty'}
>>> dct.setdefault("fname", "esenich")
'esenich'
>>> dct
{'name': 'huoty', 'fname': 'esenich'}
>>> dct.setdefault("addr")
>>> dct
{'name': 'huoty', 'fname': 'esenich', 'addr': None}
>>> dct.get("name", "xxx")
'huoty'
>>> dct
{'name': 'huoty', 'fname': 'esenich', 'addr': None}
>>> dct.get("age")
>>> dct
{'name': 'huoty', 'fname': 'esenich', 'addr': None}
>>> dct.get("age", 2)
2
>>> dct
{'name': 'huoty', 'fname': 'esenich', 'addr': None}
```

