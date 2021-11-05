---
layout: post
title: "Linux 终端、作业控制、守护进程"
keywords: 终端 控制台 伪终端 tty 作业 守护进程 后台进程 前台进程
category: Linux
tags: linux
---

## 终端(TTY)

一般意义上的终端（Terminal）是指人机交互的设备，也就是可以接受用户输入的并输出信息给用户的设备。在计算机刚出现时，终端是电传打字机（Teletype/Teletypewriter，即 TTY）和打印机，也即所谓的 **物理终端**。

提到终端就不得不提到 **控制台（Console)**。控制台的概念与终端含义极其相近，现今经常用它们表示相同的东西。但在计算机发展的早期，却是不同的东西。一些数控设备(比如数控机床)的控制箱，通常会被称为控制台。所以，最初的控制台就是一个直接控制设备的面板，上面有很多控制按钮。在计算机里，把那套直接连接在电脑上的键盘和显示器就叫做控制台。而终端是通过串口连接上的，不是计算机自身的设备，而控制台是计算机本身就有的设备。一个计算机只有一个控制台，但可以连接很多的终端。计算机启动的时候，所有的信息都会显示到控制台上，而不会显示到终端上。也就是说，控制台是计算机的基本设备，而终端是附加设备。计算机操作系统中，与终端不相关的信息，比如内核消息，后台服务消息，都可以显示到控制台上，但不会显示到终端上。控制台一般由系统管理员使用，用于管理整个计算机，而普通用户则通过终端连接到计算机进行使用。

现在终端和控制台都由硬件概念，逐渐演化成了软件的概念。在现在的操作系统中，可以这样来理解控制台与终端：能直接显示系统消息的那个终端称为控制台，其他的则称为终端（控制台也是一个终端）。实际上，现在在使用 Linux 操作系统时，已经不区分控制台与终端了。因为控制台 (Console) 与终端 (Terminal) 的概念渐渐的模糊起来。在现代，键盘与显示器既可以认为是控制台，也可以认为是普通的终端。因为用户一般都对系统有很大的控制权，即可以作为普通用户，也可以作为系统管理员。所以现在的 Console 与 Terminal 含义基本一致。

最初的终端是一种文本终端 (Text Terminal)，即 **字符终端 (Character Terminal)**，只能接收和显示文本信息的终端。后来又发展出了 **图形终端（Graphical Terminal）**，其不但可以接收和显示文本信息，也可以显示图形与图像。随着 GUI 的输出，使用传统意义上的终端的人也越来越少，逐渐被全功能显示器所取代。但 Linux 仍然保留了字符终端（实际上已经是图形终端了，只是在习惯上仍然较字符终端），通过快捷键 **Ctrl+ALT+F1~F6** 可以进入到六个不同的字符终端。

真正意思上的硬件终端已经消失，那么现代的操作系统是怎么与那些传统的、不兼容图形接口的命令行程序（如 GNU 工具集命令）交互的呢？因为这些程序无法直接读取键盘输入，也无法直接把结果输出到显示器上。所以现代的操作系统通过一个程序来模拟传统的终端行为，这个程序即 **终端仿真器（Terminal Emulator）**，通常也叫做终端模拟器。对于命令行程序，终端模拟器会伪装成一个传统终端设备；而对于现代的图形接口，终端模拟器会伪装成一个 GUI 程序。

一个终端模拟器的标准工作流程是这样的：

- 捕获用户的键盘输入
- 将输入发送给命令行程序（程序会认为这是从一个真正的终端设备输入的）
- 拿到命令行程序的输出结果（STDOUT 以及 STDERR）
- 调用图形接口（比如 X11），将输出结果渲染至显示器

