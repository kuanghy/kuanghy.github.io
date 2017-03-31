---
layout: post
title: "Python 模块简介 -- argparse"
keywords: Python argparse Python参数解析 命令行参数解析
description: "argparse 是 Python 标准库中用来解析命令行参数和选项的模块"
category: Python
tags: python
---

`argparse` 是 Python 标准库中用来解析命令行参数和选项的模块，其是为替代已经过时的 optparse 模块而生的，该模块在 Python2.7 中被引入。argparse模块的作用是用于解析命令行参数。

## 创建解析器

使用 argparse 解析命令行参数时，首先需要创建一个解析器，创建方式如下所示：

```python
import argparse
parser = argparse.ArgumentParser()
```

`ArgumentParser` 的原型如下所示：

```python
class ArgumentParser(self, prog=None, usage=None, description=None, epilog=None, version=None, parents=[], formatter_class=<class 'argparse.HelpFormatter'>, prefix_chars='-', fromfile_prefix_chars=None, argument_default=None, conflict_handler='error', add_help=True)
```

ArgumentParser对象的参数都为关键字参数：

- **prog**: 程序的名字，默认为sys.argv[0]，用来在help信息中描述程序的名称。

```
>>> parser = argparse.ArgumentParser(prog='myprogram')
>>> dir(parser)
['__class__', '__delattr__', '__dict__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__module__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_action_groups', '_actions', '_add_action', '_add_container_actions', '_check_conflict', '_check_value', '_defaults', '_get_args', '_get_formatter', '_get_handler', '_get_kwargs', '_get_nargs_pattern', '_get_option_tuples', '_get_optional_actions', '_get_optional_kwargs', '_get_positional_actions', '_get_positional_kwargs', '_get_value', '_get_values', '_handle_conflict_error', '_handle_conflict_resolve', '_has_negative_number_optionals', '_match_argument', '_match_arguments_partial', '_mutually_exclusive_groups', '_negative_number_matcher', '_option_string_actions', '_optionals', '_parse_known_args', '_parse_optional', '_pop_action_class', '_positionals', '_print_message', '_read_args_from_files', '_registries', '_registry_get', '_remove_action', '_subparsers', 'add_argument', 'add_argument_group', 'add_help', 'add_mutually_exclusive_group', 'add_subparsers', 'argument_default', 'conflict_handler', 'convert_arg_line_to_args', 'description', 'epilog', 'error', 'exit', 'format_help', 'format_usage', 'format_version', 'formatter_class', 'fromfile_prefix_chars', 'get_default', 'parse_args', 'parse_known_args', 'prefix_chars', 'print_help', 'print_usage', 'print_version', 'prog', 'register', 'set_defaults', 'usage', 'version']
>>> parser.print_help()
usage: myprogram [-h]

optional arguments:
  -h, --help  show this help message and exit
```

- **usage**：描述程序用途的字符串

```
>>> parser = argparse.ArgumentParser(prog='PROG', usage='%(prog)s [options]')
>>> parser.print_usage()
usage: PROG [options]
>>> parser.print_help()
usage: PROG [options]

optional arguments:
  -h, --help  show this help message and exit
```

- **description**： 程序描述信息，help 信息前的文字。
- **epilog**： help 信息之后的信息

```
>>> parser = argparse.ArgumentParser(
...     description='A foo that bars',
...     epilog="And that's how you'd foo a bar")
>>> parser.print_help()
usage: [-h]

A foo that bars

optional arguments:
  -h, --help  show this help message and exit

And that's how you'd foo a bar
```

- **parents**： 由ArgumentParser对象组成的列表，它们的arguments选项会被包含到新ArgumentParser对象中。

```
>>> parent_parser = argparse.ArgumentParser(add_help=False)
>>> parent_parser.add_argument("--parent", type=int)
_StoreAction(option_strings=['--parent'], dest='parent', nargs=None, const=None, default=None, type=<type 'int'>, choices=None, help=None, metavar=None)
>>> foo_parser = argparse.ArgumentParser(parents=[parent_parser])
>>> foo_parser.add_argument('foo')
_StoreAction(option_strings=[], dest='foo', nargs=None, const=None, default=None, type=None, choices=None, help=None, metavar=None)
>>> foo_parser.parse_args(["--parent", "2", "XXX"])
Namespace(foo='XXX', parent=2)
```

- **formatter_class**： 重置 help 信息输出的格式

可供选择的参数有： HelpFormatter、ArgumentDefaultsHelpFormatter、RawDescriptionHelpFormatter、RawTextHelpFormatter

- **prefix_chars**： 参数前缀，默认为'-'

```
>>> parser = argparse.ArgumentParser(prefix_chars="+")
>>> parser.add_argument("+f")
_StoreAction(option_strings=['+f'], dest='f', nargs=None, const=None, default=None, type=None, choices=None, help=None, metavar=None)
>>> parser.add_argument("++bar")
_StoreAction(option_strings=['++bar'], dest='bar', nargs=None, const=None, default=None, type=None, choices=None, help=None, metavar=None)
>>> parser.parse_args("+f X ++bar Y".split())
Namespace(bar='Y', f='X')
```

