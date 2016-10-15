---
layout: post
title: "Git rebase 与 master 的区别"
keywords: git rebase master
description: "git rebase 与 git merge 的区别在于合并是提交历史处理方式不同"
category: 计算机科学
tags: git rebase master
---

`git rebase` 与 `git merge` 的区别在于，`merge` 会将不同分支的提交合并成一个新的节点，之前的提交分开显示；而 `rebase` 则是将两个分支的提交融合成一个线性的提交。

如下图所示，一个项目在 C2 时基于主分支创建了一个 `experiment` 分支，并做了一个 C3 版本的提交：

![ 最初分叉的提交历史](http://ww4.sinaimg.cn/mw690/c3c88275jw1f2h5vcke78j208m06tjrh.jpg)

如果用 `merge` 命令合并，结果如下图：

![Merge 整合分叉的历史](http://ww3.sinaimg.cn/mw690/c3c88275jw1f2h5vh822oj20au06owen.jpg)

如果用 `rebase` 命令合并，结果如下图：

![Rebase 衍合分支](http://ww4.sinaimg.cn/mw690/c3c88275jw1f2h5vl2v6zj20au055wem.jpg)

单纯的从功能上来讲，Rebase 与 Merge 没有什么区别。但实际上，Rebase 更干净，因为提交历史最后会是线性的，但是 commit 不一定按日期先后排列，而是 local commit 总在后边；Merge 会保留各分支的提交历史，commit 会按日期先后排序，但这样看起来会比较复杂。

在操作过程中，Merge 操作遇到冲突的时候，当前 merge 不能继续进行下去，需手动修改冲突内容后再做一次提交；而 rebase 操作的话，会中断 rebase，同时会提示去解决冲突。解决冲突后，将修改 add，然后执行 `git rebase --continue` 继续操作，或者 `git rebase --skip`忽略冲突。

需要注意的一点是，我们平时 `git pull` 时，实际上是将远程提交与本地提交进行 merge。`git pull` 默认是 `git fetch + git merge FETCH_HEAD` 的缩写。如果希望 pull 时使用 rebase，可以加上 `--rebase` 参数。

至于 merge 与 rebase 的使用场景，则是众说纷纭，具体可以根据自己的需求选择合适的方式。