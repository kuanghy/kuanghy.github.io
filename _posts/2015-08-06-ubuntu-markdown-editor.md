---
layout: post
title: 建议使用Markdown来做日常文档的编辑工作 
category: 文本编辑
tags: markdown remarkdown retext discount python-mardown python-pisa
---
**Markdown**的语法简洁明了、学习容易，而且功能比纯文本更强。平时用它来编写文档是一个不错的选择，例如记录工作和学习中的笔记、写一些参考文件和帮组手册等等。

Markdown  文档编辑器推荐：*Remarkable*、*Retext*。这两款编辑器都支持将 markdown 文档转换成 html 和 pdf 文档。当然 markdown  文档编辑器有很多，包括在线编辑的也有。

除了用专业的 markdown 编辑器外，普通的文本编辑器也可以编写 markdown 文档，只是专业的 markdown 编辑器大多集成了实时预览和转化为 html、pdf的功能。

当然，也有其他的工具来完成 markdown、html 和 pdf 文档之间的转化。这里介绍 *discount*、*python-markdown*、*python-pisa*等工具。

**discount**或**python-markdown**用于将 markdown 文档转化为 html，其在 Debian/Ubuntu 系统中的安装方式为：

> sudo apt-get install discount
> sudo apt-get install python-markdown

用discount提供的markdown工具转换html：

> markdown -o Release-Notes.html Release-Notes.md

用python-markdown提供的markdown_py工具转换html：

> markdown_py -o html4 Release-Notest.md &deg; Release-Notes.html

**python-pisa**用于将html文档转化为pdf，其在 Debian/Ubuntu 系统中的安装方式为：

> sudo apt-get install python-pisa

用法如下：

> xhtml2pdf --html Release-Notes.html Release-Notes.pdf

为了方便，可以编写一个 Makefile 来批量转化 markdown 文档：
{% highlight makefile %}
MD = markdown
MDFLAGS = -T
H2P = xhtml2pdf
H2PFLAGS = --html
SOURCES := $(wildcard *.md)
OBJECTS := $(patsubst %.md, %.html, $(wildcard *.md))
OBJECTS_PDF := $(patsubst %.md, %.pdf, $(wildcard *.md))

all: build

build: html pdf

pdf: $(OBJECTS_PDF)

html: $(OBJECTS)

$(OBJECTS_PDF): %.pdf: %.html
    $(H2P) $(H2PFLAGS) $< > $@ 

$(OBJECTS): %.html: %.md
    $(MD) $(MDFLAGS) -o $@ $<
clean:
    rm -f $(OBJECTS)
{% endhighlight %}
    
如果转换的文档出现中文乱码，可以通过在 markdown 文档中嵌入 html 的方法来改变文档的编码方式。即在文档的开头加上meta标记，指明编码格式。如果文档已经编写完成，可以用如下方法批量修改：
sed -i '1i\&lt;meta http-equiv="content-type" content="text/html; charset=UTF-8"&gt;' \*.md



