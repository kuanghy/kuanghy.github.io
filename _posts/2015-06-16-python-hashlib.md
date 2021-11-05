---
layout: post
title: Python模块简介 -- hashlib
keywords: python hashlib python模块
category: Python
tags: python python模块
---

Python 中的 hashlib 模块用来进行 hash 或者 md5 加密。这里的加密，其实并非我们通常所说的加密，简单的说就是这种加密一般是不可逆的。这种加密算法实际上是被称之为 `摘要算法`，包括 MD5，SHA1 等等。MD5 的全称是 Message-Digest Algorithm 5（信息-摘要算法）。SHA1 的全称是 Secure Hash Algorithm(安全哈希算法) 。SHA1 基于 MD5，加密后的数据长度更长。

那么，什么又是摘要算法呢？摘要算法又称哈希算法、散列算法。它通过一个函数，把任意长度的数据转换为一个长度固定的数据串（通常用 16 进制的字符串表示）。摘要算法就是通过摘要函数 `f()` 对任意长度的数据 `data` 计算出固定长度的摘要 `digest`。摘要算法可以用来检验数据是否改变。

摘要算法之所以能指出数据是否被篡改过，就是因为摘要函数是一个单向函数，计算 f(data) 很容易，但通过 digest 反推 data 却非常困难。而且，对原始数据做一个 bit 的修改，都会导致计算出的摘要完全不同。

`hashlib` 是个专门提供 hash 算法的库，里面包括 md5, sha1, sha224, sha256, sha384, sha512。如：

```python
import hashlib

a = "I am huoty"
print(hashlib.md5(a).hexdigest())
print(hashlib.sha1(a).hexdigest())
print(hashlib.sha224(a).hexdigest())
print(hashlib.sha256(a).hexdigest())
print(hashlib.sha384(a).hexdigest())
print(hashlib.sha512(a).hexdigest())
```

输出结果：

```
316edb043e7952cb4a46946723f089df
328bcbd22bde0f22a7725295201592c48a785059
eb89eccd06661f6e06933b665a8b506b130694567ee2448fb4c670de
5f9d71f35cefb56ee3004043e29b0305ae958b5a6047cc104bf5629764b9bd59
0a17b81a235301d79231a8da3ffb53851353dc09ab80e2d38e12887025ffc7640b114222f2a5f0f06144277763cc665e
81ddd09b15efbef758d98421123a65b585fe1eec5117343c1961d6f36411bb806a97e22a3a2d0b8bb89f6407a67ba64b9cfc9e47ccd1ddbdd5984e0c3c8b49bd
```

以下介绍 hashlib 属性和方法：

- **hashlib.algorithms：** 列出所有加密算法 ('md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512')

- **digesti_size：** 16 产生的散列的字节大小。

- **block_size：** 64 The internal block size of the hash algorithm in bytes.

- **new(name, string='')：** 创建指定加密模式的 hash 对象，例如：

```
h = hashlib.new('md5')
h2 = hashlib.new('ripemd160','what')
```

- **update(arg)：** 更新哈希对象以字符串参数,如果同一个 hash 对象重复调用该方法，则 m.update(a); 注： m.update(b) 等价于 m.update(a+b).

- **digest()：** 返回摘要，作为二进制数据字符串值

- **hexdigest()：** 返回摘要，作为十六进制数据字符串值

- **copy()：** 复制

**摘要算法主要用于保存用户名和密码，以及数据校验等。** 下面是一个增量计算文件 MD5 值的例子：

```python
#!/usr/bin/env python

import hashlib
import sys


def main():
    if len(sys.argv) != 2:
        sys.exit('Usage: %s file' % sys.argv[0])

    filename = sys.argv[1]
    m = hashlib.md5()
    with open(filename, 'rb') as fp:
        while True:
            blk = fp.read(4096) # 4KB per block
            if not blk: break
            m.update(blk)
    print m.hexdigest(), filename


if __name__ == '__main__':
    main()
```

**参考资料:**

- https://docs.python.org/2/library/hashlib.html
- http://www.cnblogs.com/BeginMan/p/3328172.html
- http://blog.chinaunix.net/uid-631981-id-3774992.html