- **fromfile_prefix_chars**： 前缀字符，放在文件名之前

```
>>> with open('args.txt', 'w') as fp:
...    fp.write('-f\nbar')
>>> parser = argparse.ArgumentParser(fromfile_prefix_chars='@')
>>> parser.add_argument('-f')
>>> parser.parse_args(['-f', 'foo', '@args.txt'])
Namespace(f='bar')
```

当参数过多时，可以将参数放到文件中读取，例子中parser.parse_args(['-f', 'foo', '@args.txt'])解析时会从文件args.txt读取，相当于['-f', 'foo', '-f', 'bar']

- **argument_default**：参数的全局默认值。例如，要禁止parse_args时的参数默认添加，我们可以：

```
>>> parser = argparse.ArgumentParser(argument_default=argparse.SUPPRESS)
>>> parser.add_argument('--foo')
>>> parser.add_argument('bar', nargs='?')
>>> parser.parse_args(['--foo', '1', 'BAR'])
Namespace(bar='BAR', foo='1')
>>> parser.parse_args()
Namespace()
```

这样，当parser.parse_args()时不会自动解析foo和bar了。

- **conflict_handler**： 解决冲突的策略，默认情况下冲突会发生错误：

```
>>> parser = argparse.ArgumentParser(prog='PROG')
>>> parser.add_argument('-f', '--foo', help='old foo help')
>>> parser.add_argument('--foo', help='new foo help')
Traceback (most recent call last):
 ...
ArgumentError: argument --foo: conflicting option string(s): --foo
```

我们可以设定冲突解决策略：

```
>>> parser = argparse.ArgumentParser(prog='PROG', conflict_handler='resolve')
>>> parser.add_argument('-f', '--foo', help='old foo help')
>>> parser.add_argument('--foo', help='new foo help')
>>> parser.print_help()
usage: PROG [-h] [-f FOO] [--foo FOO]

optional arguments:
 -h, --help  show this help message and exit
 -f FOO      old foo help
 --foo FOO   new foo help
```

- **add_help**： 设为 False 时，help 信息里面不再显示 `-h --help` 信息。

## 添加参数选项

为应用程序添加参数选项需要用 ArgumentParser 对象的 `add_argument` 方法，该方法原型如下：

```
add_argument(name or flags...[, action][, nargs][, const][, default][, type][, choices][, required][, help][, metavar][, dest])
```

示例：

```
>> parser.add_argument('integers', metavar='N', type=int, nargs='+',
...                     help='an integer for the accumulator')
>>> parser.add_argument('--sum', dest='accumulate', action='store_const',
...                     const=sum, default=max,
...                     help='sum the integers (default: find the max)')
```

- **name or flags**： 参数名

参数有两种形式，即可选参数和位置参数。位置参数没有前缀，而可选参数需要加前缀（默认为'-'）

```
>>> parser.add_argument('bar')  # 添加位置参数
>>> parser.add_argument('-f', '--foo')  # 添加可选参数
```

- **action**: 默认为 store

**store_const**，表示参数为固定值，该固定值存放在 const 中：

```
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('--foo', action='store_const', const=42)
>>> parser.parse_args('--foo'.split())
Namespace(foo=42)
```

**store_true和store_false**，值存为 True 或 False

```
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('--foo', action='store_true')
>>> parser.add_argument('--bar', action='store_false')
>>> parser.add_argument('--baz', action='store_false')
>>> parser.parse_args('--foo --bar'.split())
Namespace(bar=False, baz=True, foo=True)
```

**append**，存为列表

```
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('--foo', action='append')
>>> parser.parse_args('--foo 1 --foo 2'.split())
Namespace(foo=['1', '2'])
```

**append_const**，存为列表，会根据 const 关键参数进行添加：

```
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('--str', dest='types', action='append_const', const=str)
>>> parser.add_argument('--int', dest='types', action='append_const', const=int)
>>> parser.parse_args('--str --int'.split())
Namespace(types=[<type 'str'>, <type 'int'>])
```

**count**，统计参数出现的次数

```
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('--verbose', '-v', action='count')
>>> parser.parse_args('-vvv'.split())
Namespace(verbose=3)
```

**version**，版本信息

```
>>> import argparse
>>> parser = argparse.ArgumentParser(prog='PROG')
>>> parser.add_argument('--version', action='version', version='%(prog)s 2.0')
>>> parser.parse_args(['--version'])
PROG 2.0
```

- **nargs:**，参数的数量

值可以为整数N(N个)，\*(任意多个)，+(一个或更多)，？

```
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('--foo', nargs='*')
>>> parser.add_argument('--bar', nargs='*')
>>> parser.add_argument('baz', nargs='*')
>>> parser.parse_args('a b --foo x y --bar 1 2'.split())
Namespace(bar=['1', '2'], baz=['a', 'b'], foo=['x', 'y'])
```

如果值为？时，首先从命令行获得参数，若没有则从const获得，然后从default获得：

