---
layout: post
title: MySQL 数据库基本使用指南
keywords: mysql 数据库 mysqld mysqld_safe
description: "MySQL 是一个非常流行的小型关系型数据库管理系统"
category: 数据库
tags: mysql 数据库
---

MySQL 是一个非常流行的小型关系型数据库管理系统。在数据库的管理上，通常会使用一些客户端工具，如 phpMyAdmin，navicat preminu，HeidiSQL， Sequal Pro，SQLyog，MySQL Workbench 等等。但有时候可能会无可避免的要用到命令行下的操作，本文旨在记录一些 MySQL 的基本使用方法，以及配置等。

## 安装与启动

如果是在 Ubuntu 系统中，使用 apt 工具安装完 MySQL 时会提示设置用户名和密码，如何没有设置，可以采用如下方式**创建密码**：

> mysqladmin -u root password "new_password"

使用包管理工具安装的 mysql 一般都会创建系统服务，以便于管理：

```shell
# 启动
sudo service mysql start

# 重启
sudo service mysql restart

# 停止
sudo service mysql stop

# 检查是否启动成功
ps -ef | grep mysqld
```

使用命令行客户端工具 **登录到服务器** 实现管理操作：

> mysql -u root -P <port> -p<password>

登录成功后可以先尝试一些简单的操作：

```sql
# 列出数据库
show databases;

# 选择要操作的数据库，此后所有 mysql 命令皆只针对该数据库
use <database name>;

# 列出库中所有表（需先用 use 选择数据库）
show tables;
```

此外，也可以自行通过源码编译安装，这样的好处是可以做很多定制，缺点就是初始化、配置、启动等需要手动处理，比较麻烦。编译安装完成后需要先对数据库进行初始化：

```
# 初始化数据库，会在错误日志文件中生成随机密码
# 参数 --defaults-file 表示指定配置文件，否者会去默认位置查找
# 参数 --console 可以将错误日志输出到屏幕
bin/mysqld --defaults-file=my.cnf --initialize --console

# 使用 --initialize-insecure 参数可以生成无密码的 root 账户
bin/mysqld --defaults-file=my.cnf --initialize-insecure
```

在 5.7.7 之前没有 --initialize 参数，而是使用如下方式初始化:

```
scripts/mysql_install_db --defaults-file=my.cnf
```

启动推荐使用 mysqld_safe 命令，其增加了一些安全特性，以及一些额外的控制项, 如 --open-files-limit，--core-file-size 等。

> bin/mysqld_safe --defaults-file=my.cnf

如果是编译安装的，首次登陆之后可能需要先修改密码。修改 root 密码的三种方式：

- 用 mysqladmin 命令来改 root 用户口令

```
bin/mysqladmin --defaults-file=my.cnf -h 127.0.0.1 -u root password 'new-password'
```

- 用 set password 命令来修改密码：

```sql
mysql> set password for root@localhost=password('new-password');
```

- 直接修改 user 表的 root 用户口令：

```sql
mysql> use mysql;
mysql> update user set password=password('new-password') where user='root';
mysql> flush privileges;
```

MySQL8 之后使用如下方式修改 root 密码：

```sql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'new-password';
```

从 MySQL8 开始，用户密码默认使用 `caching_sha2_password` 方式加密，目前大部分客户端还不支持 caching_sha2_password 插件，所以可能需要将密码改成 mysql_native_password 的机密方式：

```sql
myql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new-password';
```

如果忘记了 root 密码，使用 --skip-grant-tables 参数以跳过密码认证方式启动服务器，再修改密码：

```
bin/mysqld --defaults-file=my.cnf --skip-grant-tables &
```

删除默认的数据库和用户，避免应存在漏洞而被注入攻击（test 库在 5.7 版本后默认没删除了）：

```sql
mysql> drop database test;
mysql> delete from mysql.db;
mysql> delete from mysql.user where not(host="localhost" and user="root");
mysql> flush privileges;
```

## 基本配置

**basedir:**

该参数指定了安装 MySQL 的安装路径，填写全路径可以解决相对路径所造成的问题。例如：

```
basedir="/home/huoty/.local/mysql"
```

则表示 MySQL 安装在 /home/huoty/.local/mysql 路径下。

**datadir:**

