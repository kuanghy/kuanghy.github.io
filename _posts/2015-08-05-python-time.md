---
layout: post
title: Python time模块参考手册
category: python
tags: python time
---

Python的time模块提供了各种操作时间的功能。在大多数的编程语言中，表示时间的方法有两种，一是时间戳。即从1970年1月1日00:00:00开始按秒计算的偏移量；二是该语言自己的数据结构。Python中表示时间的数据结构元组，共有九个元素, 即`(tm_year, tm_mon, tm_mday, tm_hour, tm_min, tm_sec, tm_wday, tm_yday, tm_isdst)`，每个元素分别表示如下含义：

<div class="hblock"><pre>
year (four digits, e.g. 1998)
month (1-12)
day (1-31)
hours (0-23)
minutes (0-59)
seconds (0-59)
weekday (0-6, Monday is 0)
Julian day (day in the year, 1-366)
DST (Daylight Savings Time) flag (-1, 0 or 1) 是否是夏令时
</pre></div>

## UTC与DST时间标准简介
**UTC**（Coordinated Universal Time，世界协调时）亦即格林威治天文时间，世界标准时间。在中国为UTC+8。
**DST**（Daylight Saving Time）即夏令时。是一种为节约能源而人为规定地方时间的制度，一般在天亮早的夏季人为将时间提前一小时。

## 模块变量
#### timezone
当地时间与标准UTC时间的误差，以秒计

#### altzone
当地夏令时时间与标准UTC时间的误差，以秒计

#### daylight
当地时间是否反映夏令时，默认为0

#### tzname
关于(标准时区名称, 夏令时时区名称)的元组

## 模块方法
#### asctime([tuple])
将时间元组（默认为本地时间）格式转换为字符串形式。接受一个时间元组，其默认值为localtime()返回值

#### clock()
返回当前程序的cpu执行时间。unix系统始终返回全部运行时间；而windows从第二次开始都是以第一次调用此函数时的时间戳作为基准，而不是程序开始时间为基准。不接受参数。

#### ctime(seconds)
将时间戳转换为字符串。接受一个时间戳，其默认值为当前时间戳。等价于asctime(localtime(seconds))

#### gmtime([seconds])
将时间戳转换为UTC时间元组格式。接受一个浮点型时间戳参数，其默认值为当前时间戳。

#### localtime([seconds])
将时间戳转换为本地时间元组格式。接受一个浮点型时间戳参数，其默认值为当前时间戳。

#### mktime(tuple)
将本地时间元组转换为时间戳。接受一个时间元组，必选。

#### sleep(seconds)
延迟一个时间段，接受整型、浮点型。

#### strftime(format[, tuple])
将时间元组以指定的格式转换为字符串形式。接受字符串格式化串、时间元组。时间元组为可选，默认为localtime()。示例：

<div class="hblock"><pre>
&gt;&gt;&gt; time.strftime("%Y-%m-%d %X", time.localtime())
'2011-05-05 16:37:06'
</pre></div>

#### strptime(string, format)
将指定格式的时间字符串解析为时间元组，strftime()的逆向过程。接受字符串，时间格式2个参数，都是必选。示例：
<div class="hblock"><pre>
&gt;&gt;&gt; time.strptime('2015-08-05 22:08:06', '%Y-%m-%d %X')
time.struct_time(tm_year=2015, tm_mon=8, tm_mday=5, tm_hour=22, tm_min=8, tm_sec=6, tm_wday=2, tm_yday=217, tm_isdst=-1)
</pre></div>

#### time()
返回当前时间戳，浮点数形式。不接受参数

#### tzset()
改变本地时区。

## 时间字符串支持的格式
<div class="hblock"><pre>
	%a	本地（locale）简化星期名称	 
	%A	本地完整星期名称	 
	%b	本地简化月份名称	 
	%B	本地完整月份名称	 
	%c	本地相应的日期和时间表示	 
	%d	一个月中的第几天（01 - 31）	 
	%H	一天中的第几个小时（24小时制，00 - 23）	 
	%I	第几个小时（12小时制，01 - 12）	 
	%j	一年中的第几天（001 - 366）	 
	%m	月份（01 - 12）	 
	%M	分钟数（00 - 59）	 
	%p	本地am或者pm的相应符	
	%S	秒（01 - 61）	
	%U	一年中的星期数。（00 - 53星期天是一个星期的开始。）第一个星期天之前的所有天数都放在第0周。	
	%w	一个星期中的第几天（0 - 6，0是星期天）	
	%W	和%U基本相同，不同的是%W以星期一为一个星期的开始。	 
	%x	本地相应日期	 
	%X	本地相应时间	 
	%y	去掉世纪的年份（00 - 99）	 
	%Y	完整的年份	 
	%Z	时区的名字（如果不存在为空字符）	 
	%%	‘%’字符
</pre></div>

*注：* <br/>
1、“%p”只有与“%I”配合使用才有效果。
2、文档中强调确实是0 - 61，而不是59，闰年秒占两秒（汗一个）。
3、当使用strptime()函数时，只有当在这年中的周数和天数被确定的时候%U和%W才会被计算。

## 各种时间表示的转化
![ptyhon time model](http://ww4.sinaimg.cn/mw690/c3c88275jw1eus3jj1zb3j20m20v7dhi.jpg)