目前，操作系统用户所使用的所谓终端，都是模拟终端。如 GNU/Linux 中的 gnome-terminal、Konsole；MacOSX 中的 Terminal.app、iTerm2；Windows 中的 Win32 控制台、ConEmu 等等。上面提到的，在 Linux 中可以 Ctrl+ALT+F1~F6 切换六个终端，其实这也不是传统意义上的终端了，它们也是终端模拟器的一种。这些全屏的终端界面与运行在 GUI 下的终端模拟器的唯一区别就是它们是由操作系统内核直接提供的。这些由内核直接提供的终端界面被叫做 **虚拟控制台 (Virtual Console)**，而运行在图形界面上的终端模拟器则被叫做 **终端窗口 (Terminal Window)**。

拥有控制终端的进程都可以通过一个特殊的设备文件 `/dev/tty` 访问它的控制终端，进程认为 /dev/tty 就是它的控制终端。但事实上每个终端设备都对应一个不同的设备文件，/dev/tty 只是提供了一个通用的接口，一个进程要访问它的控制终端既可以通过 /dev/tty 也可以通过该终端设备所对应的设备文件来访问。可以用 `tty` 命令来查看当前控制终端实际指向的设备文件。也可以通过 ttyname 系统函数由文件描述符查出对应的文件名，该文件描述符必须指向一个终端设备而不能是任意文件。如：

```cpp
#include <unistd.h>
#include <stdio.h>

int main()
{
    printf("fd 0: %s\n", ttyname(0));
    printf("fd 1: %s\n", ttyname(1));
    printf("fd 2: %s\n", ttyname(2));
    return 0;
}
```

在图形终端窗口下运行，结果如：

```
fd 0: /dev/pts/0
fd 1: /dev/pts/0
fd 2: /dev/pts/0
```

在开一个终端窗口运行，结果则如：

```
fd 0: /dev/pts/1
fd 1: /dev/pts/1
fd 2: /dev/pts/1
```

切换到字符终端 Ctrl-Alt-F1 运行，结果如：

```
fd 0: /dev/tty1
fd 1: /dev/tty1
fd 2: /dev/tty1
```

每个不同的字符终端都对一个不同的设备文件，分别是 /dev/tty1~/dev/tty6。设备文件 `/dev/tty0` 表示当前虚拟终端，比如切换到 Ctrl-Alt-F1 的字符终端时 /dev/tty0 就表示 /dev/tty1，切换到 Ctrl-Alt-F2 的字符终端时 /dev/tty0 就表示 /dev/tty2，就像 /dev/tty 一样也是一个通用的接口，但它不能表示图形终端窗口所对应的终端。

程序执行时会自动打开三个文件：标准输入、标准输出 和 标准错误输出，其文件描述符分别为 0, 1, 2。默认情况下（没有重定向），每个进程的标准输入、标准输出和标准错误都指向控制终端，进程从标准输入读也就是读用户的键盘输入，进程往标准输出或标准错误输出写也就是输出到显示器上。在控制终端输入一些特殊的控制键可以给（前台）进程发送信号，如 `Ctrl+C` 表示 SIGINT，`Ctrl+\` 表示 SIGQUIT。

用 tty 查看当前的终端设备文件，并用 lsof 查看该设备被那些进程打开：

```
$ tty
/dev/pts/0
$ lsof /dev/pts/0
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
zsh     22773 huoty    0u   CHR  136,0      0t0    3 /dev/pts/0
zsh     22773 huoty    1u   CHR  136,0      0t0    3 /dev/pts/0
zsh     22773 huoty    2u   CHR  136,0      0t0    3 /dev/pts/0
zsh     22773 huoty   10u   CHR  136,0      0t0    3 /dev/pts/0
lsof    23297 huoty    0u   CHR  136,0      0t0    3 /dev/pts/0
lsof    23297 huoty    1u   CHR  136,0      0t0    3 /dev/pts/0
lsof    23297 huoty    2u   CHR  136,0      0t0    3 /dev/pts/0
```

运行 tty 与 lsof 命令时，其与控制终端的交互流程：

```
                   +--------------------------+    R/W     +------+
