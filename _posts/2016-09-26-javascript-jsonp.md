---
layout: post
title: "JavaScript 跨域请求数据(JSONP)"
keywords: jsonp js javascript 跨域请求
description: "JavaScript 用 jsonp 跨域请求数据"
category: Web设计
tags: jsonp javascript
---

我想要把爱词霸的每日一句引入到页面上，爱词霸向外开放了 [API](http://open.iciba.com/dsapi), 接口返回 json 数据，为了让页面更轻巧，我没有用 jQuery，而是直接纯 js 写了一段代码：

```javascript
<script type="text/javascript">
    function httpGetAsync(theUrl, callback)
    {
        xmlHttp = null;
        if (window.XMLHttpRequest)
        {// code for IE7, Firefox, Opera, etc.
            xmlHttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {// code for IE6, IE5
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (xmlHttp != null)
        {
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                {
                    callback(xmlHttp.responseText);
                }
                else
                {
                    console.error("Problem retrieving XML data");
                }
            }
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
            xmlHttp.send(null);
        }
        else
        {
            console.error("Your browser does not support XMLHTTP.");
        }
    }

    function showIcibaDS(ds_data)
    {
        // show daily sentence
        content = ds_data.content;
        note = ds_data.note;
        document.write(content + '<br>');
        document.write(note);
    }

    httpGetAsync("http://open.iciba.com/dsapi/", showIcibaDS);
</script>
```

运行之后数据并没有获取到，而是出现了如下错误提示：

```
XMLHttpRequest cannot load http://open.iciba.com/dsapi/. Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access. The response had HTTP status code 501.
```

这就是跨域请求的问题。那么什么是跨域请求呢？浏览器出于安全方面的考虑，采用同源策略(Same origin Policy)，即只允许与同域下的接口交互。同域是指：

- 同协议：如都是 http 或者 https
- 同域名：如都是 http://konghy.cn/a 或 http://konghy.cn/b
- 同端口：如都是 80 端口

也就是说，用户打开了页面: http://blog.konghy.cn， 当前页面下的 js 向 http://blog.konghy.cn/XXX 的接口发数据请求，浏览器是允许的。但假如向: http://open.iciba.com/xxx 发数据请求则会被浏览器阻止掉，因为存在跨域调用。

跨域请求的解决办法就是 [JSONP（JSON with Padding）](https://zh.wikipedia.org/wiki/JSONP).  HTML 中 script 标签可以加载其他域下的 js, JSONP 就是通过 script 标签加载数据的方式去获取数据当做 JS 代码来执行，然后再用一个回调函数抽取数据：

```javascript
<script type="text/javascript">
    var cur_date = new Date();
    document.getElementById("cur_year").innerHTML = cur_date.getFullYear();

    function showIcibaDS(ds_data)
    {
        // show daily sentence
        content = ds_data.content;
        note = ds_data.note;
        ds_p = document.getElementById("iciba_ds")
        var content_span = document.createElement('span');
        var note_span = document.createElement('span');
        var br = document.createElement('br')
        content_span.innerHTML = content
        note_span.innerHTML = note
        ds_p.appendChild(content_span);
        ds_p.appendChild(br);
        ds_p.appendChild(note_span);
    }
</script>
<script type="text/javascript" src="http://open.iciba.com/dsapi/?callback=showIcibaDS"></script>
```

再查查资料，发现有人做了封装：

```javascript
function jsonp(setting)
{
    setting.data = setting.data || {}
    setting.key = setting.key||'callback'
    setting.callback = setting.callback||function(){}
    setting.data[setting.key] = '__onGetData__'

    window.__onGetData__ = function(data) {
        setting.callback (data);
    }
    var script = document.createElement('script')
    var query = []
    for(var key in setting.data)
    {
        query.push(key + '=' + encodeURIComponent(setting.data[key]))
    }
    script.src = setting.url + '?' + query.join('&')
    document.head.appendChild(script)
    document.head.removeChild(script)
}

jsonp({
    url: 'http://photo.sina.cn/aj/index',
    key: 'jsoncallback',
    data: { page: 1, cate: 'recommend' },
    callback: function(ret) {
        console.log(ret)
    }
})
```

如果你使用的是 jQuery，则可以直接用 ajax 请求数据：

```javascript
<script src="js/jquery-1.11.3.js"></script>
<script>
$(function(){
    $.ajax({
        async: true,
        type: "GET",
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'callbackfunction',
        url: "http://open.iciba.com/dsapi/",
        data: "",
        timeout: 3000,
        contentType: "application/json;utf-8",
        success: function(data) {
            console.log(data);
        }
    });
})
</script>
```

## 参考资料

- [http://www.jb51.net/article/75669.htm](http://www.jb51.net/article/75669.htm)
- [https://zhuanlan.zhihu.com/p/22600501](https://zhuanlan.zhihu.com/p/22600501)
