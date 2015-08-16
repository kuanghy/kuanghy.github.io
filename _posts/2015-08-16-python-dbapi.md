---
layout: post
title: Python数据库接口规范简介 -- DB-API
category: python
tags python DB-API
---

在没有 Python DB-API 之前，各数据库之间的应用接口非常混乱，实现各不相同。如果项目需要更换数据库时，则需要做大量的修改，非常不便。Python DB-API 的出现就是为了解决这样的问题。

Python所有的数据库接口程序都在一定程度上遵守 Python DB-API 规范。DB-API 是一个规范，它定义了一系列必须的对象和数据库存取方式，以便为各种各样的底层数据库系统和多种多样的数据库接口程序提供一致的访问接口。由于DB-API 为不同的数据库提供了一致的访问接口， 在不同的数据库之间移植代码成为一件轻松的事情。

<br/>
## 模块属性
DB-API规范规定数据库接口模块必须实现一些全局的属性以保证兼容性。 
 
#### apilevel
DB-API 模块兼容的 DB-API 版本号。apilevel 这个字符串(不是浮点数)表示这个 DB-API 模块所兼容的 DB-API 最高版本号。如果 "1.0"，"2.0"，如果未定义，则默认是 "1.0"。

#### threadsafety
线程安全级别。threadsafety 这是一个整数, 取值范围如下：

-  0:不支持线程安全, 多个线程不能共享此模块 
-  1:初级线程安全支持: 线程可以共享模块, 但不能共享连接 
-  2:中级线程安全支持 线程可以共享模块和连接, 但不能共享游标 
-  3:完全线程安全支持 线程可以共享模块, 连接及游标. 
 
如果一个资源被共享, 就必需使用自旋锁或者是信号量这样的同步原语对其进行原子目标锁定。对这个目标来说,  磁盘文件和全局变量都不可靠, 并且有可能妨碍。

#### paramstyle
该模块支持的 SQL 语句参数风格 。DB-API 支持多种方式的 SQL 参数风格. 这个参数是一个字符串, 表明 SQL 语句中字符串替代的方式。

#### connect
连接函数。connect 方法生成一个 connect 对象, 我们通过这个对象来访问数据库。符合标准的模块都会实现 connect 方法。connect 函数的参数如下所示：

<div class="hblock"><pre>
user            Username  
password        Password  
host            Hostname 
database        Database name 
dsn             Data source name 
</pre></div>

数据库连接参数可以以一个 DSN 字符串的形式提供, 也可以以多个位置相关参数的形式提供(如果你明确知道参数的顺序的话), 也可以以关键字参数的形式提供。应用示例：

> connect(dsn='myhost:MYDB',user='guido',password='234$') 

当然，不同的数据库接口程序可能有些差异，并非都是严格按照规范实现，例如MySQLdb则使用 db 参数而不是规范推荐的 database 参数来表示要访问的数据库：

-  MySQLdb.connect(host='dbserv', db='inv', user='smith') 
-  PgSQL.connect(database='sales') 
-  psycopg.connect(database='template1', user='pgsql') 
-  gadfly.dbapi20.connect('csrDB', '/usr/local/database') 
-  sqlite3.connect('marketing/test') 

#### 异常
兼容标准的模块也应该提供以下这些异常类：

<div class="hblock"><pre>
Warning            警告异常基类 
Error              错误异常基类 
InterfaceError     数据库接口错误 
DatabaseError      数据库错误 
DataError           理数据时出错 
OperationalError    数据库执行命令时出错 
IntegrityError      数据完整性错误 
InternalError      数据库内部出错 
ProgrammingError    SQL 执行失败
NotSupportedError   试图执行数据库不支持的特性  
</pre></div>

<br/>
## 连接对象
要与数据库进行通信, 必须先和数据库建立连接. 连接对象处理命令如何送往服务器, 以及如何从服务器接收数据等基础功能。 连接成功(或一个连接池)后你就能够向数据库服务器发送请求, 得到响应。

#### 方法
连接对象没有必须定义的数据属性, 但至少应该以下这些方法：

<div class="hblock"><pre>
close()         关闭数据库连接 
commit()        提交当前事务 
rollback()      取消当前事务 
cursor()        使用这个连接创建并返回一个游标或类游标的对象 
errorhandler (cxn, cur,  errcls, errval)  
</pre></div>
 
一旦执行了 close() 方法, 再试图使用连接对象的方法将会导致异常。
 
对不支持事务的数据库或者虽然支持事务, 但设置了自动提交(auto-commit)的数据库系统来说, commit()方法什么也不做。 如果你确实需要, 可以实现一个自定义方法来关闭自动提交行为。由于 DB-API 要求必须实现此方法, 对那些没有事务概念的数据库来说, 这个方法只需要有一条 pass 语句就可以了。 

类似 commit(), rollback() 方法仅对支持事务的数据库有意义。执行完 rollback(), 数据库将恢复到提交事务前的状态. 根据 PEP249, 在提交 commit()之前关闭数据库连接将会自动调用rollback()方法。 
 