Input  ----------->|                          |<---------->| bash |
                   |          pts/0           |            +------+
Output <-----------|                          |<---------->| lsof |
                   | Foreground process group |    R/W     +------+
                   +--------------------------+
```

程序执行时会自动打开三个文件：标准输入、标准输出 和 标准错误输出，其文件描述符分别为 0, 1, 2。默认情况下（没有重定向），每个进程的标准输入、标准输出和标准错误都指向控制终端，进程从标准输入读也就是读用户的键盘输入，进程往标准输出或标准错误输出写也就是输出到显示器上。在控制终端输入一些特殊的控制键可以给（前台）进程发送信号，如 `Ctrl+C` 表示 SIGINT，`Ctrl+\` 表示 SIGQUIT。

```
$ tty
/dev/pts/0
$ lsof /dev/pts/0
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
zsh     22773 huoty    0u   CHR  136,0      0t0    3 /dev/pts/0
zsh     22773 huoty    1u   CHR  136,0      0t0    3 /dev/pts/0
zsh     22773 huoty    2u   CHR  136,0      0t0    3 /dev/pts/0
zsh     22773 huoty   10u   CHR  136,0      0t0    3 /dev/pts/0
lsof    23297 huoty    0u   CHR  136,0      0t0    3 /dev/pts/0
lsof    23297 huoty    1u   CHR  136,0      0t0    3 /dev/pts/0
lsof    23297 huoty    2u   CHR  136,0      0t0    3 /dev/pts/0
```

虚拟终端的数目是有限的，虚拟终端一般就是 /dev/tty1~/dev/tty6 六个。然而网络终端或图形终端窗口的数目却是不受限制的，这是通过 **伪终端（Pseudo TTY）** 实现的。**一套伪终端由一个主设备（PTY Master）和一个从设备（PTY Slave）组成**。主设备在概念上相当于键盘和显示器，只不过它不是真正的硬件而是一个内核模块，操作它的也不是用户而是另外一个进程。从设备和 /dev/tty1 这样的终端设备模块类似，只不过它的底层驱动程序不是访问硬件而是访问主设备。

特殊设备 `/dev/ptmx` 用于创建一对 master、slave 伪终端设备的文件。当一个进程打开它时，获得了一个 master 的文件描述符（file descriptor），同时在 /dev/pts 下创建了一个 slave 设备文件（如 /dev/pts/0, /dev/pts/1）。master 端是更接近用户显示器、键盘的一端，slave 端是在虚拟终端上运行的 CLI（Command Line Interface，命令行接口）程序。Linux 的伪终端驱动程序，会把 **master端（如键盘）写入的数据** 转发给 slave 端供程序输入，把 **程序写入 slave 端的数据** 转发给 master 端供（显示器驱动等）读取。如 ssh 远程登录的数据传输流程：

```
+----------+       +------------+
| Keyboard |------>|            |
+----------+       |  Terminal  |
| Monitor  |<------|            |
+----------+       +------------+
                         |
                         |  ssh protocol
                         |
                         ↓
                   +------------+
                   |            |
                   | ssh server |--------------------------+
                   |            |           fork           |
                   +------------+                          |
                       |   ↑                               |
                       |   |                               |
                 write |   | read                          |
                       |   |                               |
                 +-----|---|-------------------+           |
                 |     |   |                   |           ↓
                 |     ↓   |      +-------+    |       +-------+
                 |   +--------+   | pts/0 |<---------->| shell |
                 |   |        |   +-------+    |       +-------+
                 |   |  ptmx  |<->| pts/1 |<---------->| shell |
                 |   |        |   +-------+    |       +-------+
                 |   +--------+   | pts/2 |<---------->| shell |
                 |                +-------+    |       +-------+
                 |    Kernel                   |
                 +-----------------------------+
