---
layout: post
title: "Python datetime模块参考手册"
keywords: python datetime
description: "datetime 模块用于更直观、更容易的操作日期和时间"
category: Python
tags: python
---

Python提供了多个内置模块用于操作日期时间，像 calendar，time，datetime。`time`模块提供的接口与C标准库 time.h 基本一致。相比于 time 模块，`datetime`模块的接口则更直观、更容易调用。

 模块定义了两个常量：

- **datetime.MINYEAR**
- **datetime.MAXYEAR**

这两个常量分别表示 datetime 所能表示的最小、最大年份。其中，MINYEAR = 1，MAXYEAR = 9999。

**datetime** 模块定义了下面这几个类：

- **datetime.date**：表示日期的类。常用的属性有year, month, day；
- **datetime.time**：表示时间的类。常用的属性有hour, minute, second, microsecond；
- **datetime.datetime**：表示日期时间。
- **datetime.timedelta**：表示时间间隔，即两个时间点之间的长度。
- **datetime.tzinfo**：与时区有关的相关信息。

**注：**以上列举的这些类型的对象都是不可变（immutable）的。

## date 类

`date` 类表示一个日期（由年、月、日组成），其原型如下：

> class datetime.date(year, month, day)

参数说明：

- year 的范围是 [MINYEAR, MAXYEAR]，即 [1, 9999]；
- month 的范围是[1, 12]。（月份是从1开始的，不是从0开始）；
- day 的最大值根据给定的year, month参数来决定。例如闰年2月份有29天；

#### date 类定义了一些常用的类方法与类属性：

- **date.max**、**date.min**：date对象所能表示的最大、最小日期；
- **date.resolution**：date对象表示日期的最小单位。这里是天。
- **date.today()**：返回一个表示当前本地日期的 date 对象；
- **date.fromtimestamp(timestamp)**：根据给定的时间戮，返回一个 date 对象；
- **datetime.fromordinal(ordinal)**：将Gregorian日历时间转换为date对象；（Gregorian Calendar：一种日历表示方法，类似于我国的农历，西方国家使用比较多，此处不详细展开讨论。）

使用示例：

```python
>>> datetime.date.max
datetime.date(9999, 12, 31)
>>> datetime.date.min
datetime.date(1, 1, 1)
>>> datetime.date.resolution
datetime.timedelta(1)
>>> datetime.date.today()
datetime.date(2016, 5, 12)
>>> datetime.date.fromtimestamp(time.time())
datetime.date(2016, 5, 12)
```

#### date提供的实例方法和属性：

- **date.year**、**date.month**、**date.day**：年、月、日；
- **date.replace(year, month, day)**：生成一个新的日期对象，用参数指定的年，月，日代替原有对象中的属性。（原有对象仍保持不变）
- **date.timetuple()**：返回日期对应的time.struct_time对象；
- **date.toordinal()**：返回日期对应的Gregorian Calendar日期；
- **date.weekday()**：返回weekday，如果是星期一，返回0；如果是星期2，返回1，以此类推；
- **data.isoweekday()**：返回weekday，如果是星期一，返回1；如果是星期2，返回2，以此类推；
- **date.isocalendar()**：返回格式如(year，month，day)的元组；
- **date.isoformat()**：返回格式如'YYYY-MM-DD’的字符串；
- **date.strftime(fmt)**：自定义格式化字符串。

使用示例：

```python
>>> today = datetime.date.today()
>>> today.year
2016
>>> today.month
5
>>> today.day
12
>>> tomorrow = today.replace(day=13)
>>> tomorrow
datetime.date(2016, 5, 13)
>>> tomorrow.timetuple()
time.struct_time(tm_year=2016, tm_mon=5, tm_mday=13, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=4, tm_yday=134, tm_isdst=-1)
>>> tomorrow.toordinal()
736097
>>> tomorrow.weekday()
4
>>> tomorrow.isoweekday()
5
>>> tomorrow.isocalendar()
(2016, 19, 5)
>>> tomorrow.isoformat()
'2016-05-13'
>>> tomorrow.strftime("%y-%m-%d")
'16-05-13'
```

#### date 重载了简单的运算符：

date 允许对日期进行加减和比较：

- **date2 = date1 + timedelta**：

日期加上一个间隔，返回一个新的日期对象

- **date2 = date1 - timedelta**：

日期隔去间隔，返回一个新的日期对象

- **timedelta = date1 - date2**：

两个日期相减，返回一个时间间隔对象

- **date1 < date2**：

两个日期进行比较。

使用示例：

```python
>>> now = datetime.date.today()
>>> now
datetime.date(2016, 5, 12)
>>> now += datetime.date.resolution
>>> now
datetime.date(2016, 5, 13)
>>> now -= datetime.date.resolution
>>> now
datetime.date(2016, 5, 12)
>>> now < datetime.date.max
True
```

