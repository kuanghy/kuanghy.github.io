---
layout: post
title: "Python 缓存机制与 functools.lru_cache"
keywords: python functools cache
description: "缓存是一种将定量数据加以保存以备迎合后续请求的处理方式，旨在加快数据的检索速度。"
category: Python
tags: python functools cache
---

缓存是一种将定量数据加以保存以备迎合后续请求的处理方式，旨在加快数据的检索速度。我们先通过一个简单的例子来了解缓存机制的概念：

{% highlight python %}
# -*- coding: utf-8 -*-

import datetime 
import random 
 
class MyCache: 
    """""" 
    def __init__(self): 
        """Constructor""" 
        self.cache = {} 
        self.max_cache_size = 10 

    def __contains__(self, key): 
        """ 
        根据该键是否存在于缓存当中返回True或者False 
        """ 
        return key in self.cache 
 
    def update(self, key, value): 
        """ 
        更新该缓存字典，您可选择性删除最早条目 
        """ 
        if key not in self.cache and len(self.cache) >= self.max_cache_size: 
            self.remove_oldest() 
        self.cache[key] = {'date_accessed': datetime.datetime.now(), 
                           'value': value} 
 
    def remove_oldest(self): 
        """ 
        删除具备最早访问日期的输入数据 
        """ 
        oldest_entry = None 
 
        for key in self.cache: 
            if oldest_entry == None: 
                oldest_entry = key 
            elif self.cache[key]['date_accessed'] < self.cache[oldest_entry]['date_accessed']: 
                oldest_entry = key 
 
        self.cache.pop(oldest_entry) 
 
    @property 
    def size(self): 
        """ 
        返回缓存容量大小 
        """ 
        return len(self.cache) 

if __name__ == '__main__': 
    #测试缓存 
    keys = ['test', 'red', 'fox', 'fence', 'junk', \
            'other', 'alpha', 'bravo', 'cal', 'devo', 'ele'] 
    s = 'abcdefghijklmnop' 
    cache = MyCache() 
    for i, key in enumerate(keys): 
        if key in cache: 
            continue 
        else: 
            value = ''.join([random.choice(s) for i in range(20)]) 
            cache.update(key, value) 
        print("#%s iterations, #%s cached entries" % (i+1, cache.size)) 
{%endhighlight %}

以上示例大致展示了缓存机制的原理。通过用键值对的防止将数据放到字典中，如果下次需要取值时可以直接到字典中获取。

在 Python 的 3.2 版本中，引入了一个非常优雅的缓存机器，即 `functool` 模块中的 `lru_cache` 装饰器。如果要在 python2 中使用 lru_cahce 需要安装 `functools32`。`lru_cache` 原型如下：

> @functools.lru_cache(maxsize=None, typed=False)

使用functools模块的lur_cache装饰器，可以缓存最多 maxsize 个此函数的调用结果，从而提高程序执行的效率，特别适合于耗时的函数。参数`maxsize`为最多缓存的次数，如果为None，则无限制，设置为2n时，性能最佳；如果 `typed=True`（注意，在 functools32 中没有此参数），则不同参数类型的调用将分别缓存，例如 f(3) 和 f(3.0)。

被 lru_cache 装饰的函数会有 `cache_clear` 和 `cache_info` 两个方法，分别用于清除缓存和查看缓存信息。

这里用一个示例演示 lru_cache 效果：

{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  lru_cache.py
#       Author @  Huoty
#  Create date @  2016-04-09 13:54:25
#  Description @  
# *************************************************************

import time
import urllib
import functools32

def timeit(func):
    @functools32.wraps(func)
    def wrapper(*args, **kw):
        start = time.time()
        result = func(*args, **kw)
        end = time.time()
        print "Total time running %s: %s." % (func.__name__, str(end-start))
        return result
    return wrapper
    
@functools32.lru_cache(maxsize=24) 
@timeit
def get_webpage(num): 
    """ 
    获取特定Python模块网络页面 
    """     
    webpage = "http://www.python.org/dev/peps/pep-%04d/".format(num) 
    print webpage
    try: 
        with urllib.request.urlopen(webpage) as request: 
            return request.read() 
    except Exception:
        return None 

# Script starts from here
 
 
if __name__ == '__main__': 
    numt = (8, 290, 308, 320, 8, 218, 320, 279, 289, 320, 9991) 
    for num in numt: 
        page = get_webpage(num) 
        print page
        if page: 
            print("{} module page found".format(num)) 

    for i in range(8):
        print i
        get_webpage("functools")

    get_webpage("time")
    print get_webpage.cache_info()
    get_webpage.cache_clear()
    print get_webpage.cache_info()
    print dir(get_webpage)
{% endhighlight %}