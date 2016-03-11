---
layout: post
title: 构架编译器框架系统 LLVM 使用简介
category: 计算机科学
tags: llvm clang
---
{% include JB/setup %}

### LLVM 是什么
LLVM 是 low level virtual machine（底层虚拟机）的简称，它是一个开源的编译器架构，已经被成功应用到多个应用领域。LLVM 的主要作用是它可以作为多种语言的后端，它可以提供可编程语言无关的优化和针对很多种CPU的代码生成功能。LLVM 核心库提供了与编译器相关的支持，可以作为多种语言编译器的后台来使用。能够进行程序语言的编译期优化、链接优化、在线编译优化、代码生成。LLVM的项目是一个模块化和可重复使用的编译器和工具技术的集合。LLVM是伊利诺伊大学的一个研究项目，提供一个现代化的，基于SSA的编译策略能够同时支持静态和动态的任意编程语言的编译目标。自那时以来，已经成长为LLVM的主干项目，由不同的子项目组成，其中许多正在生产中使用的各种 商业和开源的项目，以及被广泛用于学术研究。

### LLVM 常用命令工具
<pre>
llvm-as 将可读的 .ll 文件汇编成字节代码
llvm-dis 将字节代码文件反编成可读的 .ll 文件
opt 在一个字节代码文件上运行一系列的 LLVM 到 LLVM 的优化
llc 为一个字节代码文件生成本机器代码
lli 直接运行使用 JIT 编译器或者解释器编译成字节代码的程序
llvm-link 将几个字节代码文件连接成一个
llvm-ar 打包字节代码文件
llvm-ranlib 为 llvm-ar 打包的文件创建索引
llvm-nm 在 字节代码文件中打印名字和符号类型
llvm-prof 将 'llvmprof.out' raw 数据格式化成人类可读的报告
llvm-ld 带有可装载的运行时优化支持的通用目标连接器
llvm-config 打印出配置时 LLVM 编译选项、库、等等
llvmc 一个通用的可定制的编译器驱动
llvm-diff 比较两个模块的结构
bugpoint 自动案例测试减速器
llvm-extract 从 LLVM 字节代码文件中解压出一个函数
llvm-bcanalyzer 字节代码分析器 （分析二进制编码本身，而不是它代表的程序）
FileCheck 灵活的文件验证器，广泛的被测试工具利用
tblgen 目标描述阅读器和生成器
lit LLVM 集成测试器，用于运行测试
</pre>

###　LLVM IR
根据编译原理可知，编译器不是直接将源语言翻译为目标语言，而是翻译为一种“中间语言”，即“IR”。之后再由中间语言，利用后端程序和设备翻译为目标平台的汇编语言。由于中间语言相当于一款编译器前端和后端的“桥梁”，不同编译器的中间语言IR是不一样的，而IR可以说是集中体现了这款编译器的特征。

LLVM IR主要有三种格式：一种是在内存中的编译中间语言；一种是硬盘上存储的二进制中间语言（以.bc结尾），最后一种是可读的中间格式（以.ll结尾）。这三种中间格式是完全相等的。

LLVM IR是LLVM优化和进行代码生成的关键。根据可读的IR，我们可以知道再最终生成目标代码之前，我们已经生成了什么样的代码。而且根据IR，我们可以选择使用不同的后端而生成不同的可执行代码。同时，因为使用了统一的IR，所以我们可以重用LLVM的优化功能，即使我们使用的是自己设计的编程语言。

### 结构化编译器前端 Clang 介绍
Clang ( 发音为 /klæŋ/) 是 LLVM 的一个编译器前端，它目前支持 C, C++, Objective-C 以及 Objective-C++ 等编程语言。Clang 对源程序进行词法分析和语义分析，并将分析结果转换为 Abstract Syntax Tree ( 抽象语法树 ) ，最后使用 LLVM 作为后端代码的生成器。

Clang 的开发目标是提供一个可以替代 GCC 的前端编译器。与 GCC 相比，Clang 是一个重新设计的编译器前端，具有一系列优点，例如模块化，代码简单易懂，占用内存小以及容易扩展和重用等。由于 Clang 在设计上的优异性，使得 Clang 非常适合用于设计源代码级别的分析和转化工具。Clang 也已经被应用到一些重要的开发领域，如 Static Analysis 是一个基于 Clang 的静态代码分析工具。

