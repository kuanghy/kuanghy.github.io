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

**提示： ** <span class="emphasis">在 CSS 中，width 和 height 指的是内容区域的宽度和高度。增加内边距、边框和外边距不会影响内容区域的尺寸，但是会增加元素框的总尺寸。</span>看一个例子：

假设框的每个边上有 10 个像素的外边距和 5 个像素的内边距。如果希望这个元素框达到 100 个像素，就需要将内容的宽度设置为 70 像素，请看下图：
![css boxmodel example](http://7xixhp.com1.z0.glb.clouddn.com/ct_css_boxmodel_example.gif)
<div class="imgtag">图3 CSS盒子模型示例</div>

代码如下所示：
{% highlight css %}
#box {
  width: 70px;
  margin: 10px;
  padding: 5px;
}
{% endhighlight %}

**提示：** <span class="emphasis">内边距、边框和外边距可以应用于一个元素的所有边，也可以应用于单独的边。外边距可以是负值，而且在很多情况下都要使用负值的外边距。</span>

#### 盒子模型各属性详解：
 >   border（边框）：border-top，border-bottom， border-left，border-right

     1.border-color（边框颜色）；

     2.border-width（边框粗细）：medium|thin| thick|数值；

     4.border-style（边框样式）：none|hidden（隐藏）|dotted（虚线）|dashed（点线）|solid（实线）|double（双实线）|groove（IE不支持）|ridge（IE不支持）|inset（IE不支持）|outset（IE不支持）。

    padding（内边距）：padding-top，padding-bottom ，padding-left，padding-right
    margin（外边距）：margin-top，margin-bottom ，margin-left，margin-right
    当margin设为负数时，会使被设为负数的块向相反的方向移动，甚至覆盖在另外的块上。当块之间是父子关系时，通过设置子块的margin参数为负数，可以将子块从父块中“分离”出来。 

#### 参考资料
http://www.w3school.com.cn/css/css_border.asp
http://www.cnblogs.com/shuz/archive/2010/01/24/1655205.html