该参数指定了 MySQL 的数据库文件的存放路径，即 MySQL data 文件位置。例如：

```
datadir="/home/huoty/.local/mysql/data"
```

**sql_safe_updates:**

以完全模式执行 SQL 语句，安全模式打开后，没有限制条件的更新语句(update,delete)将会被拒绝。设置方式为：

```sql
set [global] sql_safe_updates=1;
```

## 权限管理

**创建用户**

```sql
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
```

- username：需要创建的用户名
- host：指定用户在哪个主机上可以登录，本地用户可用 localhost，允许从任意远程主机登录则使用通配符 %
- password：用户的登录密码，密码可以为空，如果为空则该用户可以不需要密码登录服务器

示例：

```sql
CREATE USER 'user'@'localhost' IDENTIFIED BY '123456';
CREATE USER 'user'@'192.168.1.101' IDENDIFIED BY '123456';
CREATE USER 'user'@'%' IDENTIFIED BY '123456';
CREATE USER 'user'@'%' IDENTIFIED BY '';
CREATE USER 'user'@'%';

# 指定 mysql_native_password 密码加密方式
CREATE USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
```

从 **MySQL 8** 开始，如果需要用 mysql_native_password 加密方式，需用如下方式创建用户：

```sql
CREATE USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
```

如果需要删除用户，使用 DROP USER 命令：

```sql
DROP USER 'username'@'host';
```

**用户密码设置(修改)**

```sql
SET PASSWORD FOR 'username'@'host' = PASSWORD('new-password');
```

示例：

```sql
SET PASSWORD FOR 'server'@'%' = PASSWORD("12345678");
```

如果是当前登录用户，可修改自己的密码：

```sql
SET PASSWORD = PASSWORD("new-password");
```

也可以使用 **ALTER USER** 修改用户密码：

```sql
# 修改用户密码
ALTER USER 'username'@'host' IDENTIFIED BY '123456';

# 修改当前用户密码
ALTER USER user() IDENTIFIED BY '123456';

# 修改密码加密规则
ALTER USER 'username'@'host' IDENTIFIED WITH mysql_native_password BY '123456';

# 使密码过期
ALTER USER 'username'@'host' IDENTIFIED BY '123456' PASSWORD EXPIRE;

# 设置密码永不过期
ALTER USER 'username'@'host' IDENTIFIED BY '123456' PASSWORD EXPIRE never;

# 设置过期时间为默认值
ALTER USER 'username'@'host' IDENTIFIED BY '123456' PASSWORD EXPIRE default;

# 指定过期时间间隔
ALTER USER 'username'@'host' IDENTIFIED BY '123456' PASSWORD EXPIRE interval 90 day;
```

**授权用户**

```sql
GRANT privileges ON databasename.tablename TO 'username'@'host' [WITH GRANT OPTION]
```

- privileges：指定允许用户操作的权限，如 SELECT，INSERT，UPDATE 等，ALL 表示授予所权限
- databasename：数据库名
- tablename：表名，如果要授予该用户对所有数据库或表的相应操作权限则可用 * 表示，如 `*.*`
- [with grant option]：表示该用户可将拥有的权限授予给其他用户（即权限传递）

常用的用户权限说明：

- **CREATE:** 建立新的数据库或数据表
- **DROP:** 删除数据表或数据库
- **ALTER:** 修改已存在的数据表(例如增加/删除列)和索引
- **INDEX:** 建立或删除索引
- **TRIGGER:** 创建，删除，执行触发器
- **CREATE VIEW:** 创建视图
- **CREATE TEMPOARY TABLES:** 创建临时表
- **INSERT:** 增加表的记录
- **DELETE:** 删除表的记录
- **UPDATE:** 修改表中已存在的记录
- **SELECT:** 显示/搜索表的记录
- **PROCESS:** 显示或杀死属于其它用户的服务线程
- **RELOAD:** 重载访问控制表，刷新日志等
- **SHUTDOWN:** 关闭MySQL服务
- **ALL:** 允许做任何事(和 root 账户一样)
- **USAGE:** 只允许登录(其它什么也不允许做)

示例：

```sql
GRANT SELECT, INSERT, UPDATE, CREATE ON *.* TO 'server'@'%';
GRANT ALL ON *.* TO 'admin'@'%';
GRANT SELECT ON test.* TO 'reader'@'%';
GRANT SELECT, UPDATE ON test.* TO 'user1'@'%';
```