```
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('--foo', nargs='?', const='c', default='d')
>>> parser.add_argument('bar', nargs='?', default='d')
>>> parser.parse_args('XX --foo YY'.split())
Namespace(bar='XX', foo='YY')
>>> parser.parse_args('XX --foo'.split())
Namespace(bar='XX', foo='c')
>>> parser.parse_args(''.split())
Namespace(bar='d', foo='d')
```

更常用的情况是允许参数为文件

```
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('infile', nargs='?', type=argparse.FileType('r'),
...                     default=sys.stdin)
>>> parser.add_argument('outfile', nargs='?', type=argparse.FileType('w'),
...                     default=sys.stdout)
>>> parser.parse_args(['input.txt', 'output.txt'])
Namespace(infile=<open file 'input.txt', mode 'r' at 0x...>,
          outfile=<open file 'output.txt', mode 'w' at 0x...>)
>>> parser.parse_args([])
Namespace(infile=<open file '<stdin>', mode 'r' at 0x...>,
          outfile=<open file '<stdout>', mode 'w' at 0x...>)
```

- **choices:** 可供选择的值

```
>>> parser = argparse.ArgumentParser(prog='doors.py')
>>> parser.add_argument('door', type=int, choices=range(1, 4))
>>> print(parser.parse_args(['3']))
Namespace(door=3)
>>> parser.parse_args(['4'])
usage: doors.py [-h] {1,2,3}
doors.py: error: argument door: invalid choice: 4 (choose from 1, 2, 3)
```

- **metavar:** 用于 help 信息输出中

```
>>> parser.add_argument('str',nargs='*',metavar='AAA')
>>> parser.print_help()
usage: [-h] [AAA [AAA ...]]

positional arguments:
  AAA

optional arguments:
  -h, --help  show this help message and exit
```

- **dest:** 可作为参数名，如果没有指定该参数则默认为选项名去掉前缀后作为参数名，对于位置参数无效

```
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('--foo', dest='bar')
>>> parser.parse_args('--foo XXX'.split())
Namespace(bar='XXX')
```

- **const:** 保存一个常量

- **default:** 默认值

- **type:** 参数类型

- **required:** 是否必选，只针对可选参数，对位置参数无效

- **help：** help 信息


## 解析参数

要解析参数则需要用 ArgumentParser 对象的 parse_args() 方法，该方法运行会用'-'来认证可选参数，剩下的即为位置参数。该方法返回一个 Namespace 对象，参数值通过属性的方式访问，也可以用内建的 vars() 函数转换为字典。

示例：

```
>>> parser = argparse.ArgumentParser(prog="PROG")
>>> parser.add_argument("-f", "--foo")
_StoreAction(option_strings=['-f', '--foo'], dest='foo', nargs=None, const=None, default=None, type=None, choices=None, help=None, metavar=None)
>>> parser.add_argument("bar")
_StoreAction(option_strings=[], dest='bar', nargs=None, const=None, default=None, type=None, choices=None, help=None, metavar=None)
>>> parser.parse_args(['BAR'])
Namespace(bar='BAR', foo=None)
>>> options = parser.parse_args(['BAR', '--foo', 'FOO'])
>>> vars(options)
{'foo': 'FOO', 'bar': 'BAR'}
>>> parser.parse_args(['--foo', 'FOO'])
usage: PROG [-h] [-f FOO] bar
PROG: error: too few arguments
```

## 参数的几种写法

- 最常见的空格分开：

```
>>> parser = argparse.ArgumentParser(prog='PROG')
>>> parser.add_argument('-x')
>>> parser.add_argument('--foo')
>>> parser.parse_args('-x X'.split())
Namespace(foo=None, x='X')
>>> parser.parse_args('--foo FOO'.split())
Namespace(foo='FOO', x=None)
```

- 长选项用 '=' 分开

```
>>> parser.parse_args('--foo=FOO'.split())
Namespace(foo='FOO', x=None)
```

- 短选项可以写在一起：

```
>>> parser.parse_args('-xX'.split())
Namespace(foo=None, x='X')
```

## 使用示例

编写一个脚本 main.py，使用方式如下：

> main.py -u http://www.sohu.com -d 'a=1,b=2,c=3' -o /tmp/index.html

**功能要求**：打开 -u 指定的页面，将页面中所有的链接后面增加参数 a=1&b=2&c=3(需要考虑链接中已经存在指定的参数的问题), 然后保存到 -o 指定的文件中。

示例代码：

```python
import os
import argparse
from pyquery import PyQuery as pq

def extract_url_from_web(web_url):
    doc = pq(url=web_url)
    urls = []
    for a in doc('a'):
        a = pq(a)
        href = a.attr("href")
        if href:
            urls.append(href)

    return urls

def add_query_for_url(url, query):
    query = query.replace(',', '&')
    return url.replace('?', '?' + query + '&') if '?' in url else url + '?' + query

def main(url, query, outfile):
    with open(os.path.abspath(outfile), 'w') as f:
        for item in extract_url_from_web(url):
            newurl = add_query_for_url(item, query)
            f.write(newurl+'\n')
        pass

# Script starts from here

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-u", dest="url", type=str)
    parser.add_argument("-d", dest="query", type=str)
    parser.add_argument("-o", dest="outfile", type=str)

    options = parser.parse_args()
    main(**vars(options))
```
