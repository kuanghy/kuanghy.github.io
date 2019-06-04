---
layout: post
title: MySQL 数据库基本使用指南
keywords: mysql 数据库 mysqld mysqld_safe
description: "MySQL 是一个非常流行的小型关系型数据库管理系统"
category: 数据库
tags: mysql 数据库
---

MySQL 是一个非常流行的小型关系型数据库管理系统。在数据库的管理上，通常会使用一些客户端工具，如果 phpMyAdmin，navicat preminu，HeidiSQL， Sequal Pro，SQLyog，MySQL Workbench 等等。但有时候可能会无可避免的要用到命令行下的操作，本文旨在记录一些 MySQL 的基本使用方法，以及配置等。

## 安装与启动

如果是在 Ubuntu 系统中，使用 apt 工具安装完 MySQL 时会提示设置用户名和密码，如何没有设置，可以采用如下方式**创建密码**：

> mysqladmin -u root password "new_password"

使用包管理工具安装的 mysql 一般都会创建系统服务，以便于管理：

```
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

```
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

- 用 mysqladmin 命令来改root用户口令

```
bin/mysqladmin --defaults-file=my.cnf -h 127.0.0.1 -u root password 'new-password'
```

- 用 set password 命令来修改密码：

```
mysql> set password for root@localhost=password('new-password');
```

- 直接修改 user 表的 root 用户口令：

```
mysql> use mysql;
mysql> update user set password=password('new-password') where user='root';
mysql> flush privileges;
```

MySQL8 之后使用如下方式修改 root 密码：

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'new-password';
```

如果忘记了 root 密码，使用 --skip-grant-tables 参数以跳过密码认证方式启动服务器，再修改密码：

```
bin/mysqld --defaults-file=my.cnf --skip-grant-tables &
```

删除默认的数据库和用户，避免应存在漏洞而被注入攻击（test 库在 5.7 版本后默认没删除了）：

```
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
datadir=basedir="/home/huoty/.local/mysql/data"
```

set sql_safe_updates=1;

## 权限管理

**创建用户**

```
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
```

- username：需要创建的用户名
- host：指定用户在哪个主机上可以登录，本地用户可用 localhost，允许从任意远程主机登录则使用通配符 %
- password：用户的登录密码，密码可以为空，如果为空则该用户可以不需要密码登录服务器

示例：

```
CREATE USER 'user'@'localhost' IDENTIFIED BY '123456';
CREATE USER 'user'@'192.168.1.101' IDENDIFIED BY '123456';
CREATE USER 'user'@'%' IDENTIFIED BY '123456';
CREATE USER 'user'@'%' IDENTIFIED BY '';
CREATE USER 'user'@'%';
```

如果需要删除用户，使用 DROP USER 命令：

```
DROP USER 'username'@'host';
```

**用户密码设置**

```
SET PASSWORD FOR 'username'@'host' = PASSWORD('new-password');
```

示例：

```
SET PASSWORD FOR 'server'@'%' = PASSWORD("12345678");
```

如果是当前登录用户，可修改自己的密码：

```
SET PASSWORD = PASSWORD("new-password");
```

**授权用户**

```
GRANT privileges ON databasename.tablename TO 'username'@'host' [WITH GRANT OPTION]
```

- privileges：指定允许用户操作的权限，如 SELECT，INSERT，UPDATE 等，ALL 表示授予所权限
- databasename：数据库名
- tablename：表名，如果要授予该用户对所有数据库或表的相应操作权限则可用 * 表示，如 `*.*`
- [with grant option]：表示该用户可将拥有的权限授予给其他用户（即权限传递）

示例：

```
GRANT SELECT, INSERT, UPDATE, CREATE ON *.* TO 'server'@'%';
GRANT ALL ON *.* TO 'admin'@'%';
GRANT SECECT ON test.* TO 'reader'@'%';
GRANT SELECT, UPDATE ON test.* TO 'user1'@'%';
```

撤销授权：

```
REVOKE privilege ON databasename.tablename FROM 'username'@'host';
```

其中的 privilege, databasename, tablename 需与授权是相同才能生效。示例：

```
REVOKE SECECT ON test.* FROM 'reader'@'%';
```

权限查看：

```
SHOW GRANTS [FOR 'username'@'host'];

# 或者

SELECT * FROM mysql.user WHERE user='username' AND host='host' \G;
```

命令 `show grants;` 默认查看当前用户权限。

## 基本操作

**SHOW 语句使用：**

```
# 查看所有支持的存储引擎  
show engines;

# 系统特定资源的信息，如正在运行的线程数量
show status;

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

show tables from mysql like 'time%';
show tables in mysql like 'time%';

# 查看表中列的定义（表的属性，属性类型，主键信息，默认值等）
show columns from database_name.table_name;
show full columns from database_name.table_name;

# 查看当前数据库中表的信息
show table status;
show table status like 'tbl%';

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

**数据库和表操作：**

```
# 创建数据库
create databases 数据库名;

# 删除数据库
drop database 数据库名;

# 查看表结构
desc 表名;
show columns from 表名;
describe 表名;

# 清空表
delete from 表名;
truncate table 表名;

# 删除表
drop table 表名;

# 修改表字段属性
alter table 表名 modify 字段名称 字段类型 [是否允许非空] comment '字段注释';

# 改变表字段名称
alter table 表名 change 字段原名称 字段新名称 字段类型 [是否允许非空] comment '字段注释';

# 添加字段
alter table 表名 add 字段名称 字段类型 [是否允许非空] comment '字段注释';

# 删除字段：
alter table 表名 drop column 字段名称;
```

**binlog：**

`binlog` 即二进制日志，其记录对数据发生或潜在发生更改的 SQL 语句，并以二进制的形式保存在磁盘中。二进制日志可以用来查看数据库的变更历史（具体的时间点所有的 SQL 操作）、数据库增量备份和恢复（增量备份和基于时间点的恢复）、Mysql 的复制（主主数据库的复制、主从数据库的复制）等。

二进制日志有三种格式，**STATEMENT**：基于SQL语句的复制(statement-based replication, SBR)；**ROW**：基于行的复制(row-based replication, RBR)；**MIXED**：混合模式复制(mixed-based replication, MBR)。

二进制日志的相关操作：

```
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

## 生成测试数据

要生成测试数据可以使用 **存储过程**。存储过程（Stored Procedure）是一组为了完成特定功能的 SQL 语句集。通常的 SQL 语句在执行时需要要先编译，而存储过程是经编译后存储在数据库中，通过指定存储过程的名字并给定参数（如果该存储过程带有参数）来调用执行。其语法格式：

```
DELIMITER $$
CREATE PROCEDURE procedure_name(parameter_list)  
BEGIN
    parameter_body
END $$
DELIMITER ;
```

其中的 `DELIMITER $$` 表示修改定界符。参数列表使用逗号分隔，参数入参数（IN）、输出参数（OUT）和输入/输出参数（INOUT）三种。存储过程的主体以 BEGIN 开始，以 END 结束。存储过程的名称默认在当前数据库中创建，若需要在特定数据库中创建存储过程，则需在名称前面加上数据库的名称，如 test.rand_string。

使用存储过程生成测试数据示例：

```
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
