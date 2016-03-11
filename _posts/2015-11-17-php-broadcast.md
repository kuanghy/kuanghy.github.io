---
layout: post
title: "PHP向客户端广播信息"
category: web设计
tags: broadcast socket
---
{% include JB/setup %}

在网络中数据传播分为:Unicast(单播)   ,   Multicast(多播或者组播)  和 Broadcast(广播)。广播和多播仅应用于UDP，它们对需将报文同时传往多个接收者的应用来说十分重要。而 TCP 是一个面向连接的协议，它意味着分别运行于两主机（由IP地址确定）内的两进程（由端口号确定）间存在一条连接。广播地址在默认情况下是不能让路由器转发到别的接口的，广播不能穿越路由器。广播有以下几种形式：

- 受限的广播：

受限的广播地址是255.255.255.255，该地址用于主机配置过程中IP数据报的地址，此时，主机可能还不知道它所在网络的网络掩码，甚至连它的IP地址也不知道。在任何情况下，路由器都不转发目的地址为受限广播地址的数据报，这样的数据报只出现在本地网络中。

- 指向网络的广播：

指向网络的广播地址是主机号全为1的地址，A类网络广播地址为netid.255.255.255，其中netid为A类网络的网络号。

- 指向子网的广播：

指向子网的广播地址是主机号全为1的地址，作为子网直接广播的IP地址需要知道子网的掩码。如果B类网络128.1的子网掩码是255.255.255.0，则地址128.1.2.255就是对应子网的广播地址。

- 指向所有子网的广播：

指向所有子网的广播也需要知道目的网络的子网掩码。这些广播地址的子网号和主机号全为1。如果目的子网掩码是255.255.255.0，那么IP地址128.1.255.255就是一个指向所有子网的广播地址。

PHP socket 也能实现广播。在 socket 通信中，实现连接的服务器与客户端需要绑定同一端口号，端口号表示发送和接收的进程。下面是一个用 PHP 实现的简单的广播通信例子，同时采用 PHP 和 C 语言作为客户端进行测试：

- broadcast.php

{% highlight php %}
<?php  # Script -- broadcast.php

/* Author @ Huoty
 *   Date @ 2015-11-17 09:58:25
 *  Brief @
 */

/* 创建广播事件 */
function broadcast()
{
	$sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
	//使用IPV4格式地址，数据报形式，UDP方式传输数据

	socket_set_option($sock, SOL_SOCKET, SO_BROADCAST, 1); //设置为广播方式

	while ( true ) {
	    $msg = 'Hi! ' . date("y-m-d h:i:s",time());  //要发送的字符串
		socket_sendto($sock, $msg, strlen($msg), 0, "255.255.255.255", 12345);
		//发送，255.255.255.255是广播地址，12345是端口
		//echo "Broadcast...\n";
		sleep( 2 );
	}

	socket_close($sock); //关闭
}

/* 创建守护进程 */
$pid = pcntl_fork();
if ($pid < 0)
{
    die("fork failed!\n");
}
else if ($pid > 0)
{
    exit;
}
else
{
		/* 输出进程ID，便于 kill */
    echo "Daemons ID: " . posix_getpid() . "\n";

		/* 保持程序的运行 */
		set_time_limit(0);

		/* 创建一个新的 Session */
    $sid = posix_setsid();
    if ($sid < 0)
    {
        exit;
    }

		/* 改变工作目录为根目录 */
    chdir("/");

    broadcast();
}

?>
{% endhighlight %}

- client.php

{% highlight php %}
<?php # Script -- client.php

/* Author @ Huoty
 *   Date @ 2015-11-17 09:58:25
 *  Brief @ 
 */

//error_reporting( E_ALL );
set_time_limit( 0 );
ob_implicit_flush();

$socket = socket_create( AF_INET, SOCK_DGRAM, SOL_UDP );
if ( $socket === false ) {
    echo "socket_create() failed:reason:" . socket_strerror( socket_last_error() ) . "\n";
}

$ok = socket_bind( $socket, '255.255.255.255', 12345 );
if ( $ok === false ) {
    echo "socket_bind() failed:reason:" . socket_strerror( socket_last_error( $socket ) );
}

while ( true ) {
    $from = "";
    $port = 0;
    socket_recvfrom( $socket, $buf, 1024, 0, $from, $port );
    echo $buf . "\n";
    usleep( 1000 );
}
?>
{% endhighlight %}

- client.c

{% highlight c %}
/* client.c */
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <netinet/in.h>

#define MAXLINE 80
#define SERV_PORT 12345

int main(int argc, char *argv[])
{
    struct sockaddr_in servaddr;
    int sockfd, n;
    char buf[MAXLINE];
    char str[INET_ADDRSTRLEN];
    socklen_t servaddr_len;

    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port = htons(SERV_PORT);

    bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    fprintf(stdout, "Accepting connections ...\n");

    memset(buf, 0, sizeof(buf));
    while ( 1 ) {
        n = recvfrom(sockfd, buf, MAXLINE, 0, NULL, 0);
        if (n == -1)
            fprintf(stderr, "recvfrom error");

        fprintf(stdout, "%s\n", buf);
        memset(buf, 0, sizeof(buf));
    }

    close(sockfd);
    return 0;
}
{% endhighlight %}

通常，广播是需要长时间进行的任务，所以可以创建一个守护进程来完成广播，以避免程序长时间运行对控制终端的占用。如果不使用守护进程，也可以用 Linux 的 `nohup` 命令来实现。然而，PHP 的进程控制不能被应用在 Web 服务器环境。那么，要让 PHP 的进程控制在 Web 环境下得到应用，可以用一个迂回的办法，即用 `cli` 的方式执行包含进程控制的 PHP 文件，所谓 cli 方式是指 shell 的执行方式。还有一个需要注意的问题是，在 Web 环境下，由于 PHP 程序是一个死循环，程序一直运行，所以客户端总是得不到服务器的返回结果。为解决这个问题，可以将用 `&` 让程序在后台运行，同时将输出重定向到 `/dev/null`。于是可以创建了一个新文件以保证广播在 Web 服务器环境下能够被触发：

- startup.php

{% highlight php %}
<?php  # Script -- startup.php

/* Author @ Huoty
 *   Date @ 2015-12-02 16:53:43
 *  Brief @ 
 */

exec("php ./broadcast_daemons.php >/dev/null &");
echo "Finished!";

?>
{% endhighlight %}