```

关于终端和伪终端，可以简单的做如下理解：

- 真正的硬件终端基本上已经看不到了，现在所说的终端、伪终端都是软件仿真终端(即终端模拟软件)
- 一些连接了键盘和显示器的系统中，可以接触到运行在内核态的软件仿真终端(tty1-tty6)
- 通过 GUI 的终端软件窗口或者 SSH 远程登录等使用的都是伪终端

## 作业控制

用户从终端登录系统时，大致会经历如下的过程：

- 如果是字符界面登录，则由 init 进程调用 getty 来处理登录请求；如果是网络登录，如 ssh，则由 sshd 守护进程来处理登录请求
- getty/sshd 进程调用 `setsid` 函数创建一个新的 **Session**，该进程称为 **Session Leader**，该进程的 pid 即为 Session 的 id
- getty 打开终端设备（如 /dev/tty1）作为控制终端；如果是非字符终端登录，则由相应的进程（如 sshd）打开一个伪终端设备，然后再 fork 一次，一分为二：父进程操作伪终端主设备，子进程将伪终端从设备作为控制终端。然后，进程都会将文件描述符 0、1、2 指向打开的控制终端。用了控制终端，进程就可以与用户交互了，接着就提示用户输入账户名
- 输入账户后，进程通过调用 exec 变成 login 进程，然后提示输入密码，如果密码正确，则再调用 exec 变成 shell 进程。用户最终通过 shell 与操作系统交互

Shell 叫进程分为不同的 **作业（Job）** 或者 **进程组（Process Group）** 来进行控制，作业可以在 shell 的前台或者后台运行，这称为 **作业控制（Job Control）**。一个前台作业可以由多个进程组成，一个后台作业也可以由多个进程组成，Shell可以同时运行一个前台作业和任意多个后台作业。如：

```
$ proc1 | proc2 &
$ proc3 | proc4 | proc5
```

其中 proc1 和 proc2 属于同一个后台进程组，proc3、proc4、proc5 属于同一个前台进程组，Shell 进程本身属于一个单独的进程组。这些进程组的控制终端相同，它们属于同一个 Session。**Session（会话）可以看作是一个若干进程组的集合**。当用户在控制终端输入特殊的控制键（例如 Ctrl-C）时，内核会发送相应的信号（例如 SIGINT）给前台进程组的所有进程。

`&` 表示将进程放到后台运行。另外，使用 jbos, bg, fg 等命令可以对作业进行查看和控制。

## 守护进程

通过用户登录创建的进程，在运行结束或用户注销时终止。如通过终端登录创建的进程，在用户注销或网络中断时，通过终端 shell 启动的所有子进程都会受到 SIGHUP 信号，SIGHUP 信号的默认处理动作是退出进程。但系统中有一些服务进程不受用户登录注销的影响，它们一直在运行着，这样的进程被称为 **守护进程（Daemon）**。

试着用 `ps axj` 命令查看系统中的进程：（参数 a 表示不仅列当前用户的进程，也列出所有其他用户的进程，参数 x 表示不仅列有控制终端的进程，也列出所有无控制终端的进程，参数 j 表示列出与作业控制相关的信息）

```
$ ps axj
 PPID   PID  PGID   SID TTY      TPGID STAT   UID   TIME COMMAND
    0     1     1     1 ?           -1 Ss       0   0:12 /sbin/init splash
    0     2     0     0 ?           -1 S        0   0:00 [kthreadd]
    2     3     0     0 ?           -1 I<       0   0:00 [rcu_gp]
    2     4     0     0 ?           -1 I<       0   0:00 [rcu_par_gp]
    2     6     0     0 ?           -1 I<       0   0:00 [kworker/0:0H-events_highpri]
    2     9     0     0 ?           -1 I<       0   0:00 [mm_percpu_wq]
    2    10     0     0 ?           -1 S        0   0:02 [ksoftirqd/0]