## Time类

`time` 类表示时间（由时、分、秒以及微秒组成），其原型如下：

> class datetime.time(hour=0, minute=0, second=0, microsecond=0, tzinfo=None)

参数说明:

- hour 的范围为[0, 24),
- minute 的范围为[0, 60)，
- second 的范围为[0, 60)，
- microsecond 的范围为[0, 1000000),
- tzinfo 表示时区信息。

#### time 类定义的类属性：

- **time.min**、**time.ma**x：time类所能表示的最小、最大时间。其中，time.min = time(0, 0, 0, 0)， time.max = time(23, 59, 59, 999999)；
- **time.resolution**：时间的最小单位，这里是1微秒；

使用示例：

```python
>>> datetime.time.min
datetime.time(0, 0)
>>> datetime.time.max
datetime.time(23, 59, 59, 999999)
>>> datetime.time.resolution
datetime.timedelta(0, 0, 1)
```

#### time类提供的实例方法和属性：

- **time.hour**、**time.minute**、**time.second**、**time.microsecond**：时、分、秒、微秒；
- **time.tzinfo**：时区信息；
- **time.replace**([hour[, minute[, second[, microsecond[, tzinfo]]]]])：创建一个新的时间对象，用参数指定的时、分、秒、微秒代替原有对象中的属性（原有对象仍保持不变）；
- **time.isoformat()**：返回型如"HH:MM:SS"格式的字符串表示；
- **time.strftime(fmt)**：返回自定义格式化字符串。

使用示例：

```python
>>> tm = datetime.time(18, 18, 18)
>>> tm.hour
18
>>> tm.minute
18
>>> tm.second
18
>>> tm.microsecond
0
>>> tm.tzinfo
>>> tm.isoformat()
'18:18:18'
>>> tm.replace(hour=20)
datetime.time(20, 18, 18)
>>> tm.strftime("%I:%M:%S %p")
'06:18:18 PM'
```

time 类的对象只能进行比较，无法进行加减操作。

## datetime 类

datetime 是 date 与 time 的结合体，包括 date 与 time 的所有信息。其原型如下：

> class datetime.datetime(year, month, day, hour=0, minute=0, second=0, microsecond=0, tzinfo=None)

各参数的含义与date、time的构造函数中的一样，要注意参数值的范围。

#### datetime类定义的类属性与方法：

- **datetime.min**、**datetime.max**：datetime所能表示的最小值与最大值；
- **datetime.resolution**：datetime最小单位；
- **datetime.today()**：返回一个表示当前本地时间的datetime对象；
- **datetime.now([tz])**：返回一个表示当前本地时间的datetime对象，如果提供了参数tz，则获取tz参数所指时区的本地时间；
- **datetime.utcnow()**：返回一个当前utc时间的datetime对象；
- **datetime.fromtimestamp(timestamp[, tz])**：根据时间戮创建一个datetime对象，参数tz指定时区信息；
- **datetime.utcfromtimestamp(timestamp)**：根据时间戮创建一个datetime对象；
- **datetime.combine(date, time)**：根据date和time，创建一个datetime对象；
- **datetime.strptime(date_string, format)**：将格式字符串转换为datetime对象，data 与 time 类没有提供该方法。

使用示例：

```python
>>> datetime.datetime.min
datetime.datetime(1, 1, 1, 0, 0)
>>> datetime.datetime.max
datetime.datetime(9999, 12, 31, 23, 59, 59, 999999)
>>> datetime.datetime.resolution
datetime.timedelta(0, 0, 1)
>>> print datetime.datetime.resolution
0:00:00.000001
>>> today = datetime.datetime.today()
>>> today
datetime.datetime(2016, 5, 12, 12, 46, 47, 246240)
>>> datetime.datetime.now()
datetime.datetime(2016, 5, 12, 12, 47, 9, 850643)
>>> datetime.datetime.utcnow()
datetime.datetime(2016, 5, 12, 4, 47, 42, 188124)
>>> datetime.datetime.fromtimestamp(time.time())
datetime.datetime(2016, 5, 12, 12, 48, 40, 459676)
>>> datetime.datetime.combine(datetime.date(1990, 10, 05), datetime.time(18, 18, 18))
datetime.datetime(1990, 10, 5, 18, 18, 18)
>>> datetime.datetime.strptime("2010-04-07 01:48:16.234000", "%Y-%m-%d %H:%M:%S .%f")
datetime.datetime(2010, 4, 7, 1, 48, 16, 234000)
```


#### datetime 的实例方法与属性

datetime类提供的实例方法与属性大部分功能与 date 和 time 类似，这里仅罗列方法名不再赘述：