对不支持游标的数据库来说, cursor()方法仍然会返回一个尽量模仿游标对象的对象。这些是最低要求。特定数据库接口程序的开发者可以任意为他们的接口程序添加额外的属性。

#### 游标对象
一个游标允许用户执行数据库命令和得到查询结果。一个 Python DB-API 游标对象总是扮演游标的角色, 无论数据库是否真正支持游标。也就说，数据库接口程序必须实现游标对象。创建游标对象之后, 你就可以执行查询或其它命令(或者多个查询和多个命令), 也可以从结果集中取出一条或多条记录。

游标对象拥有的属性和方法：

<div class="hblock"><pre>
arraysize       使用 fechmany()方法一次取出多少条记录, 默认值为 1 
connectionn     创建此游标对象的连接(可选) 
description         返回游标活动状态(一个包含七个元素的元组):  (name,  type_code, display_size, internal_ size, precision, scale, null_ok); 只有 name 和 type_code 是必须提供的  
lastrowid       返回最后更新行的 id (可选), 如果数据库不支持行 id, 默认返回 None) 
rowcount        最后一次 execute() 操作返回或影响的行数.  
callproc(func[,args])  调用一个存储过程 
close()             关闭游标对象 
execute(op[,args])    执行一个数据库查询或命令 
executemany(op,args)  类似 execute() 和 map() 的结合, 为给定的每一个参数准备并执行一个数据库查询/命令 
fetchone()      得到结果集的下一行 
fetchmany([size=cursor.arraysize])      得到结果集的下几行 (几 = size) 
fetchall()      返回结果集中剩下的所有行 
__iter__()      创建一个迭代对象 (可选; 参阅 next()) 
messages        游标执行后数据库返回的信息列表 (元组集合) (可选) 
next()      使用迭代对象得到结果集的下一行(可选; 类似 fetchone(), 参阅 __iter__()) 
nextset()       移到下一个结果集 (如果支持的话) 
rownumber       当前结果集中游标的索引 (以行为单位, 从 0 开始) (可选) 
setinput- sizes(sizes) 设置输入最大值 (必须有, 但具体实现是可选的) 
setoutput- size(size[,col]) 设置大列的缓冲区大写(必须有, 但具体实现是可选的) 
</pre></div>

游标对象最重要的属性是 execute*() 和 fetch*() 方法. 所有对数据库服务器的请求都由它们来完成。对fetchmany()方法来说, 设置一个合理的arraysize 属性会很有用。 当然, 在不需要时，最好关掉游标对象。如果数据库支持存储过程, 则可以使用 callproc() 方法。   

#### 类型对象和构造器 
通常两个不同系统的接口要求的参数类型是不一致的, 譬如python调用c函数时Python对象和 C 类型之间就需要数据格式的转换, 反之亦然。类似的, 在 Python 对象和原生数据库对象之间也是如此。对于 Python DB-API 的开发者来说, 你传递给数据库的参数是字符串形式的, 但数据库会根据需要将它转换为多种不同的形式. 以确保每次查询能被正确执行。
 
举例来说, 一个 Python 字符串可能被转换为一个 VARCHAR, 或一个TEXT, 或一个BLOB, 或一个原生 BINARY 对象, 或一个 DATE 或 TIME 对象。一个字符串到底会被转换成什么类型? 必须小心的尽可能以数据库期望的数据类型来提供输入, 因此另一个DB-API的需求是创建一个构造器以生成特殊的对象, 以便能够方便的将 Python 对象转换为合适的数据库对象。以下所列内容描述了可以用于此目的的类。SQL 的 NULL 值被映射为 Pyhton 的 NULL 对象, 也就是 None。  

<div class="hblock"><pre>
Date(yr,mo,dy)      日期值对象 
Time(hr,min,sec)   时间值对象 
Timestamp(yr,mo,dy, hr, min,sec)      时间戳对象 
DateFromTicks(ticks) 通过自 1970-01-01 00:00:01 utc 以来的 ticks 秒数得到日期 
TimeFromTicks(ticks) 通过自 1970-01-01 00:00:01 utc 以来的 ticks 秒数得到时间值对象 
TimestampFromTicks(ticks) 通过自 1970-01-01 00:00:01 utc 以来的 ticks 秒数得到时间戳对象 
Binary(string)  对应二进制长字符串值的对象 
STRING        描述字符串列的对象, 比如 VARCHAR 
BINARY        描述二进制长列的对象 比如 RAW, BLOB 
NUMBER        描述数字列的对象 
DATETIME      描述日期时间列的对象 
ROWID          描述 “row ID” 列的对象 
</pre><div>

<br/>
## DB-API 操作数据库流程