**撤销授权**：

```sql
REVOKE privilege ON databasename.tablename FROM 'username'@'host';
```

其中的 privilege, databasename, tablename 需与授权是相同才能生效。示例：

```sql
REVOKE SECECT ON test.* FROM 'reader'@'%';
```

**权限查看**：

```sql
# 授权查看语法
SHOW GRANTS [FOR 'username'@'host'];

# 默认查看当前用户当前机器的权限
SHOW GRANTS;

# 查看指定用户和机器的权限
SHOW GRANTS FOR 'reader'@'localhost';
SHOW GRANTS FOR 'reader'@'192.168.3.%';

# 从 user 表中查看权限
SELECT * FROM mysql.user WHERE user='username' AND host='host' \G;

# 从 db 表中查看权限（可以看到用于对不同库的详细权限）
SELECT * FROM mysql.db WHERE user='username' AND host='host' \G;
```

## 基本操作

**SHOW 语句使用：**

```sql
# 查看所有支持的存储引擎
show engines;

# 查看 InnoDB 存储引擎状态
show engine innodb status;

# 系统特定资源的信息，如正在运行的线程数量
show status;
show status like '%connect%';
show status where `variable_name`='Threads_connected';

# 显示系统变量的名称和值
show variables;

# 显示服务器所支持的不同权限
show privileges;

# 查看用户权限
show grants for user_name;

# 列出所有数据库
show databases;

# 列出库中所有的表
use database; show tables;
show tables from database_name;

# 列出库中所有以 wp_ 开头的表
show tables from database_name like 'wp_%';
show tables in database_name like 'wp_%';

# 查看表中列的定义（表的属性，属性类型，主键信息，默认值等）
show columns from database_name.table_name;
show full columns from database_name.table_name;

# 查看当前数据库中表的信息
show table status;
show table status like '%name%';

# 查看表索引
show index from tablename;
show keys from tablename;

# 列出当前运行的线程任务
show processlist;
show full processlist;

# 查看警告或者错误日志
show warnings;
show errors;

# 查看 binlog
show master logs;
show master status;
show binlog events in 'mysql-bin.000003';

# 查看存储过程和函数的状态
SHOW { PROCEDURE | FUNCTION } STATUS [ LIKE 'pattern' ]

# 查看存储过程和函数的定义
SHOW CREATE { PROCEDURE | FUNCTION } sp_name
```

**数据库操作：**

创建数据库语法格式：

```sql
CREATE DATABASE [IF NOT EXISTS] <数据库名>
[[DEFAULT] CHARACTER SET <字符集名>]
[[DEFAULT] COLLATE <校对规则名>];
```

字符集（CHARACTER）和校对规则（COLLATION）是两个不同的概念，字符集用来定义 MySQL 存储字符串的方式，校对规则定义了比较字符串的方式。校对规则有 utf8_general_ci, utf8_unicode_ci, utf8_chinese_ci 等，utf8_general_ci 仅能够在字符之间进行逐个比较，所以其比较速度很快，但相对来说比较的正确性较差。

修改数据库全局数据的语法与创建的语法类似（不指定数据库名时操作默认选中的数据库）：

```sql
ALTER DATABASE [数据库名] {
[ DEFAULT ] CHARACTER SET <字符集名> |
[ DEFAULT ] COLLATE <校对规则名>}
```

示例与其他操作：

```sql
# 创建数据库
create database 数据库名;
create database if exists 数据库名;

# 创建数据库时指定字符集和校对规则
CREATE DATABASE IF NOT EXISTS 数据库名
DEFAULT CHARACTER SET utf8
DEFAULT COLLATE utf8_general_ci;

# 修改数据库
ALTER DATABASE 数据库名
DEFAULT CHARACTER SET gb2312
DEFAULT COLLATE gb2312_chinese_ci;

# 查看数据库定义
SHOW CREATE DATABASE 数据库名;

# 重命名数据库
rename database 旧库名 TO 新库名;

# 删除数据库
drop database 数据库名;
drop database if exists 数据库名;

# 选择要操作的数据库
use 数据库名;

# 查看当前选中的数据库
select database();
```

