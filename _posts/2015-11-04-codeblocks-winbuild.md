---
layout: post
title: "Windows 下 CodeBlocks 编译记录"
category: 计算机科学
tags: codeblocks mingw
---

应工作需要在 Windows 上编译 CodeBlocks，在此做下编译记录。

### 源码下载

#### 1、wxWidgets

CodeBlocks 是依赖于 wxWidgets 的图形库而构建的，wxWidgets是一个开源的跨平台的C++构架库（framework），它可以提供GUI（图形用户界面）和其它工具。所以我们首先要下载 wx 的源码: [http://www.codeblocks.org/downloads/source](http://www.codeblocks.org/downloads/source)

#### 2、CodeBlocks

下载 CodeBlocks 源码：[http://www.codeblocks.org/downloads/source](http://www.codeblocks.org/downloads/source)

#### 3、CodeBlocks-13.12 运行程序
我采用的编译方式是用 CodeBlocks 编译 CodeBlocks，在编译 CodeBlocks之前还需要编译 wx，所以需要下载带 MinGW 的 CodeBlocks 可运行程序：[http://www.codeblocks.org/downloads/binaries](http://www.codeblocks.org/downloads/binaries)。可以将 codeblocks-13.12mingw-setup.exe 和 codeblocks-13.12mingw-setup-TDM-GCC-481.exe 两个安装文件都下载下来，先安装前者，然后再安装后者将前者覆盖，因为两个包中的 MinGw 内容不太一样，这样可以安装得完整一些。例如后者缺少 zip.exe，构建过程中会需要该执行程序，当然也可直接下载可执行程序安装，或者自己编译，如果缺失会出现如下错误：

<pre>
Execution of 'zip -jq9 devel\share\CodeBlocks\manager_resources.zip sdk\resources\*.xrc' in 'E:\cb-src\CodeBlocks\codeblocks\src' failed.
</pre>

### 编译 wx

解压下载的 wx 源码包，将 CodeBlocks 可运行程序安装到系统中，然后把 MinGW 下的所有 bin 目录添加到系统环境变量中，也可以不做这一步，而是在编译的终端中临时设置。打开终端开始编译 wx，首先进到构建目录：

> cd E:\cb-src\wxMSW-2.8.12\build\msw

设置环境变量：

> set path=D:\CodeBlocks\MinGW\bin;D:\CodeBlocks\MinGW\mingw32\bin

设置完成后可以测试下是否设置成功：

> gcc -v

如果能够显示 gcc 版本信息则表示设置成功，如果提示找不到程序则设置失败。设置成功后开始编译 wx：

> mingw32-make.exe -f makefile.gcc SHARED=1 MONOLITHIC=1 BUILD=release UNICODE=1  clean

> mingw32-make.exe -f makefile.gcc SHARED=1 MONOLITHIC=1 BUILD=release UNICODE=1

### 编译 Codeblocks

解压 CodeBlocks 源码目录，然后用安装好的 CodeBlocks 打开工程文件 codeblocks\src\CodeBlocks.cbp，在弹出 "Global Variable Editor" 内（可由"Settings > Global variables…“打开）设置以下两项：

- Current Set: default, Current Variable: wx: Built-in fields > base: E:\cb-src\wxMSW-2.8.12

- Current Set: default, Current Variable: cb_release_type: Built-in fields > base: -o2


设置编译器，用 MinGW 编译，“Settings > Compiler…“:

- Selected compiler: GNU GCC Compiler > Toolchain executables: [MinGW]\bin

最后，工具栏 > Build Target: Compiler，然后Build。

编译过程中出现了如下错误：

 <pre>
E:\cb-src\CodeBlocks\codeblocks\src\plugins\qtplugins\prowriter.cpp|34|error: 'iconv_t' was not declared in this scope|
</pre>

这是因为 MinGW 中缺少 iconv 的库，那么自己编译吧。下载 icon 源码：[http://ftp.gnu.org/pub/gnu/libiconv/](http://ftp.gnu.org/pub/gnu/libiconv/), 解压源码包，并用终端进入目录编译安装：

> make -f Makefile.msvc NO_NLS=1 MFLAGS=-MD

> make -f Makefile.msvc NO_NLS=1 MFLAGS=-MD PREFIX=E:\CodeBlocks\MinGW install

> make install

然后重构 CodeBlocks。编译完成以后，拷贝"wxMSW-2.8.12\lib\gcc_dll\wxmsw28u_gcc_cb.dll" 到"codeblocks\src\devel"目录，运行"D:\codeblocks\src\update.bat”，目录"D:\codeblocks\src\output"下就是你的发行版了。运行"D:\codeblocks\src\output\codeblocks.exe"时，由于单例，记得关闭之前开着编译的 CodeBlocks。


### 参考资料
[http://wiki.codeblocks.org/index.php?title=Installing_Code::Blocks_from_source_on_Windows](http://wiki.codeblocks.org/index.php?title=Installing_Code::Blocks_from_source_on_Windows)

[http://my.oschina.net/vaero/blog/209087](http://my.oschina.net/vaero/blog/209087)

[http://m.blog.csdn.net/blog/jiangwujing/17661927](http://m.blog.csdn.net/blog/jiangwujing/17661927)

[http://wiki.codeblocks.org/index.php?title=MinGW_installation#Other_developer_tools](http://wiki.codeblocks.org/index.php?title=MinGW_installation#Other_developer_tools)