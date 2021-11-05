---
layout: post
title: "Docker 核心技术 -- Linux Namespace"
keywords: Linux namespace 容器 chroot CGroup 容器技术
description: "Namespace 是 Linux 提供的一种内核级别环境隔离的方法。"
category: 计算机科学
tags: linux namespace docker
---

Docker 在技术上实际并没有什么创新，而是整合了很多现有的技术。Docker 用到的核心技术包括 `Namespace`、`CGroup`、`UnionFS` 等等。

## Namespace 简介

`Namespace` 是 Linux 提供的一种内核级别环境隔离的方法。其提供一种资源隔离方案，使得 PID, IPC ,Network 等系统资源不再是全局性的，而是属于特定的Namespace。每个 Namespace 里面的资源对其他 Namespace 都是透明的。

Unix 系统有一个 chroot 的系统调用，其一种简单的隔离模式，通过修改根目录把进程隔离到特定的目录下执行。Chroot 的文件系统无法访问外部的文件系统。而 Namespace 则比之更强大，不仅能够隔离文件系统，提供了对 UTS、IPC、mount、PID、network、User 等的隔离机制。

## Namespace 分类

- **PID 名字空间:**

不同用户的进程是通过 PID 隔离开的，PID 名字空间使得不同名字空间中可以有相同 PID。

- **Net 名字空间:**

有了 PID 名字空间, 每个名字空间中的 pPIDid 能够相互隔离，但是网络端口还是共享 host 的端口。网络隔离是通过 net 名字空间实现的， 每个 net 名字空间有独立的 网络设备, IP 地址, 路由表, /proc/net 目录。

- **IPC 名字空间:**

不同名字空间的交互采用 Linux 常见的进程间交互方法(interprocess communication - IPC), 包括信号量、消息队列和共享内存等。

- **mount 名字空间:**

类似 chroot，将一个进程放到一个特定的目录执行。mnt 名字空间允许不同名字空间的进程看到的文件结构不同，这样每个名字空间中的进程所看到的文件目录就被隔离开了。同 chroot 不同，每个名字空间中的容器在 /proc/mounts 的信息只包含所在名字空间的 mount point。

- **UTS 名字空间:**

UTS("UNIX Time-sharing System") 名字空间允许每个名字空间拥有独立的 hostname 和 domain name, 使其在网络上可以被视作一个独立的节点而非主机上的一个进程。

- **User 名字空间:**

每个名字空间可以有不同的用户和组 id, 也就是说可以在名字空间内用内部的用户执行程序而非主机上的用户。

## 系统调用

名字空间的创建通过系统调用 `clone` 来实现。其原型为：

```c
#include <sched.h>

int clone(int (*fn)(void *), void *child_stack,
         int flags, void *arg, ...
         /* pid_t *ptid, struct user_desc *tls, pid_t *ctid */ );

/* Prototype for the raw system call */

long clone(unsigned long flags, void *child_stack,
         void *ptid, void *ctid,
         struct pt_regs *regs);
```

使用示例：

```c
#define _GNU_SOURCE
#include <sys/wait.h>
#include <sys/utsname.h>
#include <sched.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define errExit(msg)    do { perror(msg); exit(EXIT_FAILURE); \
                       } while (0)

static int              /* Start function for cloned child */
childFunc(void *arg)
{
   struct utsname uts;

   /* Change hostname in UTS namespace of child */

   if (sethostname(arg, strlen(arg)) == -1)
       errExit("sethostname");

   /* Retrieve and display hostname */

   if (uname(&uts) == -1)
       errExit("uname");

   /* Keep the namespace open for a while, by sleeping.
      This allows some experimentation--for example, another
      process might join the namespace. */

   sleep(200);

   return 0;           /* Child terminates now */
}

#define STACK_SIZE (1024 * 1024)    /* Stack size for cloned child */

int main(int argc, char *argv[])
{
   char *stack;                    /* Start of stack buffer */
   char *stackTop;                 /* End of stack buffer */
   pid_t pid;
   struct utsname uts;

   if (argc < 2) {
       fprintf(stderr, "Usage: %s <child-hostname>\n", argv[0]);
       exit(EXIT_SUCCESS);
   }

   /* Allocate stack for child */

   stack = malloc(STACK_SIZE);
   if (stack == NULL)
       errExit("malloc");
   stackTop = stack + STACK_SIZE;  /* Assume stack grows downward */

   /* Create child that has its own UTS namespace;
      child commences execution in childFunc() */

   pid = clone(childFunc, stackTop, CLONE_NEWUTS | SIGCHLD, argv[1]);
   if (pid == -1)
       errExit("clone");
   printf("clone() returned %ld\n", (long) pid);

   /* Parent falls through to here */

   sleep(1);           /* Give child time to change its hostname */

   /* Display hostname in parent's UTS namespace. This will be
      different from hostname in child's UTS namespace. */

   if (uname(&uts) == -1)
       errExit("uname");
   printf("uts.nodename in parent: %s\n", uts.nodename);

   if (waitpid(pid, NULL, 0) == -1)    /* Wait for child */
       errExit("waitpid");
   printf("child has terminated\n");

   exit(EXIT_SUCCESS);
}
```

另外还有两个与之相关的系统调用 `unshare()` 和 `setns()`：

- **unshare()** – 使某进程脱离某个 namespace
- **setns()** – 把某进程加入到某个 namespace


## 参考资料

- [http://coolshell.cn/articles/17010.html](http://coolshell.cn/articles/17010.html)
- [http://blog.csdn.net/preterhuman_peak/article/details/40857117](http://blog.csdn.net/preterhuman_peak/article/details/40857117)
- [https://yeasy.gitbooks.io/docker_practice/content/underly/namespace.html](https://yeasy.gitbooks.io/docker_practice/content/underly/namespace.html)
