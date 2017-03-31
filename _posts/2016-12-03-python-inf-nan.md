---
layout: post
title: "Python 中 Inf 和 Nan 的判断问题"
keywords: Python Inf Nan 正无穷 负无穷 不是一个数 numpy isnan isinf
description: "在 Python 中建议不要用 is 和 == 来判断一个对象是否是 inf 和 nan"
category: Python
tags: python
---

Python 中可以用如下方式表示正负无穷：

```python
float("inf")   # 正无穷
float("-inf")  # 负无穷
```

利用 inf(infinite) 乘以 0 会得到 `not-a-number(NaN)`。如果一个数超出 infinite，那就是一个 NaN（not a number）数。在 NaN 数中，它的 exponent 部分为可表达的最大值，即 FF（单精度）、7FF（双精度）和 7FFF（扩展双精度）。 NaN 数与 infinite 数的区别是：infinite 数的 significand 部分为 0 值（扩展双精度的 bit63 位为 1）；而 NaN 数的 significand 部分不为 0 值。

我们先看看如下的代码：

```python
>>> inf = float("inf")
>>> ninf = float("-inf")
>>> nan = float("nan")
>>> inf is inf
True
>>> ninf is ninf
True
>>> nan is nan
True
>>> inf == inf
True
>>> ninf == ninf
True
>>> nan == nan
False
>>> inf is float("inf")
False
>>> ninf is float("-inf")
False
>>> nan is float("nan")
False
>>> inf == float("inf")
True
>>> ninf == float("-inf")
True
>>> nan == float("nan")
False
```

如果你没有尝试过在 Python 中判断一个浮点数是否为 NaN，对以上的输出结果肯定会感到诧异。首先，对于正负无穷和 NaN 自身与自身用 `is` 操作，结果都是 True，这里好像没有什么问题；但是如果用 `==` 操作，结果却不一样了， NaN 这时变成了 False。如果分别用 float 重新定义一个变量来与它们再用 `is` 和 `==` 比较，结果仍然出人意料。出现这种情况的原因稍稍有些复杂，这里就不赘术了，感兴趣可以查阅相关资料。

如果你希望正确的判断 Inf 和 Nan 值，那么你应该使用 math 模块的 `math.isinf` 和 `math.isnan` 函数：

```python
>>> import math
>>> math.isinf(inf)
True
>>> math.isinf(ninf)
True
>>> math.isnan(nan)
True
>>> math.isinf(float("inf"))
True
>>> math.isinf(float("-inf"))
True
>>> math.isnan(float("nan"))
True
```

这样便准确无误了。既然我在谈论这个问题，就是再忠告：**不要在 Python 中试图用 is 和 == 来判断一个对象是否是正负无穷或者 NaN**。你就乖乖的用 math 模块吧，否则就是引火烧身。

当然也有别的方法来作判断，以下用 NaN 来举例，但仍然推荐用 math 模块，免得把自己弄糊涂。

- 用对象自身判断自己

```python
>>> def isnan(num):
...     return num != num
...
>>> isnan(float("nan"))
True
```

- 用 numpy 模块的函数

```python
>>> import numpy as np
>>>
>>> np.isnan(np.nan)
True
>>> np.isnan(float("nan"))
True
>>> np.isnan(float("inf"))
False
```

Numpy 的 isnan 函数还可以对整个 list 进行判断：

```python
>>> lst = [1, float("nan"), 2, 3, np.nan, float("-inf"), 4, np.nan]
>>> lst
[1, nan, 2, 3, nan, -inf, 4, nan]
>>> np.isnan(lst)
array([False,  True, False, False,  True, False, False,  True], dtype=bool)
```

这里的 np.isnan 返回布尔值数组，如果对应位置为 NaN，返回 True，否则返回 False。
