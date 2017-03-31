---
layout: post
title: "Python 模块简介 -- math"
keywords: Python  math
description: "Python 数学处理函数模块简介"
category: Python
tags: python
---

Python 的 math 模块提供了一些基本的数学运行功能，例如求弦、求根、求对数等等。一般情况下，我们能够用上的 math 模块的函数不多，常用的函数应该是 fabs、ceil、floor、factorial 等，对于求幂，用 `**` 效率更高。

下表是对一些函数的说明：

| 函数                | 说明                                                                |
|:--------------------|:--------------------------------------------------------------------|
| math.acos(x)        | 返回 x 的反余弦                                                     |
| math.acosh(x)       | 返回 x 的反双曲余弦                                                 |
| math.asin(x)        | 返回 x 的反正弦                                                     |
| math.asinh(x)       | 返回 x 的反双曲正弦                                                 |
| math.atan(x)        | 返回 x 的反正切                                                     |
| math.atan2(y, x)    | 返回 y/x 的反正切                                                   |
| math.atanh(x)       | 返回 x 的反双曲正切                                                 |
| math.ceil(x)        | 返回 ≧ x 的最小整數，例：math.floor(3.4) = 4                        |
| math.copysign(x, y) | 返回与 y 同号的 x 值， 例：math.copysign(1.0, -0.0) = -1.0          |
| math.cos(x)         | 返回 x 的余弦                                                       |
| math.cosh(x)        | 返回 x 的双曲余弦                                                   |
| math.degrees(x)     | 將 x (弧长) 转成角度，与 radians 为反函数                           |
| math.e              | 常数 e = 2.7128...                                                  |
| math.exp(x)         | 返回 math.e**x                                                      |
| math.fabs(x)        | 返回 x 的绝对值                                                     |
| math.factorial(x)   | 返回 x! 阶乘                                                        |
| math.floor(x)       | 返回 ≦ x 的最大整数，例：math.floor(3.4) = 3                        |
| math.fmod(x, y)     | 返回 x 对 y 取模的余数                                              |
| math.frexp(x)       | ldexp 的反函数，返回一個 2 元組                                     |
| math.fsum(x)        | 返回 x 阵列值的各項和，例： math.fsum([2, 3, 5]) = 10               |
| math.hypot(x, y)    | 返回 x**2 + y**2 的根                                               |
| math.isinf(x)       | 如果 x = ±inf 也就是 ±∞， 返回 True                                 |
| math.isnan(x)       | 如果 x = Nan (not a number) 返回 True                               |
| math.ldexp(m, n)    | 返回 m**2n, 与 frexp 是反函数， 例：math.ldexp(2, 2)                |
| math.log(x, a)      | 返回 log 以 a 为底 x 的对数，若不给定 a 则底默认为 e                |
| math.log2(x)        | 返回 log 以 2 为底 x 的对数                                         |
| math.log10(x)       | 返回 log 以 10 为底 x 的对数                                        |
| math.loglp(x)       | 返回 log 以 e 为底 1+x 的对数                                       |
| math.modf(x)        | 返回 x 的小数部份与整数部份，例：math.modf(13.14) = （14.0， 13.0） |
| math.pi             | 返回常数 π (3.14159...)                                             |
| math.pow(x,y)       | 返回 x**y                                                           |
| math.radians(d)     | 將 x(角度) 转成弧长，与 degrees 为反函数                            |
| math.sin(x)         | 返回 x 的正弦                                                       |
| math.sinh(x)        | 返回 x 的双曲正弦                                                   |
| math.sqrt(x)        | 返回 x 的根                                                         |
| math.tan(x)         | 返回 x 的正切                                                       |
| math.tanh(x)        | 返回 x 的双曲正切                                                   |
| math.trunc(x)       | 返回 x 的整数部份，等同 int                                         |

**一些说明：**

`math.fmod(x, y)` 函数弧类似 x%y，但产生的结果可能与 % 不同，因为前者以 y 来决定余数的符号，后者以 x 来决定余数的符号。示例：

```python
>>> import math
>>> math.fmod(10, 3)
1.0
>>> 10%3
1
>>> math.fmod(-10, 3)
-1.0
>>> -10%3
2
```

`math.frexp()` 函数返回一個 2 元組, 分別是假数 m(float) 以及一个指数 n(int)，也就是 x = m**2n 与 ldexp 是反函数。例：math.frexp(8) = (0.5, 4)
