---
layout: post
title: "Python 模块收集"
keywords: python 模块收集 库收集 collections 爬虫 框架 并行计算 科学计算 数据处理
description: "收集一些好用的 Python 第三方模块，并对功能做简单描述"
category: Python
tags: python
---

## 基础库和工具

- [six](https://pypi.python.org/pypi/six) Python 2 和 3 的兼容库，用于编写 Python2 和 3 兼容的代码
- [attrs](https://pypi.python.org/pypi/attrs) Attributes Without Boilerplate
- [assertpy](https://github.com/ActivisionGameScience/assertpy) assert 语句的替代品
- [affirm](https://github.com/elifiner/affirm) 用于更好的替换 assert 语句
- [decorator](https://github.com/micheles/decorator) 简化 decorator 的使用难度而开发的模块
- [isort](https://github.com/timothycrosley/isort) 可自动对 Python 的 import 语句进行排序和分段。可将大量的 import 结构转成非常适合阅读的排版
- [fuzzyfinder](https://github.com/amjith/fuzzyfinder) 10 行代码写的模糊查询
- [interruptingcow](https://pypi.python.org/pypi/interruptingcow) 一个 watchdog，用于中断长时间运行的代码，也就是给代码加上 timeout 功能
- [fuzzywuzzy](https://github.com/seatgeek/fuzzywuzzy) 字符串模糊匹配工具
- [py](https://github.com/pytest-dev/py) 一个开发支持工具
- [faker](https://github.com/joke2k/faker) 一个假数据生成库
- [pipenv](https://github.com/pypa/pipenv) Python Development Workflow for Humans,相当于是环境管理和包管理二合一，由 Kenneth Reitz （Requests 的作者 ）编写，现在移交给 Python 官方来维护，提供比 pip 体验更好的开发包管理
- [flashtext](https://github.com/vi3k6i5/flashtext) 快速进行大规模语料库的文本搜索与替换
- [Eel](https://github.com/ChrisKnott/Eel) 一个小型库，用于制作简单的类似 [Electron](https://electronjs.org/) 的离线 HTML/JS GUI 应用程序
- [bidict](https://github.com/jab/bidict) 双向查询字典，可以通过 value 查询 key
- [tablib](https://github.com/kennethreitz/tablib) 把数据导出为 Excel、JSON、CSV 等格式


## 日志处理

- [logging](https://docs.python.org/2/howto/logging.html) 标准库日志系统
- [logbook](https://pythonhosted.org/Logbook/) 一个功能完备强大的日志库
- [Structlog](https://structlog.readthedocs.io/en/stable/) 是一个先进的日志处理器。他可以和任何现存的日志记录工具相集成，并包装了 Python 标准库。你可以构建定制的记录工具，根据你的需要增加上下文，保证你的日志一致、可读


## 系统工具

- [keyring](http://pythonhosted.org/keyring/)
- [sh](https://amoffat.github.io/sh/) 是一个成熟的Python子进程接口，允许你像调用函数一样调用任何程序。超级好用。
- [Watchdog](http://pythonhosted.org/watchdog/) 是一个跨平台的Python库和shell工具，可以监视文件系统事件。超级好用，容易上手。
- [PyFilesystem](https://github.com/PyFilesystem/pyfilesystem2) 文件系统的抽象层


## 邮件

- [yagmail](https://github.com/kootenpv/yagmail)
- [mailer](https://pypi.python.org/pypi/mailer)


## 数据库

- [MySQL-Python](http://mysql-python.sourceforge.net/) 对 MySQL C 驱动的封装，仅支持 Python2，该项目名称为[MySQLdb1](https://github.com/farcepest/MySQLdb1)
- [mysqlclient](https://github.com/PyMySQL/mysqlclient-python) 基于 MySQLdb1 项目，并添加对 Python3 的支持
- [mysql-connector-python](https://dev.mysql.com/doc/connector-python/en/) MySQL 官方支持的纯 Python 驱动
- [PyMySQL](https://github.com/PyMySQL/PyMySQL) MySQL 的一个纯 Python 接口
- [Tornado-MySQL](https://github.com/PyMySQL/Tornado-MySQL) 基于 PyMySQL 并添加对 Tornado 的支持
- [adb](https://github.com/ovidiucp/pymysql-benchmarks) 异步 mysql 库
- [SQLAlchemy](http://www.sqlalchemy.org/) 提供了 SQL 工具包及对象关系映射(ORM)工具
- [Peewee](http://peewee.readthedocs.io/en/latest/) 超级轻量的一个 ORM 框架
- [pymongo](http://api.mongodb.com/python/current/index.html) MongoDB 官方支持的驱动程序
- [motor](http://motor.readthedocs.io/) 为 Tornado 提供了一个基于回调和 Future 机制的非堵塞的 MongoDB 驱动程序
- [redis-py](https://redis-py.readthedocs.io/en/latest/) Redis 的 Python 接口程序


## 打印输出

- [prettytable](http://ptable.readthedocs.io/en/latest/index.html) 表格形式输出数据
- [tabulate](https://pypi.python.org/pypi/tabulate) 可以仅调用一个函数就能够输出小的、好看的表格
- [humanize](https://github.com/jmoiron/humanize) 将数值、日期等转化为更易读的形式
- [colorama](https://pypi.python.org/pypi/colorama) 输出着色，跨平台
- [termcolor](https://pypi.python.org/pypi/termcolor) 输出着色
- [blessings](https://pypi.python.org/pypi/blessings) 输出着色
- [hues](https://github.com/prashnts/hues) 输出着色，同时可以用来代替日志模块
- [better-exceptions](https://github.com/Qix-/better-exceptions) 以更友好的形式展示异常信息
- [progressbar](https://github.com/WoLpH/python-progressbar) 控制台进度条，功能完备
- [tqdm](https://github.com/tqdm/tqdm) 控制台进度条工具，支持命令行直接使用
- [icecream](https://github.com/gruns/icecream) 一款专用于 print 调试的工具


## 算法和设计模式

- [https://github.com/nryoung/algorithms](https://github.com/nryoung/algorithms) 算法和数据结构库
- [https://github.com/tylerlaberge/PyPattyrn.git](https://github.com/tylerlaberge/PyPattyrn.git) 一个实现了常见设计模式的简单且有效的 Python 库
- [https://github.com/faif/python-patterns](https://github.com/faif/python-patterns) 设计模式和惯用法收集
- [https://github.com/grantjenks/sorted_containers](https://github.com/grantjenks/sorted_containers) 高效的，纯 Python 实现的 SortedList、SortedDict 和 SortedSet 类型


## 并行计算、分布式、任务调度

- [Celery](http://www.celeryproject.org/) 一个非常成熟的Python分布式框架，可以在分布式的系统中，异步的执行任务，并提供有效的管理和调度功能。
- [SCOOP](https://github.com/soravux/scoop/) 提供简单易用的分布式调用接口，使用Future接口来进行并发。
- [Dispy](https://github.com/pgiri/dispy) 相比起 Celery 和 SCOOP，Dispy 提供更为轻量级的分布式并行服务
- [PP](http://www.parallelpython.com/) （Parallel Python）是另外一个轻量级的 Python 并行服务
- [Asyncoro](http://asyncoro.sourceforge.net/) 一个利用 Generator 实现分布式并发的 Python 框架
- [schedule](https://github.com/dbader/schedule) 一个简单的作业调度工具
- [APScheduler](http://apscheduler.readthedocs.io/en/latest/) 任务调度模块，一个 Python 定时任务框架
- [mpi4py](http://pythonhosted.org/mpi4py/) 一个构建在MPI之上的Python库，主要使用Cython编写
- [pyee](https://pyee.readthedocs.io) 一个 [node.js’s EventEmitter](https://nodejs.org/api/events.html) 的 Python 粗略实现
- [threadpool](https://chrisarndt.de/projects/threadpool/) 一个比较老的线程池库，不太建议使用


## 命令行参数解析

- [Docopt](http://docopt.org/) 忘了 optparse 和 argparse 吧，使用 docstring 来构建优雅的、高可读性、复杂（如果你有这个需要）的命令行界面。在我看来这是2013年诞生的最好的库
- [Click](http://click.pocoo.org) 用于快速创建命令行工具
- [clize](http://clize.readthedocs.io/en/stable/) 利用装饰器将函数转换成命令行解析器
- [python-fire](https://github.com/google/python-fire) Google 开源的一个可从任何 Python 代码自动生成命令行接口（CLI）的库,是开发和调试非常有用的工具，只需将想要在命令行显示的功能写为函数/模块/类，就可以在命令行模式下调用


## HTTP

- [Requests](http://docs.python-requests.org/) 为人类准备的 HTTP，以更 pythonic 的方式处理 HTTP 请求，比 urllib2 好用得多
- [builtwith](https://pypi.python.org/pypi/builtwith/) 识别网站所使用技术
- [whois](https://pypi.python.org/pypi/python-whois) 域名公共查询工具：[Whois](http://whois.chinaz.com)
- [robotparser](https://docs.python.org/3.5/library/urllib.robotparser.html) 标准库，解析 robots.txt 文件
- [requestium](https://github.com/tryolabs/requestium) 是 Requests, Selenium 和 Parsel 的结合体，结合了 Chrome 59 以后的 headless 无头特性（代替了 phantomjs）
- [fake-useragent](https://github.com/hellysmile/fake-useragent) 伪造 HTTP 请求头中 User Agent 的值


## HTML/XML

- [lxml](http://lxml.de/) 联合了 libxml2 和 libxslt。如果你要处理 XML 或 HTML，lxml 是最好的选择，真的
- [PyQuery](https://pythonhosted.org/pyquery/) 像 JQuery 一样使用
- [html5lib](http://html5lib.readthedocs.io/en/latest/)
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/) 一个可以从 HTML 或 XML 文件中提取数据的 Python 库
- [requests-html](https://github.com/kennethreitz/requests-html) HTML 解析库，是对 Requests, PyQuery, lxml 等库的封装


## Web 框架

- [Bottle](http://bottlepy.org/docs/dev/) 是一个快速、简单、轻量的WSGI微型web框架。利用Bottle构建小型站点和API的时间以秒计算。这个框架只有一个py文件，你可以把它放进任何目录
- [Django](https://www.djangoproject.com/) 以快速开发和结构整洁著称的高层框架。这个开源免费的框架完全由 Python 编写并且遵循 MVC 的模型
- [CherryPy](http://cherrypy.org/) 是HTTP协议的一个封装，这样其他软件可以使用它来处理HTTP协议的细节。它是一个低层的框架，它只提供 RFC 2616 定义的功能。接口非常 Pythonic，让 Python 开发者不会感到突兀
- [Flask](http://flask.pocoo.org/) 基于 WerkzeugWSGI 工具箱和 jinja 模板，适合开发轻量级的 Web 应用，有很多第三方扩展
- [Pyramid](http://docs.pylonsproject.org/projects/pyramid/en/latest/) 包含了一些 Python/Perl/Ruby 独有的特性，拥有不依赖平台的 MVC 架构，和最快的启动开发的能力。以执行效率和快速开发的能力著称
- [TurboGear](http://turbogears.org/) 建立在其他框架基础上的框架，把其他框架优秀的部分集成到一起。由于每个框架都有一些部分做得不好，TurboGear试图解决这个问题．它允许你从一个单文件服务开始，逐步扩展为一个全栈服务
- [tornado ](http://www.tornadoweb.org/en/stable/) 一个强大的、可扩展的异步非阻塞 Web 服务器，同时也是一个轻量级 Web 框架
- [web.py](http://webpy.org/) 一款轻量级的 Python web 开发框架，简单、高效
- [web2py](http://www.web2py.com/) 一种免费的、开源的 web 开发框架，用于敏捷地开发安全的、数据库驱动的 web 应用
- [Sanic](https://github.com/channelcat/sanic) 一个与 Flask 类似，基于 uvloop 的 web 框架，它能让 Python 更快速
- [hug](https://github.com/timothycrosley/hug) 旨在简化 Python RESET APIs 的开发，其本身并非一个网络框架，构建在 Falcon 的高性能 HTTP 库之上，意味着可以使用任何 wsgi 兼容的服务器(例如 gunicorn)将其部署到生产环境中


## Web Server

- [Gunicorn](http://gunicorn.org/) Green Unicorn，是一个 WSGI 服务器，用来支持 Python 应用，被设计成运行于Nginx之后，轻量级、易于使用、并使用许多UNIX特性
- [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) 用来构建全栈式的主机服务，既能当作独立的 web 路由器来运行，也能运行在一个完整 web 服务器（比如Nginx或Apache）之后
- [Meinheld](https://github.com/mopemope/meinheld) 一个高性能的异步 WSGI Web 服务, 利用 greenlet 和 Picoev 实现异步 I/O


## 网络爬虫

- [scrapy](https://scrapy.org/)
- [mechanize](http://wwwsearch.sourceforge.net/mechanize/)
- [selenium](http://selenium-python.readthedocs.io/) 一个调用浏览器的driver，通过这个库你可以直接调用浏览器完成某些操作
- [cola](https://github.com/chineking/cola) 一个分布式爬虫框架。
- [pyspider](http://docs.pyspider.org/en/latest/)


## 消息队列

- [pika](https://pika.readthedocs.io/en/0.10.0/) RabbitMQ 的 Python 库
- [zmq](https://pyzmq.readthedocs.io/en/latest/) ZeroMQ 的 Python 库
- [kafka-python](http://kafka-python.readthedocs.io/en/master/) Apache Kafka 的 Python 库
- [boto](https://aws.amazon.com/cn/sdk-for-python/) 亚马逊消息列队服务 Python SDK


## 远程对象支持

- [Dopy](http://www.mindhog.net/~mmuller/projects/dopy/)
- [Fnorb](http://fnorb.sourceforge.net/)
- [ICE](http://www.zeroc.com/index.html)
- [omniORB](http://omniorb.sourceforge.net/)
- [Pyro](http://irmen.home.xs4all.nl/pyro/)
- [YAMI](http://www.inspirel.com/yami4/)


## 日期和时间处理

- [Delorean](http://delorean.readthedocs.io/en/latest/quickstart.html) 用它处理日期和时间非常方便。设置时区，截取到秒、分、小时，甚至使用特定步骤从一个日期进到另一个日期
- [Arrow](http://crsmithdev.com/arrow/) 提供了合理的、友好的方式来创建、控制、格式化、转换 Python 的日期、时间和时间戳
- [Pendulum](https://pendulum.eustace.io) 在标准库的基础之上，提供了一个更简洁，更易于使用的 API
- [dateutil](http://labix.org/python-dateutil) 是 datetime 标准库的一个扩展库，几乎支持以所有字符串格式对日期进行通用解析，日期计算灵活，内部数据更新及时
- [moment](https://github.com/zachwill/moment) 用于处理日期/时间的 Python 库，设计灵感同样是来源于 moment.js 和 requests ，设计理念源自 Times Python 模块
- [when.py](http://whenpy.rtfd.org/) 提供对用户非常友好的特性来帮助执行常见的日期和时间操作
- [maya](https://github.com/kennethreitz/maya) 主要为了解决解析网站时间数据的问题


## Excel

- [OpenPyXL](https://openpyxl.readthedocs.io/en/default/)
- [XlsxWriter](https://xlsxwriter.readthedocs.io/)
- [xlutils](http://xlutils.readthedocs.io/en/latest/)


## SSH

- [scp](https://github.com/jbardin/scp.py)
- [paramiko](http://www.paramiko.org/)


## 科学计算与数据处理

- [numpy](http://www.numpy.org/)
- [pandas](http://pandas.pydata.org/)
- [PyTables](http://www.pytables.org/)  提供了一些用于结构化数组的高级查询功能，而且还能添加列索引以提升查询速度，这跟关系型数据库所提供的表索引功能非常类似。
- [h5py](http://docs.h5py.org/)  将数据存储为高效且可压缩的HDF5格式
- [fastcache](https://github.com/pbrady/fastcache) 用 C 实现的，更快的，兼容 Python2 和 Python3 的缓存模块
- [PrettyPandas](http://prettypandas.readthedocs.io) 用 pandas Style API 来将DataFrames转换成适合展示的表格
- [bcolz](https://github.com/Blosc/bcolz) 列式存储的数据持久化方案，压缩率高而且查询速度快
- [odo](https://github.com/blaze/odo) 在各种数据格式之间高效的迁移数据。这里的数据格式既包括内存中的数据结构，比如：列表、集合、元组、迭代器、numpy中的ndarray、pandas中的DataFrame、dynd中的array，以及上述各类的流式序列。也包括存在于Python程序之外的持久化数据，比如：CSV、JSON、行定界的JSON，以及以上各类的远程版本，HDF5 (标准格式与Pandas格式皆可)、 BColz、 SAS、 SQL 数据库 ( SQLAlchemy支持的皆可)、 Mongo 等
- [Blaze](https://github.com/blaze/blaze) 用于处理数据库和分析查询的阵列技术。是下一代的 [NumPy](http://www.numpy.org/)。用于处理分布式的各种不同数据源的计算
- [joblib](http://pythonhosted.org/joblib/) 为Python函数提供轻量级管道任务(pipeline job)服务的一系列工具，包括透明磁盘IO缓冲、快速序列化、简单并行化运行、日志服务等，为大数据集的快速可靠处理进行了优化，特别针对numpy数组的处理进行了优化


## 自然语言处理

- [python-pinyin](https://github.com/mozillazg/python-pinyin) 将汉字转为拼音。可以用于汉字注音、排序、检索
- [Pinyin2Hanzi](https://github.com/letiantian/Pinyin2Hanzi) 拼音转汉字，可以作为拼音输入法的转换引擎
- [jieba](https://github.com/fxsjy/jieba)  中文分词组件
- [thulac](http://thulac.thunlp.org/) 一个高效的中文词法分析工具包
- [SnowNLP](https://github.com/isnowfy/snownlp) 处理中文文本的库


## 代码与性能测试

- [pytest](https://docs.pytest.org/) 一个成熟的全功能的 Python 测试框架
- [mock](https://pypi.python.org/pypi/mock) 用来创建和管理模拟对象，以完成单元测试，在 Python 3.x 中已被集成到 unittest 标准库
- [Fudge](https://github.com/fudge-py/fudge) 是一个类似于 Java 中的 JMock 的纯 python 的 mock 测试模块，主要功能就是可以伪造对象，替换代码中真实的对象，来完成测试
- [HTMLTestRunner](https://pypi.python.org/pypi/HTMLTestRunner) 是 Python 标准库 unittest 单元测试框架的一个扩展，用来生成 HTML 测试报告
- [Locust](http://locust.io/) 是一个 Python 的性能测试工具，可以通过写 Python 脚本的方式来对 web 接口进行负载测试


## 性能优化

- [numba](http://numba.pydata.org/) 使用 Just-in-Time(JIT) 即时编译器的方式加速代码，其 Python 源码通过 LLVMPy 生成 JIT 后的 so文件来加速
- [cython](http://cython.org/) 是 Python 的 C 语言扩展。准确说 Cython 是单独的一门语言，专门用来写在 Python 里面 import 用的扩展库。实际上 Cython 的语法基本上跟 Python 一致，而 Cython 有专门的编译器：先将 Cython 代码转变成 C(自动加入了一大堆的 C-Python API)，然后使用 C 编译器编译出最终的 Python 可调用的模块。不过 Cython 的缺点是，你并不能真正编写 Python 代码
- [pypy](https://pypy.org/) 使用 Python 实现的解释器，它使用了 Just-in-Time(JIT) 即时编译器，即动态编译器，与静态编译器（如gcc,java等）不同，它是利用程序运行的过程的数据进行优化
- [Pyston](https://github.com/dropbox/pyston) 是一款 Dropbox 推出的新的基于 JIT 的 Python 实现，使用 LLVM 编译器实现代码解析与转换