**表操作：**

创建表的语法格式：

```sql
CREATE TABLE table_name (column_name column_type);
```

示例：

```
CREATE TABLE IF NOT EXISTS `test`(
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `name` VARCHAR(100) NOT NULL COMMENT '名字',
   `age` TINYINT NOT NULL COMMENT '年龄',
   `status` TINYINT NOT NULL DEFAULT '0' COMMENT '状态',
   `add_time` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '添加时间',
   `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
   PRIMARY KEY (`id`)
   UNIQUE KEY `idx_name` (`name`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='学生信息表';
```

其他表操作：

```sql
# 查看表结构
desc 表名;
describe 表名;
show columns from 表名;

# 查看表信息
select table_name, table_type, engine, version, table_comment
from information_schema.tables
where table_schema='database_name' and table_name='table_name';

# 查看表字段信息
select table_name, column_name, data_type, is_nullable, column_default, column_comment
from information_schema.columns
where table_schema='database_name' and table_name='table_name';

# 清空表
delete from 表名;       # 自增 id 不会从 1 开始
truncate table 表名;    # 自增 id 会重新从 1 开始

# 删除表
drop table 表名;

# 重命名表
rename table 旧表 TO 新表
          [, 旧表 TO 新表] ...

# 修改表字段属性
alter table 表名 modify 字段名称 字段类型 [是否允许非空] comment '字段注释';

# 改变表字段属性（与 modify 类似，modify 用于微小改动，而 change 主要用于幅度较大的改动）
alter table 表名 change 字段原名称 字段新名称 字段类型 [是否允许非空] comment '字段注释';

# 添加字段
alter table 表名 add 字段名称 字段类型 [是否允许非空] comment '字段注释';

# 删除字段
alter table 表名 drop column 字段名称;

# 优化表（会锁表）
optimize table 表名
```

**复制数据库：**

先创建一个新的数据库：

```
create database newdb;
```

然后使用 mysqldump 命令工具导出 SQL 语句，再导入新的库

```
mysqldump -h 127.0.0.1 -u root olddb | mysql -h 127.0.0.1 -u root newdb
```

**备份数据库：**

一般用 mysqldump 把数据库备份到文件中。示例：

```shell
mysqldump -uroot -h127.0.0.1 -P3306 -p \
    --master-data=2 \
    --single-transaction \
    --routines \
    --triggers \
    --events \
	database [tables] > backup.sql
```

参数说明：

```
--single-transaction
    指定备份是在一个事务中完成，可以支持 innodb 存储引擎热备功能，对 innodb 可以不锁表进行热备，对于非 innodb 热备进行锁表

--triggers
    备份触发器

--routines
    备份存储过程和自定义函数

--events
    备份事件

--master-data
    该选项将 binlog 的位置和文件名追加到输出文件中。如果为 1，将会输出 CHANGE MASTER 命令；如果为 2，输出的 CHANGE  MASTER 命令前添加注释信息。该选项将打开 `--lock-all-tables` 选项，除非 `--single-transaction` 也被指定（在这种情况下，全局读锁在开始导出时获得很短的时间）。该选项自动关闭 `--lock-tables` 选项。
```

**其他操作：**

```sql
# 查看 mysql 版本
status;  # 与 \s; 等价
select version();

# 同时查看当前时间，用户名，数据库版本
select now(), user(), version();

# 查看当前连接的 ID
select connection_id();
```

**binlog：**

`binlog` 即二进制日志，其记录对数据发生或潜在发生更改的 SQL 语句，并以二进制的形式保存在磁盘中。二进制日志可以用来查看数据库的变更历史（具体的时间点所有的 SQL 操作）、数据库增量备份和恢复（增量备份和基于时间点的恢复）、Mysql 的复制（主主数据库的复制、主从数据库的复制）等。

二进制日志有三种格式，**STATEMENT**：基于SQL语句的复制(statement-based replication, SBR)；**ROW**：基于行的复制(row-based replication, RBR)；**MIXED**：混合模式复制(mixed-based replication, MBR)。

二进制日志的相关操作：

```sql
# 查看 binlog 相关配置
show variables like '%log_bin%';

# 查看 binlog 日志文件列表
show master logs;
show binary logs;

# 当前正在使用的 binlog 及当前日志位置
show master status;

# 查看 binlog 内容
show binlog events in 'mysql-bin.000005'

# 删除所有的binglog日志文件
reset master;
```

此外，还可以使用 mysqlbinlog 工具查看 binlog 内容：

> mysqlbinlog --no-defaults log/mysql-bin.000007

## 线程列表

MySQL 可以使用 `show processlist` 来显示用户正在运行的线程，也可以使用 `show full processlist`。没有 full 时，只显示 SQL 表达式的前 100 个字符。需要注意的是，只有 root 用户能看到所有正在运行的线程，其他用户都只能看到自己正在运行的线程，看不到其它用户正在运行的线程。除非这个用户拥有 PROCESS 权限。

实际上 show processlist 显示的信息都是来自系统库 `information_schema` 中的 `processlist` 表。所以使用下面的查询语句可以获得相同的结果：

```sql
select * from information_schema.processlist
```

输出结果中各列的含义：

- **Id:** 连接标识符，客户端连接 mysql 时系统分配的 ID，可通过 CONNECTION_ID() 函数查看。该 ID 记录在 INFORMATION_SCHEMA.PROCESSLIST 表中。该 ID 可用于 kill 语句中，以用于杀死某一查询语句
- **User:** 当前连接的用户
- **Host:** 当前连接的主机，便于确定哪个客户端正在做什么，显示方式为 host_name:client_port 的形式
- **db:** 当前执行语句对应的默认数据库，如果选择了；否则为 NULL
- **Command:** 显示这个线程此刻正在执行的命令，如休眠（sleep），查询（query），连接（connect）等
- **Time:** 表示线程处于当前状态的时间长短，单位为秒
- **State:** 显示使用当前连接的 SQL 语句的状态，其描述的是语句执行中的某一个状态。一个 SQL 语句，以查询为例，可能需要经过 COPYING to tmp table、sorting result、sending data 等状态才可以完成
- **Info:** 包含由线程执行的语句的文本，如果连接没有执行任务语句则为 NULL。默认情况下，该列仅包含语句的前 100 个字符，要查看完整的语句，需使用 SHOW FULL PROCESSLIST

线程可以具有以下任何 Command 值（详细内容可见 [Thread Command Values](https://dev.mysql.com/doc/refman/8.0/en/thread-commands.html)）：

- **Binlog Dump：** 这是主服务器上的线程，用于将二进制日志内容发送到从服务器
- **Table Dump：** 线程将表内容发送到从服务器
- **Change user：** 线程正在执行改变用户操作
- **Close stmt：** 线程正在关闭准备好的语句
- **Connect：** 复制中，从服务器连接到其主服务器
- **Connect Out：** 复制中，从服务器正在连接到其主服务器
- **Create DB：** 线程正在执行 create-database 操作
- **Daemon：** 此线程在服务器内部，而不是服务客户端连接的线程
- **Debug：** 线程正在生成调试信息
- **Delayed insert：** 线程是一个延迟插入处理程序
- **Drop DB：** 线程正在执行 drop-database 操作
- **Execute：** 线程正在执行一个准备好的语句
- **Fetch：** 线程正在执行一个准备语句的结果
- **Field List：** 线程正在检索表列的信息
- **Init DB：** 线程正在选择默认数据库
- **Kill：** 线程正在杀死另一个线程
- **Long Data：** 该线程在执行一个准备语句的结果中检索长数据
- **Ping：** 线程正在处理服务器 ping 请求
- **Prepare：** 线程正在为语句生成执行计划
- **Processlist：** 线程正在生成有关服务器线程的信息
- **Query：** 该线程正在执行一个语句
- **Quit：** 线程正在终止
- **Refresh：** 线程是刷新表，日志或缓存，或重置状态变量或复制服务器信息
- **Register Slave：** 线程正在注册从服务器
- **Reset stmt：** 线程正在重置一个准备好的语句
- **Set option：** 线程正在设置或重置客户端语句执行选项
- **Shutdown：** 线程正在关闭服务器
- **Sleep：** 线程正在等待客户端向其发送新的语句
- **Statistics：** 线程正在生成服务器状态信息
- **Time：** 未使用

另外，线程的 State 值说明可以参考 [General Thread States](https://dev.mysql.com/doc/refman/8.0/en/general-thread-states.html).

## 生成测试数据

要生成测试数据可以使用 **存储过程**。存储过程（Stored Procedure）是一组为了完成特定功能的 SQL 语句集通常的 SQL 语句在执行时需要要先编译，而存储过程是经编译后存储在数据库中，通过指定存储过程的名字并给定参数（如果该存储过程带有参数）来调用执行。其语法格式：

```sql
DELIMITER $$
CREATE PROCEDURE procedure_name(parameter_list)
BEGIN
    parameter_body
END $$
DELIMITER ;
```

其中的 `DELIMITER $$` 表示修改定界符。参数列表使用逗号分隔，参数入参数（IN）、输出参数（OUT）和输入/输出参数（INOUT）三种。存储过程的主体以 BEGIN 开始，以 END 结束。存储过程的名称默认在当前数据库中创建，若需要在特定数据库中创建存储过程，则需在名称前面加上数据库的名称，如 test.rand_string。

使用存储过程生成测试数据示例：

```sql
USE `test`;

CREATE TABLE IF NOT EXISTS `t_user` (
	`id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL COMMENT '用户名',
	`euid` VARCHAR(64) NOT NULL COMMENT '有效用户ID（加密ID）',
	`passwd` VARCHAR(64) NOT NULL COMMENT '用户密码',
	`type` TINYINT NOT NULL DEFAULT '0' COMMENT '用户类型',
	`alias` VARCHAR(255) NULL DEFAULT '' COMMENT '用户昵称',
	`email` VARCHAR(64) NULL DEFAULT '' COMMENT '用户邮箱',
	`mobile` VARCHAR(16) NULL DEFAULT '' COMMENT '用户手机号',
	`intro` VARCHAR(255) NULL DEFAULT '' COMMENT '用户简介',
	`login_count` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '登录次数',
	`status` TINYINT NOT NULL DEFAULT '0' COMMENT '状态',
	`add_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
	`update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	KEY `idx_name` (`name`),
	UNIQUE KEY `idx_euid` (`euid`)
) ENGINE = INNODB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8 COMMENT = '用户信息表';

DELIMITER $$

CREATE PROCEDURE insert_test_data(IN num INT)
BEGIN
 	DECLARE i INT DEFAULT 0;

	WHILE i < num DO
		INSERT INTO `t_user` (`name`, `euid`, `passwd`, `type`, `status`) VALUES (
			lower(conv(floor(rand() * pow(2, 32)), 10, 36)),
			md5(uuid()),
			md5(rand()),
			floor(rand() * 7),
			floor(rand() * 4)
		);
		SET i = i + 1;
	END WHILE;
END$$

DELIMITER ;

CALL insert_test_data(1000000);
DROP PROCEDURE insert_test_data;
```

也可以通过一些 Web 工具生成测试数据，如：[http://www.generatedata.com](http://www.generatedata.com)

## 命令行客户端

MySQL 提供了命令行客户端 `mysql` 命令也操作数据库，其常用参数如下：

```
-h, --host=name               指定数据库主机地址
-P, --port=#                  指定数据库端口
-u, --user=name               数据库用户名
-p, --password[=name]         数据库密码
-D, --database=name           指定数据库
-A, --no-auto-rehash          不预读数据库信息
-B, --batch                   不使用历史文件，禁用交互（即不支持自动补全）
--default-character-set=name  设置数据库的默认字符集
--column-type-info            结果集返回时，同时显示字段的类型等相关信息
-C, --compress                在客户端和服务器端传递信息时使用压缩
-e, --execute=name            直接执行 SQL 语句
-N, --skip-column-names       不显示列信息
--prompt=format_str           指定提示符，默认为 mysql>
```

## 实用脚本

```shell
#! /bin/bash

# Filename: _mysql.sh 2015-09-21
# Author: Huoty <sudohuoty@gmail.com>
# Script starts from here:

__mysql() {
    mysql -h localhost -u root --database test --password=123456
}

if [ "$*" != '' ] ; then
    echo "$*" | __mysql
else
    __mysql
fi
```

用该脚本可以直接在命令行执行 mysql 命令和 sql 语句，而不用进入 mysql 的交互式解释器。例如：

```
$ _mysql.sh "show tables"

$ _mysql.sh "select * from users"
```
