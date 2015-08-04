---
layout: post
title: Ubuntu下简单配置Apache虚拟主机的方法
category: linux
tags: ubuntu apache 虚拟主机
---

在Linux下开发Web程序，例如编写html、php等程序时，默认要到/var/www目录下才能工作，而 /var/www 目录必须要有超级用户权限才能访问，还得改这个目录的权限。有的人可能会想到把项目工程目录放到主目录下，然后在 /var/www 目录下做一个软链接。这也不失为一个方法，起码可以在属于当前用户自己的目录下工作。但是，我们在浏览器中对网站进行访问调试的时候需要输入工程目录名。例如：`http:localhost/mysite/`，这样才能访问，如何项目工程名很长很难记的话，是不是感觉很麻烦呢。

其实我们还有一种方法将站点配置到属于自己的工作目录中，那就是配置虚拟主机。通过配置不同的端口号来访问不同的站点目录。例如将一个端口号为 8888 的虚拟主机的根目录配置为自己的工程开发目录 `/home/huoty/mysite`，那么就可以通过端口号直接访问正在开发的目录。

我的apache版本为：Server version: Apache/2.4.7 (Ubuntu)。

**【 1 】** 打开`/etc/apache2/ports.conf`文件添加一个端口，例如添加 8888 端口，则在该文件中添加 Listen 8080

> $ sudo vi /etc/apache2/ports.conf

如下所示：
<div class="hblock"><pre>
# If you just change the port or add more ports here, you will likely also
# have to change the VirtualHost statement in
# /etc/apache2/sites-enabled/000-default.conf

Listen 80
Listen 8888

&lt;IfModule ssl_module&gt;
    Listen 443 
&lt;/IfModule&gt;

&lt;IfModule mod_gnutls.c&gt;
    Listen 443 
&lt;/IfModule&gt;

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
</pre></div>

**【 2 】** 复制/etc/apache2/sites-available目录下的000-default.conf文件： 

> $ sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/mysite.conf 

然后将VirtualHost *:80改为VirtualHost *:8080
将DocumentRoot /var/www/html 改为自己的目录，例如：DocumentRoot /home/huoty/mysite

**【 3 】** 将mysite.conf 软链到sites-enabled：

> $ sudo ln -s /etc/apache2/sites-available/mysite.conf /etc/apache2/sites-enabled/mysite.conf

放在 sites-enabled 目录下的配置文件才是真正有效的配置文件，通常情况下我们会在 sites-available 目录下存放配置好的配置文件，然后将需要启动的站点的配置文件软链接到 sites-enabled 目录下。这样方便我们取消和重设站点。 

**【 4 】** 重启apache服务

> $ sudo service apache2 restart

**【 5 】** 在 /home/huoty/mysite/ 目录下建立一个测试页面index.html，在浏览器中打开：http://localhost:8080/ 如果显示正常，则配置结束。

**【 6 】** 如果页面无法正常显示，并提示 403  Forbidden 错误：You don't have permission to access / on this server.
解决办法： 打开/etc/apache2/apache2.conf文件，添加一下内容：
<div class="hblock"><pre>
&lt;Directory /home/konghy/www&gt;
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
&lt;/Directory&gt;
</pre></div>

**【 7 】** 为了保证 apache 由权限访问你所配置的目录，可以将 apache 用户添加到自己的用户组中，apache 的默认用户名为 www-data，修改方法为：

> $ sudo usermod -a -G huoty www-data 

huoty为当前用户的用户组。

**【 最后 】**对第 6 步的配置做一下说明。在apache中，对目录的访问是由两方面来结合起来共同控制的，一方面是apache本身，另一方面是Linux系统本身。如下图所示：

![apache](http://ww3.sinaimg.cn/mw690/c3c88275jw1euptdkg7g1j20eu0cuab3.jpg)

也就是说即使指定用户对系统中的文件有访问权限，而 apache 本身对齐没有访问权限，用户也无法正常访问文件。Apache 使用&lt;Directory&gt;… &lt;/Directory&gt;来设置指定目录的访问权限，其中可包含五个属性：
<div class="hblock"><pre>
Options
AllowOverride
Order
Allow 
Deny
</pre></div>

**Options**可以组合设置下列选项：
<div class="hblock"><pre>
All：用户可以在此目录中作任何事情。
ExecCGI：允许在此目录中执行CGI程序。
FollowSymLinks：服务器可使用符号链接指向的文件或目录。
Indexes：服务器可生成此目录的文件列表。
None：不允许访问此目录。
</pre></div>

**AllowOverride** 会根据设定的值决定是否读取目录中的.htaccess文件，来改变原来所设置的权限:
<div class="hblock"><pre>
All：读取.htaccess文件的内容，修改原来的访问权限。
None：不读取.htaccess文件
</pre></div>

为避免用户自行建立.htaccess文件修改访问权限，apache2.conf文件中默认设置每个目录为： AllowOverride None。

**Allow** 用于设定允许访问Apache服务器的主机，例如：
<div class="hblock"><pre>
Allow from all  # 允许所有主机的访问
Allow from 202.96.0.97 202.96.0.98  # 允许来自指定IP地址主机的访问
</pre></div>

**Deny** 用于设定拒绝访问Apache服务器的主机，例如：
<div class="hblock"><pre>
Deny from all  # 拒绝来自所有主机的访问 
Deny from 202.96.0.99 202.96.0.88 # 拒绝指定IP地址主机的访问
</pre></div>

**Order** 用于指定allow和deny的先后次序：Order allow,deny 