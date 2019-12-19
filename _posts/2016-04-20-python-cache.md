---
layout: post
title: "Python 缓存机制与 functools.lru_cache"
keywords: python functools cache
description: "缓存是一种将定量数据加以保存以备迎合后续获取需求的处理方式，旨在加快数据获取的速度"
category: Python
tags: python
---

缓存是一种将定量数据加以保存以备迎合后续获取需求的处理方式，旨在加快数据获取的速度。数据的生成过程可能需要经过计算，规整，远程获取等操作，如果是同一份数据需要多次使用，每次都重新生成会大大浪费时间。所以，如果将计算或者远程请求等操作获得的数据缓存下来，会加快后续的数据获取需求。

先来一个简单的例子以了解缓存机制的概念：

```python
# -*- coding: utf-8 -*-

import random
import datetime


class MyCache:
    """缓存类"""

    def __init__(self):
        # 用字典结构以 kv 的形式缓存数据
        self.cache = {}
        # 限制缓存的大小，因为缓存的空间有限
        # 所以当缓存太大时，需要将旧的缓存舍弃掉
        self.max_cache_size = 10

    def __contains__(self, key):
        """根据该键是否存在于缓存当中返回 True 或者 False"""
        return key in self.cache

    def get(self, key):
        """从缓存中获取数据"""
        data = self.cache[key]
        data["date_accessed"] = datetime.datetime.now()
        return data["value"]

    def add(self, key, value):
        """更新该缓存字典，如果缓存太大则先删除最早条目"""
        if key not in self.cache and len(self.cache) >= self.max_cache_size:
            self.remove_oldest()
        self.cache[key] = {
            'date_accessed': datetime.datetime.now(),
            'value': value
        }

    def remove_oldest(self):
        """删除具备最早访问日期的输入数据"""
        oldest_entry = None

        for key in self.cache:
            if oldest_entry is None:
                oldest_entry = key
                continue
            curr_entry_date = self.cache[key]['date_accessed']
            oldest_entry_date = self.cache[oldest_entry]['date_accessed']
            if curr_entry_date < oldest_entry_date:
                oldest_entry = key

        self.cache.pop(oldest_entry)

    @property
    def size(self):
        """返回缓存容量大小"""
        return len(self.cache)


if __name__ == '__main__':
    # 测试缓存功能
    cache = MyCache()
    cache.add("test", sum(range(100000)))
    assert cache.get("test") == cache.get("test")

    keys = [
        'red', 'fox', 'fence', 'junk', 'other', 'alpha', 'bravo', 'cal',
        'devo', 'ele'
    ]
    s = 'abcdefghijklmnop'
    for i, key in enumerate(keys):
        if key in cache:
            continue
        else:
            value = ''.join([random.choice(s) for i in range(20)])
            cache.add(key, value)

    assert "test" not in cache
    print(cache.cache)
```

以上示例仅简单的展示了缓存机制的原理，通过用键值对的方式将数据放到字典中，如果下次需要取值时可以直接到字典中获取。该示例在删除旧数据时的实现并不高效，实际应用中可以用别的方式实现。

在 Python 的 3.2 版本中，引入了一个非常优雅的缓存机制，即 `functool` 模块中的 `lru_cache` 装饰器，可以直接将函数或类方法的结果缓存住，后续调用则直接返回缓存的结果。`lru_cache` 原型如下：

> @functools.lru_cache(maxsize=None, typed=False)

使用 functools 模块的 lur_cache 装饰器，可以缓存最多 maxsize 个此函数的调用结果，从而提高程序执行的效率，特别适合于耗时的函数。参数 `maxsize` 为最多缓存的次数，如果为 None，则无限制，设置为 2 的幂 时，性能最佳；如果 `typed=True`（注意，在 functools32 中没有此参数），则不同参数类型的调用将分别缓存，例如 f(3) 和 f(3.0)。

**LRU (Least Recently Used，最近最少使用)** 算法是一种缓存淘汰策略。其根据数据的历史访问记录来进行淘汰，核心思想是，“如果数据最近被访问过，那么将来被访问的几率也更高”。该算法最初为操作系统中一种内存管理的页面置换算法，主要用于找出内存中较久时间没有使用的内存块，将其移出内存从而为新数据提供空间。其原理就如以上的简单示例。

被 `lru_cache` 装饰的函数会有 `cache_clear` 和 `cache_info` 两个方法，分别用于清除缓存和查看缓存信息。以下为一个简单的 lru_cache 的使用效果：

```python
from functools import lru_cache

@lru_cache(None)
def add(x, y):
    print("calculating: %s + %s" % (x, y))
    return x + y

print(add(1, 2))
print(add(1, 2))
print(add(2, 3))
```

输出结果：

```
calculating: 1 + 2
3
3
calculating: 2 + 3
5
```

从结果可以看出，当第二次调用 add(1, 2) 时，并没有真正执行函数体，而是直接返回缓存的结果。

如果要在 Python 2 中使用 lru_cahce 需要安装第三方模块 `functools32`。还有一个用 C 语言实现的，更快的，同时兼容 Python2 和 Python3 的第三方模块 [fastcache](https://github.com/pbrady/fastcache) 能够实现同样的功能，且其能支持 TTL。

`lru_cahce` 是将数据缓存到内存中的，其实也可以将数据缓存到磁盘上。以下示例尝试实现了一个基于磁盘的缓存装饰器：

```python
import os
import uuid
import pickle
import shutil
import tempfile
from functools import wraps as func_wraps


class DiskCache(object):
    """缓存数据到磁盘

    实例化参数:
    -----
        cache_path: 缓存文件的路径
    """

    _NAMESPACE = uuid.UUID("c875fb30-a8a8-402d-a796-225a6b065cad")

    def __init__(self, cache_path=None):
        if cache_path:
            self.cache_path = os.path.abspath(cache_path)
        else:
            self.cache_path = os.path.join(tempfile.gettempdir(), ".diskcache")

    def __call__(self, func):
        """返回一个包装后的函数

        如果磁盘中没有缓存，则调用函数获得结果并缓存后再返回
        如果磁盘中有缓存，则直接返回缓存的结果
        """
        @func_wraps(func)
        def wrapper(*args, **kw):
            params_uuid = uuid.uuid5(self._NAMESPACE, "-".join(map(str, (args, kw))))
            key = '{}-{}.cache'.format(func.__name__, str(params_uuid))
            cache_file = os.path.join(self.cache_path, key)

            if not os.path.exists(self.cache_path):
                os.makedirs(self.cache_path)

            try:
                with open(cache_file, 'rb') as f:
                    val = pickle.load(f)
            except Exception:
                val = func(*args, **kw)
                try:
                    with open(cache_file, 'wb') as f:
                        pickle.dump(val, f)
                except Exception:
                    pass
            return val
        return wrapper

    def clear(self, func_name):
        """清理指定函数调用的缓存"""
        for cache_file in os.listdir(self.cache_path):
            if cache_file.startswith(func_name + "-"):
                os.remove(os.path.join(self.cache_path, cache_file))

    def clear_all(self):
        """清理所有缓存"""
        if os.path.exists(self.cache_path):
            shutil.rmtree(self.cache_path)


cache_in_disk = DiskCache()


@cache_in_disk
def add(x, y):
    return x + y
```

此外，还有一些其他的缓存模块，如 [cachelib](https://github.com/pallets/cachelib), [cacheout](https://github.com/dgilland/cacheout) 等等，实际使用需要时可以按需求去选择合适的缓存实现。