...
22771 22773 22773 22773 pts/0    28246 Ss    1000   0:03 -zsh
...
22773 28246 28246 22773 pts/0    28246 R+    1000   0:00 ps axj
```

TPGID 为 -1 的进程都是没有控制终端的进程，也就是守护进程（TPGID 指前台进程组 ID）。在 COMMAND 一列用 **[]** 括起来的名字表示内核线程，这些线程在内核里创建，没有用户空间代码，因此没有程序文件名和命令行，通常采用以 k 开头的名字，表示 Kernel。init 进程第一个用户级进程，其有许多很重要的任务，如启动 getty（用于用户登录）；udevd负责维护 /dev 目录下的设备文件；acpid 负责电源管理；syslogd 负责维护 /var/log 下的日志文件。可以看出，守护进程通常采用以 d 结尾的名字，表示 Daemon。

SIGHUP 信号在用户终端连接（正常或非正常）结束时发出, 通常是在终端的控制进程结束时, 通知同一 Session 内的各个作业。系统对 SIGHUP 信号的默认处理是终止收到该信号的进程。所以要创建一个守护进程，就需要脱离原来的 Session，并且不能有控制终端。

创建守护进程最关键的一步是调用 setsid 函数创建一个新的 Session，并成为 Session Leader。

```cpp
#include <unistd.h>

pid_t setsid(void);
```

该函数调用成功时返回新创建的 Session 的 id（其实也就是当前进程的 id），出错返回 -1。注意，调用这个函数之前，当前进程不允许是进程组的 Leader，否则该函数返回 -1。要保证当前进程不是进程组的 Leader 也很容易，只要先 fork 再调用 setsid 就行了。fork 创建的子进程和父进程在同一个进程组中，进程组的 Leader 必然是该组的第一个进程，所以子进程不可能是该组的第一个进程，在子进程中调用 setsid 就不会有问题了。

成功调用 setsid 函数的结果是：

- 创建一个新的 Session，当前进程成为 Session Leader，当前进程的 id 就是 Session 的 id
- 创建一个新的进程组，当前进程成为进程组的 Leader，当前进程的 id 就是进程组的 id
- 如果当前进程原本有一个控制终端，则它失去这个控制终端，成为一个没有控制终端的进程。所谓失去控制终端是指，原来的控制终端仍然是打开的，仍然可以读写，但只是一个普通的打开文件而不是控制终端了

示例：

```cpp
#include <stdlib.h>
#include <stdio.h>
#include <fcntl.h>

void daemonize(void)
{
	pid_t  pid;

	/*
	 * Become a session leader to lose controlling TTY.
	 */
	if ((pid = fork()) < 0) {
		perror("fork");
		exit(1);
	} else if (pid != 0) /* parent */
		exit(0);
	setsid();

	/*
	 * Change the current working directory to the root.
	 */
	if (chdir("/") < 0) {
		perror("chdir");
		exit(1);
	}

	/*
	 * Attach file descriptors 0, 1, and 2 to /dev/null.
	 */
	close(0);
	open("/dev/null", O_RDWR);
	dup2(0, 1);
	dup2(0, 2);
}

int main(void)
{
	daemonize();
	while(1);
}
```

## 参考资料

- [https://segmentfault.com/a/1190000016129862](https://segmentfault.com/a/1190000016129862)
- [https://segmentfault.com/a/1190000009082089](https://segmentfault.com/a/1190000009082089)
- [https://akaedu.github.io/book/ch34s03.html](https://akaedu.github.io/book/ch34s03.html)
- [https://akaedu.github.io/book/ch34s02.html](https://akaedu.github.io/book/ch34s02.html)
- [https://akaedu.github.io/book/ch34s03.html](https://akaedu.github.io/book/ch34s03.html)
- [https://www.cnblogs.com/zzdyyy/p/7538077.html](https://www.cnblogs.com/zzdyyy/p/7538077.html)
