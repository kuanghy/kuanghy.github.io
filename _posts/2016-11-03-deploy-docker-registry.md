---
layout: post
title: "部署 Docker Registry 私有镜像仓库"
keywords: "Docker Registry"
description: "Docker 官方提供一个 registry 镜像来让需要的人自己搭建私有仓库"
category: 容器技术
tags: docker registry
---

Docker 官方提供一个 `registry` 镜像来让需要的人自己搭建私有仓库。因此部署仓库的服务器需要有 Docker 环境。

## 简单部署

简单部署如下：

> docker run -d -p 8855:5000 --name registry -v /home/server/registry/:/var/lib/registry registry

这默认是一个 http 的接口，但是 docker 客户端在 push 镜像时，默认会使用 https。为了避免搭建 https 时部署签名证书的麻烦，这里只介绍 http 接口的部署。那么，客户端要向服务器 push 镜像则需要做一些设置，编辑 `/etc/default/docker` 或者 `/etc/sysconfig/docker` 文件（不同 Linux 发行版可能会是不同的文件），写入如下配置项（注意修改对应的域名和端口）：

```
DOCKER_OPTS="--insecure-registry myregistrydomain.com:8855"
```

## 身份认证

为了相对安全，可以给仓库加上基本的身份认证。使用 [htpasswd](https://httpd.apache.org/docs/current/programs/htpasswd.html) 创建用户：

> htpasswd -Bbn testuser testpassword > auth/htpasswd

如果当前系统没有 htpasswd 命令，可以使用如下方式创建用户：

> docker run --entrypoint htpasswd registry:2 -Bbn testuser testpassword > auth/htpasswd

然后再用如下方式运行容器：

```
docker run -d -p 8855:5000 --restart=always --name registry \
  -v `pwd`/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  registry
```

## 使用 Docker Compose

Docker 官方提供了一个用于定义和运行复杂 Docker 应用的工具 [docker-compose](https://docs.docker.com/compose/)，该工具通过配置文件来管理容器。下载安装：[https://github.com/docker/compose/releases](https://github.com/docker/compose/releases).

在未指定配置文件时，`docker-compose` 默认使用当前目录下的 `docker-compose.yml` 配置文件。配置文件示例：

```
registry:
  restart: always
  image: registry:latest
  ports:
    - 8855:5000
  environment:
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
  volumes:
    - ./registry:/var/lib/registry
    - ./auth:/auth
```

执行如下命令即可运行容器：

> docker-compose up
>
> docker-compose up -d  # 后台运行

**Compose 常用命令：**

选项参数：

- **-f** 一个非 docker-compose.yml 命名的yaml文件
- **-p** 设置一个项目名称（默认是directory名）

子命令：

- **build：** 构建服务
- **kill：** 给服务发送特定的信号，`kill -s SIGINT`。
- **logs：** 输出日志
- **port：** 输出绑定的端口
- **ps：** 输出运行的容器
- **pull：** pull 服务的 image
- **rm：** 删除停止的容器
- **run** 运行某个服务，例如 `docker-compose run web python manage.py shell`
- **start：** 运行某个服务中存在的容器。
- **stop:** 停止某个服务中存在的容器。
- **up：** `create + run + attach` 容器到服务。
- **scale：** 设置服务运行的容器数量。例如 `docker-compose scale web=2 worker=3`

## 镜像 Push 与 Pull

1、登录仓库：

> docker login myregistrydomain.com:8855

2、Tag 一个镜像：

> docker tag huoty/ubuntu myregistrydomain.com:8855/huayong/ubuntu

3、Push 镜像到仓库：

> docker pull myregistrydomain.com:8855/huayong/ubuntu

4、从仓库中 Pull 一个镜像：

> docker pull myregistrydomain.com:8855/huayong/ubuntu

## Registry API

查看仓库中的镜像：

```
GET /v2/_catalog
```

查看镜像的 tag：

```
GET /v2/huayong/busybox/tags/list
```
