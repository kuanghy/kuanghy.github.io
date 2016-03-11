---
layout: post
title: "Python 序列： 字符串"
keywords: Python 字符串
description: "详细描述 Python 字符串的一些值得注意的特殊特性"
category: python
tags: Python 字符串
---
{% include JB/setup %}

Python 中的字符串是单引号(' ')、双引号(" ")、三引号(''' ''' 或者 """ """)包裹的内容。**字符串是不可变类型**。就是说改变一个字符串的元素需要新建一个新的字符串。字符串是由独立的字符组成的，并且这些字符可以通过切片操作顺序地访问。由于字符串属于序列类型，所以适用于序列的操作符和内建函数页同样使用于字符串，这里不再单独讲述，而只是列举一些字符串特有的操作符，方法和特性。

### str 和 repr

函数 str(),repr()运算在特性和功能方面都非常相似，但 **repr()** 主要返回的是一个对象的“官方”字符串表示，也就是说绝大多数情况下可以通过求值运算（使用内建函数eval()）重新得到该对象，并不是所有repr()返回的字符串都能够用 eval()内建函数得到原来的对象。而 **str()** 致力于生成一个对象的可读性好的字符串表示，它的返回结果通常无法用于eval()求值，但很适合用于print语句输出。`repr()` 可以用用 **``**（倒引号） 代替，但在 Python3.0 之后已不在支持，所以建议用 repr() 函数。`print` 语句会自动为每个对象调用 str() 函数。

简而言之，str、repr 和倒引号是 Python 值转化为字符串的 3 种方式。函数 str 让字符串更易于阅读，而 repr（和倒引号）则把结果字符串转化为合法的 Python 表达式。

在类定义中（class），可以重构 _\_str\__ 和 _\_repr\__ 方法，已自定义 str 和 repr 函数返回的结果。

### 原始字符串

原始字符串是保持字符串按原样输出的一类字符串，即字符串中的特殊字符不会被转义。原始字符串以 r 开头，如下若是

<pre>
>>>print r"C:\\nowhere"
C:\\nowhere
>>>print "C:\\nowhere"
C:
owhere
</pre>

不能在原始字符串结尾输入反斜线，也就是说原始字符串的最后一个字符不能为反斜线。因为当最后一个字符是反斜线时，Python 不知道是否该结束字符串。如果结尾需要有反斜线，则需要用反斜线转义。

### 格式化操作符

`%` 是 Python 风格的字符串格式化操作符。只适用于字符串类型,非常类似于 C 语言里面的 printf() 函数的字符串格式化，甚至所用的符号都一样,都用百分号(%)，并且支持所有 printf()式的格式化操作。语法如下:

> format_string % arguments_to_convert

Python 支持两种格式的输入参数。第一种是元组，这基本上是一种的 C printf() 风格的转换参数集；另一种是字典形式，这种形式里面,key 是作为格式字符串出现,相对应的 value 值作为参数在进行转化时提供给格式字符串。

### 字符串模板

字符串格式化操作符是 Python 里面处理这类问题的主要手段,而且以后也是如此。然而它也不是完美的,其中的一个缺点是它不是那么直观,尤其对刚从 C/C++转过来的 Python 新手来说更是如此,即使是现在使用字典形式转换的程序员也会偶尔出现遗漏转换类型符号的错误,比如说,用了%(lang)而不是正确的%(lang)s.为了保证字符串被正确的转换,程序员必须明确的记住转换类型参数,比如到底是要转成字符串,整数还是其他什么类型。

新式的字符串模板的优势是不用去记住所有的相关细节的,而是像现在 shell 风格的脚本语言里面那样使用美元符号($)。

由于新式的字符串 Template 对象的引进使得 string 模块又重新活了过来,Template 对象有两个方法,substitute()和 safe_substitute()。前者更为严谨,在 key 缺少的情况下它会报一个 KeyError 的异常出来,而后者在缺少 key 时,直接原封不动的把字符串显示出来。如下所示：

<pre>
>>> from string import Template
>>> s = Template("I am ${name}, and I love ${thing}.")
>>> print s.substitute(name = "huoty", thing = "python")
I am huoty, and I love python.
>>> print s.substitute(name = "huoty")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/lib/python2.7/string.py", line 176, in substitute
    return self.pattern.sub(convert, self.template)
  File "/usr/lib/python2.7/string.py", line 166, in convert
    val = mapping[named]
KeyError: 'thing'
>>> print s.safe_substitute(name = "huoty")
I am huoty, and I love ${thing}.
</pre>

### 字符串方法

