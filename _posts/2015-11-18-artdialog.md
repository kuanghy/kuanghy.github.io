---
layout: post
title: "artDialog 对话框组件使用简介"
category: Web设计
tags: artDialogt
---

`artDialog` 是一个轻巧且高度兼容的 javascript 对话框组件，可让你的网页交互拥有桌面软件般的用户体验。其支持锁定屏幕(遮罩)、模拟 alert 和 confirm、多窗口弹出、静止定位、支持 Ese 键关闭对话框、定时关闭、自定义位置、拖动、鼠标调节窗口大小、换肤等。其项目主页为：[http://aui.github.io/artDialog/](http://aui.github.io/artDialog/).

### 优点

- 兼容主流浏览器

支持IE6和IE6+, Firefox, chrome, Opera, Safari


- 自适应内容

无需预设高宽, 对话框自适应消息内容的大小 (包括按钮)，并且支持消息框大小拖动调节

- 智能消息对齐

如果设置了对话框宽度，文本会自动居中或者居左对齐

- 容错

如果定义的宽度高度小于内容大小不会出现错位,

- 智能定位

使用自定义坐标的时候智能修正位置，确保其在可视范围 (适用于弹出菜单)

- 拖动流畅

不会粘住鼠标也不会拖出浏览器视口导致无法控制

- 轻巧

js压缩后不到8KB (在js内嵌了核心兼容布局CSS的情况下)

- 制订皮肤

九宫格布局, 钩子完善,制作皮肤相当简易, 内置IE6 png 32透明和定位解决方案。

- IE6无抖动静止定位

在IE6下可实现与现代浏览器一样完美静止定位效果

- IE6遮盖下拉控件支持

支持 IE6 下覆盖下拉控件 (注:半透明皮肤不支持)

### 调用方法

#### 1、使用传统的参数
> art.dialog(content, ok, cancel)

```javascript
art.dialog('简单愉悦的接口，强大的表现力，优雅的内部实现', function(){alert('yes');});
```

#### 2、使用字面量传参

> art.dialog(options)

```javascript
var dialog = art.dialog({
    title: '欢迎',
    content: '欢迎使用artDialog对话框组件！',
    icon: 'succeed',
    follow: document.getElementById('btn2'),
    ok: function(){
        this.title('警告').content('请注意artDialog两秒后将关闭！').lock().time(2);
        return false;
    }
});
```

#### 3、扩展方法

`artDialog` 的扩展方法可以对弹出后的对话框操作。例如在 ajax 异步操作中，我们可以先定义一个变量引用对话框返回的扩展方法：

```javascript
var myDialog = art.dialog();// 初始化一个带有loading图标的空对话框
jQuery.ajax({
    url: 'http://web5.qq.com/content?id=1',
    success: function (data) {
        myDialog.content(data);// 填充对话框内容
    }
});
```

如果需要使用程序控制关闭，可以使用"close"方法关闭对话框：

> myDialog.close();

### 默认配置参数

<pre>
artDialog.defaults = {     
     content: ' &lt;div class="aui_loading"> &lt;span>loading... &lt;/span> &lt;/div>',    // 消息内容
     title: '\u6d88\u606f',  // 标题. 默认'消息'
     button: null,    // 自定义按钮
     ok: null,     // 确定按钮回调函数
     cancel: null,    // 取消按钮回调函数
     init: null,     // 对话框初始化后执行的函数
     close: null,    // 对话框关闭前执行的函数
     okVal: '\u786E\u5B9A',  // 确定按钮文本. 默认'确定'
     cancelVal: '\u53D6\u6D88', // 取消按钮文本. 默认'取消'
     width: 'auto',    // 内容宽度
     height: 'auto',    // 内容高度
     minWidth: 96,    // 最小宽度限制
     minHeight: 32,    // 最小高度限制
     padding: '20px 25px',  // 内容与边界填充距离
     skin: '',     // 皮肤名(预留接口,尚未实现)
     icon: null,     // 消息图标名称
     time: null,     // 自动关闭时间
     esc: true,     // 是否支持Esc键关闭
     focus: true,    // 是否支持对话框按钮自动聚焦
     show: true,     // 初始化后是否显示对话框
     follow: null,    // 跟随某元素(即让对话框在元素附近弹出)
     path: _path,    // artDialog路径
     lock: false,    // 是否锁屏
     background: '#000',   // 遮罩颜色
     opacity: .7,    // 遮罩透明度
     duration: 300,    // 遮罩透明度渐变动画速度
     fixed: false,    // 是否静止定位
     left: '50%',    // X轴坐标
     top: '38.2%',    // Y轴坐标
     zIndex: 1987,    // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
     resize: true,    // 是否允许用户调节尺寸
     drag: true     // 是否允许用户拖动位置
 };
</pre>


## 参考资料
[http://aui.github.io/artDialog/doc/index.html](http://aui.github.io/artDialog/doc/index.html)

[http://www.mb5u.com/jscode/html/ajax/426_artDialog2_0_4/](http://www.mb5u.com/jscode/html/ajax/426_artDialog2_0_4/)

[http://blog.sina.com.cn/s/blog_667ac0360102ea4c.html](http://blog.sina.com.cn/s/blog_667ac0360102ea4c.html)