[db-api works](http://ww4.sinaimg.cn/mw690/c3c88275jw1ev3oaz0xt4j20lm0awjsh.jpg)

<br/>
## 数据库操作示例
{% highlight python %}
#! /usr/bin/env python
# -*- coding: utf-8 -*-

# *************************************************************
#     Filename @  operatemysql.py
#       Author @  Huoty
#  Create date @  2015-08-16 10:44:34
#  Description @  
# *************************************************************

import MySQLdb

# Script starts from here

# 连接数据库
db_conn = MySQLdb.connect(host = 'localhost', user= 'root', passwd = '123456')

# 如果已经创建了数据库，可以直接用如下方式连接数据库
#db_conn = MySQLdb.connect(host = "localhost", user = "root",passwd = "123456", db = "testdb")

"""
connect方法常用参数:
    host: 数据库主机名.默认是用本地主机
    user: 数据库登陆名.默认是当前用户
    passwd: 数据库登陆的秘密.默认为空
    db: 要使用的数据库名.没有默认值
    port: MySQL服务使用的TCP端口.默认是3306
    charset: 数据库编码
"""

# 获取操作游标 
cursor = db_conn.cursor()

# 使用 execute 方法执行SQL语句
cursor.execute("SELECT VERSION()")

# 使用 fetchone 方法获取一条数据库。
dbversion = cursor.fetchone()

print "Database version : %s " % dbversion

# 创建数据库
cursor.execute("create database if not exists dbtest")

# 选择要操作的数据库
db_conn.select_db('dbtest');

# 创建数据表SQL语句
sql = """CREATE TABLE if not exists employee(
         first_name CHAR(20) NOT NULL,
         last_name CHAR(20),
         age INT,  
         sex CHAR(1),
         income FLOAT )"""

try:
    cursor.execute(sql)
except Exception, e:
    # Exception 是所有异常的基类，这里表示捕获所有的异常
    print "Error to create table:", e

# 插入数据
sql = """INSERT INTO employee(first_name,
         last_name, age, sex, income)
         VALUES ('%s', '%s', %d, '%s', %d)"""

# Sex: Male男, Female女

employees = ( 
        {"first_name": "Mac", "last_name": "Mohan", "age": 20, "sex": "M", "income": 2000},
        {"first_name": "Wei", "last_name": "Zhu", "age": 24, "sex": "M", "income": 7500},
        {"first_name": "Huoty", "last_name": "Kong", "age": 24, "sex": "M", "income": 8000},
        {"first_name": "Esenich", "last_name": "Lu", "age": 22, "sex": "F", "income": 3500},
        {"first_name": "Xmin", "last_name": "Yun", "age": 31, "sex": "F", "income": 9500},
        {"first_name": "Yxia", "last_name": "Fun", "age": 23, "sex": "M", "income": 3500}
        )

try:
    # 清空表中数据
    cursor.execute("delete from employee")
    # 执行 sql 插入语句
    for employee in employees:
        cursor.execute(sql % (employee["first_name"], \
            employee["last_name"], \
            employee["age"], \
            employee["sex"], \
            employee["income"]))
    # 提交到数据库执行
    db_conn.commit()
    # 对于支持事务的数据库， 在Python数据库编程中，
    # 当游标建立之时，就自动开始了一个隐形的数据库事务。
    # 用 commit 方法能够提交事物
except Exception, e:
    # Rollback in case there is any error
    print "Error to insert data:", e
    #b_conn.rollback()

print "Insert rowcount:", cursor.rowcount
# rowcount 是一个只读属性，并返回执行execute(方法后影响的行数。)

# 数据库查询操作:
#    fetchone()      得到结果集的下一行 
#    fetchmany([size=cursor.arraysize])  得到结果集的下几行 
#    fetchall()      返回结果集中剩下的所有行 
try:
    # 执行 SQL
    cursor.execute("select * from employee")

    # 获取一行记录
    rs = cursor.fetchone()
    print rs

    # 获取余下记录中的 2 行记录
    rs = cursor.fetchmany(2)
    print rs

    # 获取剩下的所有记录
    ars =  cursor.fetchall()
    for rs in ars:
        print rs
    # 可以用 fetchall 获得所有记录，然后再遍历
except Exception, e:
    print "Error to select:", e

# 数据库更新操作
sql = "UPDATE employee SET age = age + 1 WHERE sex = '%c'" % ('M')
try:
    # 执行SQL语句
    cursor.execute(sql)
    # 提交到数据库执行
    db_conn.commit()
    cursor.execute("select * from employee")
    ars =  cursor.fetchall()
    print "After update: ------"
    for rs in ars:
        print rs
except Exception, e:
    # 发生错误时回滚
    print "Error to update:", e
    db.rollback()

# 关闭数据库连接
db_conn.close()
{% endhighlight %}

<br/>
## 参考资料
[https://www.python.org/dev/peps/pep-0249/](https://www.python.org/dev/peps/pep-0249/)<br/>
[https://wiki.python.org/moin/DatabaseProgramming](https://wiki.python.org/moin/DatabaseProgramming)<br/>
[https://wiki.python.org/moin/DbApi3](https://wiki.python.org/moin/DbApi3)