<pre>
string.capitalize()  把字符串的第一个字符大写
string.center(width)  返回一个原字符串居中,并使用空格填充至长度 width 的新字符串
string.count(str, beg=0, end=len(string))  返回 str 在 string 里面出现的次数,如果 beg 或者end 指定则返回指定范围内 str 出现的次数
string.decode(encoding='UTF-8', errors='strict')  以 encoding 指定的编码格式解码 string,如果出错默认报一个 ValueError 的 异 常 , 除非 errors 指定的是 'ignore' 或者 'replace'
string.encode(encoding='UTF-8', errors='strict')  以 encoding 指定的编码格式编码 string,如果出错默认报一个 ValueError 的异常,除非 errors 指定的是'ignore'或者'replace'
string.endswith(obj, beg=0, end=len(string))  检查字符串是否以 obj 结束,如果 beg 或者 end 指定则检查指定的范围内是否以 obj 结束,如果是,返回 True,否则返回 False.
string.expandtabs(tabsize=8)把字符串 string 中的 tab 符号转为空格,默认的空格数 tabsize 是 8.
string.find(str, beg=0, end=len(string))  检测 str 是否包含在 string 中,如果 beg 和 end 指定范围,则检查是否包含在指定范围内,如果是返回开始的索引值,否则返回-1
string.index(str, beg=0, end=len(string))  跟 find()方法一样,只不过如果 str 不在 string 中会报一个异常.
string.isalnum()  如果 string 至少有一个字符并且所有字符都是字母或数字则返回 True,否则返回 False
string.isalpha()  如果 string 至少有一个字符并且所有字符都是字母则返回 True, 否则返回 False
string.isdecimal()  如果 string 只包含十进制数字则返回 True 否则返回 False.
string.isdigit()  如果 string 只包含数字则返回 True 否则返回 False.
string.islower()  如果 string 中包含至少一个区分大小写的字符,并且所有这些(区分大小写的)字符都是小写,则返回 True,否则返回 False
string.isnumeric()  如果 string 中只包含数字字符,则返回 True,否则返回 False
string.isspace()  如果 string 中只包含空格,则返回 True,否则返回 False.
string.istitle()  如果 string 是标题化的(见 title())则返回 True,否则返回 False
string.isupper()  如果 string 中包含至少一个区分大小写的字符,并且所有这些(区分大小写的)字符都是大写,则返回 True,否则返回 False
string.join(seq)  Merges (concatenates)以 string 作为分隔符,将 seq 中所有的元素(的字符串表示)合并为一个新的字符串
string.ljust(width)  返回一个原字符串左对齐,并使用空格填充至长度 width 的新字符串
string.lower()  转换 string 中所有大写字符为小写.
string.lstrip() 截掉 string 左边的空格
string.partition(str)  有点像 find()和 split()的结合体,从 str 出现的第一个位置起,把字符串 string 分成一个 3 元素的元组(string_pre_str,str,string_post_str),如果 string 中不包含str 则 string_pre_str == string.
string.replace(str1, str2, num=string.count(str1))  把 string 中的 str1 替换成 str2,如果 num 指定, 则替换不超过 num 次.
string.rfind(str, beg=0,end=len(string))  类似于 find() 函数,不过是从右边开始查找.
string.rindex( str, beg=0,end=len(string))  类似于 index(),不过是从右边开始.
string.rjust(width)  返回一个原字符串右对齐,并使用空格填充至长度 width 的新字符串
string.rpartition(str)  类似于 partition() 函数,不过是从右边开始查找.
string.rstrip()  删除 string 字符串末尾的空格.
string.split(str="", num=string.count(str)) 以 str 为分隔符切片 string,如果 num 有指定值,则仅分隔 num 个子字符串
string.splitlines(num=string.count('\n'))  按照行分隔,返回一个包含各行作为元素的列表,如果 num 指定则仅切片 num 个行.
string.startswith(obj, beg=0,end=len(string))  检查字符串是否是以 obj 开头,是则返回 True,否则返回 False。如果 beg 和 end 指定值,则在指定范围内检查.
string.strip([obj])  在 string 上执行 lstrip() 和 rstrip()
string.swapcase()  翻转 string 中的大小写
string.title()  返回"标题化"的 string,就是说所有单词都是以大写开始,其余字母均为小写(见 istitle())
string.translate(str, del="")  根据 str 给出的表(包含 256 个字符)转换 string 的字符,要过滤掉的字符放到 del 参数中
string.upper()  转换 string 中的小写字母为大写
string.zfill(width)  返回长度为 width 的字符串,原字符串 string 右对齐,前面填充0
</pre>

### 字符串不变性

字符串是一种不可变数据类型,就是说它的值是不能被改变或修改的。这就意味着如果你想修改一个字符串,或者截取一个子串,或者在字符串的末尾连接另一个字符串等等,你必须新建一个字符串。

在 Python 中，**左值必须是一个完整的对象**，比如说一个字符串对象，不能是字符串的一部分。