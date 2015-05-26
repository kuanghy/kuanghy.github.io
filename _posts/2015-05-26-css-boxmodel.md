---
layout: post
title: CSS盒子模型
category: Web设计
tags: css 盒子模型
---

CSS中， Box Model叫盒子模型（或框模型），Box Model规定了元素框处理元素内容（element content）、内边距（padding）、边框（border） 和 外边距（margin） 的方式。在HTML文档中，每个元素（element）都有盒子模型，所以说在Web世界里（特别是页面布局），Box Model无处不在。下图是CSS盒子模型的示意图：

![CSS2.0 盒子模型的层次3D示意图](http://7xixhp.com1.z0.glb.clouddn.com/boxmodel.png)
<div class="imgtag">图1 CSS2.0盒子模型的层次3D示意图</div>

![CSS 二维盒子模型示意图](http://7xixhp.com1.z0.glb.clouddn.com/boxmodel2.png)
<div class="imgtag">图2 CSS 二维盒子模型示意图</div>

元素框的最内部分是实际的内容，直接包围内容的是内边距。内边距呈现了元素的背景。内边距的边缘是边框。边框以外是外边距，外边距默认是透明的，因此不会遮挡其后的任何元素。背景可以应用于由内容和内边距、边框组成的区域。

内边距、边框和外边距都是可选的，默认值是零。但是，许多元素将由用户代理样式表设置外边距和内边距。可以通过将元素的 margin 和 padding 设置为零来覆盖这些浏览器样式。这可以分别进行，也可以使用通用选择器对所有元素进行设置：
 
{% highlight css %}
* {
  margin: 0;
  padding: 0;
}
{% endhighlight %}

**提示： **<div class="emphasis">在 CSS 中，width 和 height 指的是内容区域的宽度和高度。增加内边距、边框和外边距不会影响内容区域的尺寸，但是会增加元素框的总尺寸。</div>