由于 GNU 编译器套装 (GCC) 系统庞大，而且 Apple 大量使用的 Objective-C 在 GCC 中优先级较低，同时 GCC 作为一个纯粹的编译系统，与 IDE 配合并不优秀，Apple 决定从零开始写 C family 的前端，也就是基于 LLVM 的 Clang 了。Clang 由 Apple 公司开发，源代码授权使用 BSD 的开源授权。

#### Clang 的特性
相比于 GCC，Clang 具有如下优点：

- 编译速度快：在某些平台上，Clang 的编译速度显著的快过 GCC。
- 占用内存小：Clang 生成的 AST 所占用的内存是 GCC 的五分之一左右。
- 模块化设计：Clang 采用基于库的模块化设计，易于 IDE 集成及其他用途的重用。
- 诊断信息可读性强：在编译过程中，Clang 创建并保留了大量详细的元数据 (metadata)，有利于调试和错误报告。
- 设计清晰简单，容易理解，易于扩展增强。与代码基础古老的 GCC 相比，学习曲线平缓。

当前 Clang 还处在不断完善过程中，相比于 GCC, Clang 在以下方面还需要加强：

- 支持更多语言：GCC 除了支持 C/C++/Objective-C, 还支持 Fortran/Pascal/Java/Ada/Go 和其他语言。Clang 目前支持的语言有 C/C++/Objective-C/Objective-C++。
- 加强对 C++ 的支持：Clang 对 C++ 的支持依然落后于 GCC，Clang 还需要加强对 C++ 提供全方位支持。
- 支持更多平台：GCC 流行的时间比较长，已经被广泛使用，对各种平台的支持也很完备。Clang 目前支持的平台有 Linux/Windows/Mac OS。

本段内容参考：[http://www.ibm.com/developerworks/cn/opensource/os-cn-clang/](http://www.ibm.com/developerworks/cn/opensource/os-cn-clang/)

### Clang 编译选项
<div class="hblock"><pre>
clang    [-c|-S|-E] -std=standard -g
         [-O0|-O1|-O2|-O3|-Ofast|-Os|-Oz|-O|-O4]
         -Wwarnings... -pedantic
         -Idir... -Ldir...
         -Dmacro[=defn]
         -ffeature-option...
         -mmachine-option...
         -o output-file
         -stdlib=library
         input-filenames
</pre></div>

大部分选项与 gcc 类似：
<div class="hblock"><pre>
-c 只是编译不链接，生成目标文件“.o” 
-S 只是编译不汇编，生成汇编代码 
-E 只进行预编译，不做其他处理 
-g 在可执行程序中包含标准调试信息 
-o file 把输出文件输出到file里  
-I dir 在头文件的搜索路径列表中添加dir目录 
-L dir 在库文件的搜索路径列表中添加dir目录
</pre></div>

### 中间码的创建与转化
编译生成二进制的 .bc 文件(bitcode file):
> clang -emit-llvm -c xx.c -o xx.bc

编译生成 LLVM 的汇编代码 .ll 文件（ LLVM assembly code）:
> clang -emit-llvm -S xx.c -o xx.ll

.bc 和 .ll 文件都可以直接用 lli 来执行。

将 .ll 文件转化为 .bc 文件:
> llvm-as test.ll

将 .bc 文件转化为 .ll 文件:
> llvm-dis test.bc

将 .bc 或 .ll 文件转化为本机平台的汇编代码：
> llc test.bc

> llc test.ll

> llc test.bc -o test.s

### 即时编译器 JIT 简介
LLVM 中间码的执行需要用到 Jit。那么，JIT到底是个什么东西呢。其实，JIT 是一个即时编译器，即 Just-in-time Compiler。对于 JIT 的了解我也知之胜少，它的作用大概就是对中间码进行编译作业，像 JAVA 这种跨平台的语言也是通过 JIT 实现的。在执行 LLVM 的 lli 工具时，会去调用 JIT 将中间码编译成本机架构的机器码再执行。

至于 jit 与 mcjit 的区别，大概是 jit 是 LLVM 旧版本的支持，而 mcjit 是对 jit 新的支持。`mc`是机器码的意思，即 Machine Code。在 Wikipedia 看到说，以前的 LLVM 会依赖与本机系统的汇编器或者提供一套工具链，然后再翻译成机器码。而通过整合过的 LLVM MC 能够支持大多数的机器架构，包括 x86, x86-64, ARM, ARM64 以及 大部分的 MIPS 架构等。