---
layout: post
title: Python 的字符串格式化操作
category: Python
tags: python
---

Python的字符串格式化操作需要用到格式化操作符：`%`。Python 风格的字符串格式化操作符。只适用于字符串类型,非常类似于 C 语言里面的 `printf()` 函数的字符串格式化，甚至所用的符号都一样，都用百分号(%)，并且支持所有 printf() 式的格式化操作。语法如下:

> format_string % string_to_convert

format_string为包含 `%` 的格式标记字符串，表1 中列出了可用的各种符号”；string_to_convert 为要格式化的字符串，包含要转化、显示的变量，如果是两个以上，则需要用元组或字典。

<div class="mark">表1 字符串格式化符号表</div>
<table cellspacing="0">
<tr><th>格式化字符</th><th>转换方式</th></tr>
<tr>
	<td>%c&emsp;&emsp;&emsp;&emsp;</td>
	<td>转换成字符(ASCII 码值,或者长度为一的字符串)</td>
</tr>
<tr>
	<td>%r</td>
	<td>优先用 repr() 函数进行字符串转换</td>
</tr>
<tr>
	<td>%s</td>
	<td>优先用 str() 函数进行字符串转换</td>
</tr>
<tr>
	<td>%d / %i</td>
	<td>转成有符号十进制数</td>
</tr>
<tr>
	<td>%u</td>
	<td>转成无符号十进制数</td>
</tr>
<tr>
	<td>%o</td>
	<td>转成无符号八进制数</td>
</tr>
<tr>
	<td>%x / %X</td>
	<td>(Unsigned)转成无符号十六进制数(x/X 代表转换后的十六进制字符的大
小写)</td>
</tr>
<tr>
	<td>%e / %E</td>
	<td>转成科学计数法(e/E 控制输出 e/E)</td>
</tr>
<tr>
	<td>%f / %F</td>
	<td>转成浮点数(小数部分自然截断)</td>
</tr>
<tr>
	<td>%g / %G</td>
	<td>%e 和%f/%E 和%F 的简写</td>
</tr>
<tr>
	<td>%%</td>
	<td>输出%</td>
</tr>
</table>

Python 支持两种格式的输入参数。第一种是元组(见 2.8 节,6.15 节)，这基本上是一种的 C printf()风格的转换参数集；另一种形式是字典形式，字典其实是一个 哈希键-值对 的集合，这种形式里面，key 是作为格式字符串出现，相对应的 value 值作为参数在进行转化时提供给格式字符串。

格式字符串既可以跟 print 语句一起用来向终端用户输出数据，又可以用来合并字符串形成新字符串，而且还可以直接显示到 GUI(Graphical User Interface)界面上去。

表2 是一些其他的格式字符和方法：

<div class="mark">表2 格式化操作符辅助指令</div>
<table cellspacing="0">
<tr><th>符号</th><th>作用</th></tr>
<tr>
	<td>*</td>
	<td>定义宽度或者小数点精度</td>
</tr>
<tr>
	<td>-</td>
	<td>用做左对齐</td>
</tr>
<tr>
	<td>&lt;sp&gt;</td>
	<td>在正数前面显示空格</td>
</tr>
<tr>
	<td>#</td>
	<td>在八进制数前面显示零('0'),在十六进制前面显示'0x'或者'0X'(取决于用的是'x'还是'X')</td>
</tr>
<tr>
	<td>0</td>
	<td>显示的数字前面填充‘0’而不是默认的空格</td>
</tr>
<tr>
	<td>%</td>
	<td>'%%'输出一个单一的'%'</td>
</tr>
<tr>
	<td>(var)</td>
	<td>映射变量(字典参数)</td>
</tr>
<tr>
	<td>m.n</td>
	<td>m 是显示的最小总宽度,n 是小数点后的位数(如果可用的话)</td>
</tr>
</table>

字符串输出示例：
{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  test.py
#       Author @  Huoty
#  Create date @  2015-06-03 10:08:17
#  Description @  
# *************************************************************

intnum = 108
floatnum = 1234.567890
num = 123

# Script starts from here

print "十六进制输出："
print "%x" % intnum
print "%X" % intnum
print "%#X" % intnum
print "%#x" % intnum

print "\n浮点数和科学记数法形式输出:"
print "%f" % floatnum
print "%.2f" % floatnum
print "%E" % floatnum
print "%e" % floatnum
print "%g" % floatnum
print "%G" % floatnum
print "%e" % (1111111111111111111111111L)

print "\n整数和字符串输出:"
print "%+d" % 4
print "%+d" % -4
print "we are at %d%%" % 100
print "Your host is: %s" % "earth"
print "Host: %s\tPort:%d" % ("mars", 80)
print "dec: %d/oct: %#o/hex: %#X" % (num, num, num)
print "MM/DD/YY = %02d/%02d/%d" % (2, 15, 67)
print "There are %(howmany)d %(lang)s Quotation Symbols" % {'lang': 'Python', 'howmany': 3}
{% endhighlight %}

输出结果：
<div class="emphasis">
十六进制输出：
6c
6C
0X6C
0x6c

浮点数和科学记数法形式输出:
1234.567890
1234.57
1.234568E+03
1.234568e+03
1234.57
1234.57
1.111111e+24

整数和字符串输出:
+4
-4
we are at 100%
Your host is: earth
Host: mars	Port:80
dec: 123/oct: 0173/hex: 0X7B
MM/DD/YY = 02/15/67
There are 3 Python Quotation Symbols
</div>

在使用格式化操作符对字符串进行格式化时，有时候可能并不能满足我们的需求。在 Python2.4 之后，更加了新式的字符串模板。新式的字符串模板的优势是不用去记住所有的转换类型相关的细节，而是像现在 shell 风格的脚本语言里面那样使用美元符号($)。

由于新式的字符串 Template 对象的引进使得 string 模块又重新活了过来，Template 对象有两个方法，substitute()和safe_substitute()。前者更为严谨，在key缺少的情况下它会报一个 KeyError 的异常出来，而后者在缺少 key 时，直接原封不动的把字符串显示出来.。

示例：
<div class="emphasis">
&gt;&gt;&gt; from string import Template
&gt;&gt;&gt; s = Template('There are ${howmany} ${lang} Quotation Symbols') 
&gt;&gt;&gt; print s.substitute(lang='Python', howmany=3)
There are 3 Python Quotation Symbols
&gt;&gt;&gt; print s.substitute(lang='Python')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/lib/python2.7/string.py", line 176, in substitute
    return self.pattern.sub(convert, self.template)
  File "/usr/lib/python2.7/string.py", line 166, in convert
    val = mapping[named]
KeyError: 'howmany'
&gt;&gt;&gt; print s.safe_substitute(lang='Python')
There are ${howmany} Python Quotation Symbols
</div>

<br/>
***本文内容摘自《Python核心编程》一书，仅供学习参考。***