- **datetime.year**、**month**、**day**、**hour**、**minute**、**second**、**microsecond**、**tzinfo**：
- **datetime.date()**：获取date对象；
- **datetime.time()**：获取time对象；
- **datetime.replace**([year[, month[, day[, hour[, minute[, second[, microsecond[, tzinfo]]]]]]]])：
- **datetime.timetuple() **
- **datetime.utctimetuple() **
- **datetime.toordinal()**
- **datetime.weekday()**
- **datetime.isocalendar()**
- **datetime.isoformat([sep])**
- **datetime.ctime()**：返回一个日期时间的C格式字符串，等效于time.ctime(time.mktime(dt.timetuple()))；
- **datetime.strftime(format)**

datetime 对象同样可以进行比较，或者相减返回一个时间间隔对象，或者日期时间加上一个间隔返回一个新的日期时间对象。

## timedelta 类

datetime.timedelta 对象代表两个时间之间的的时间差，两个 date 或 datetime 对象相减时可以返回一个timedelta 对象。其原型如下：

> class datetime.timedelta(days=0, seconds=0, microseconds=0, milliseconds=0, minutes=0, hours=0, weeks=0)

所有参数可选，且默认都是0，参数的值可以是整数，浮点数，正数或负数。

内部只存储days，seconds，microseconds，其他参数的值会自动按如下规则抓转换：

-  1 millisecond（毫秒） 转换成 1000 microseconds（微秒）
-  1 minute 转换成 60 seconds
-  1 hour 转换成 3600 seconds
-  1 week转换成 7 days

三个参数的取值范围分别为：

-  0 <= microseconds < 1000000
-  0 <= seconds < 3600*24 (the number of seconds in one day)
-  -999999999 <= days <= 999999999

#### timedelta 类定义的类属性：

- **timedelta.min**：时间间隔对象的最小值,即 timedelta(-999999999).
- **timedelta.max**：时间间隔对象的最大值，即 timedelta(days=999999999, hours=23, minutes=59, seconds=59, microseconds=999999).
- **timedelta.resolution**：时间间隔的最小单位,即 timedelta(microseconds=1).

使用示例：

```python
>>> datetime.timedelta.min
datetime.timedelta(-999999999)
>>> datetime.timedelta.max
datetime.timedelta(999999999, 86399, 999999)
>>> datetime.timedelta.resolution
datetime.timedelta(0, 0, 1)
>>> print datetime.timedelta.resolution
0:00:00.000001
```

#### timedelta 实例方法

- **timedelta.total_seconds()**：计算时间间隔的总秒数

使用示例：

```python
>>> datetime.timedelta.resolution.total_seconds()
1e-06
```

## 格式字符串

datetime、date、time 都提供了 strftime() 方法，该方法接收一个格式字符串，输出日期时间的字符串表示。支持的转换格式如下：

```python
%a星期的简写。如 星期三为Web
%A星期的全写。如 星期三为Wednesday
%b月份的简写。如4月份为Apr
%B月份的全写。如4月份为April
%c: 日期时间的字符串表示。（如： 04/07/10 10:43:39）
%d: 日在这个月中的天数（是这个月的第几天）
%f: 微秒（范围[0,999999]）
%H: 小时（24小时制，[0, 23]）
%I: 小时（12小时制，[0, 11]）
%j: 日在年中的天数 [001,366]（是当年的第几天）
%m: 月份（[01,12]）
%M: 分钟（[00,59]）
%p: AM或者PM
%S: 秒（范围为[00,61]，为什么不是[00, 59]，参考python手册~_~）
%U: 周在当年的周数当年的第几周），星期天作为周的第一天
%w: 今天在这周的天数，范围为[0, 6]，6表示星期天
%W: 周在当年的周数（是当年的第几周），星期一作为周的第一天
%x: 日期字符串（如：04/07/10）
%X: 时间字符串（如：10:43:39）
%y: 2个数字表示的年份
%Y: 4个数字表示的年份
%z: 与utc时间的间隔 （如果是本地时间，返回空字符串）
%Z: 时区名称（如果是本地时间，返回空字符串）
%%: %% => %
```

使用示例：

```python
>>> dt = datetime.datetime.now()
>>> dt.strftime('%Y-%m-%d %H:%M:%S %f')
'2016-05-12 14:19:22 333943'
>>> dt.strftime('%y-%m-%d %I:%M:%S %p')
'16-05-12 02:19:22 PM'
>>> dt.strftime("%a")
'Thu'
>>> dt.strftime("%A")
'Thursday'
>>> dt.strftime("%b")
'May'
>>> dt.strftime("%B")
'May'
>>> dt.strftime("%c")
'Thu May 12 14:19:22 2016'
>>> dt.strftime("%x")
'05/12/16'
>>> dt.strftime("%X")
'14:19:22'
>>> dt.strftime("%w")
'4'
>>> dt.strftime("%j")
'133'
>>> dt.strftime("%u")
'4'
>>> dt.strftime("%U")
'19'
```
