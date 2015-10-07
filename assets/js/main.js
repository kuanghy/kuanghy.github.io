/**
 * 网址导航动态加载
 */
categorys = {
    se : "搜索引擎",
    usual : "常用网址",
    technology : "技术学习",
    tool : "工具资料",
    opensource : "开源世界",
    material : "素材模板",
    resources : "资源搜索",
    collection : "收藏备份",
    flink : "友情链接",
    music : "遇见音乐",
    translation : "在线翻译",
    cloudisk : "网络云盘",
    aboutme : "关于我的"
};

$(document).ready(function(){
    $.getJSON("../assets/data/urls.json", function(urls) {
        html = "";
        $.each(urls, function(category, items){
            content = '<div class="category">' + 
                '<span class="title"><div class="shade">' + categorys[category] + 
                '</div></span>';
            $.each(items, function(index, item){
                content += '<div class="item" ><img src="' + 
                    item.icon + '" /> <a href="' +
                    item.url + '" title="' + 
                    item.title + '" target="_blank" >' +
                    item.name + '</a></div>';
            });

            content += '</div>';
            html += content;
        });

        html += '<div style="height: 50px"></div>' // 占位 div， 防止内容溢出
        // $("#nav_content").css('min-height', '600px');
        $("#nav_content").empty();
        $("#nav_content").append(html);
    });
});
/* 以上框架可以直接简写成 $(function() { ... }); */

function classify(c)
{
    $.getJSON("../assets/data/urls.json", function(urls) {
        $.each(urls, function(category, items){
            if ( c == category)
            {
                content = '<div class="category">' + 
                    '<span class="title"><div class="shade">' + categorys[category] + 
                    '</div></span>';
                $.each(items, function(index, item){
                    content += '<div class="item" ><img src="' + 
                        item.icon + '" /> <a href="' +
                        item.url + '" title="' + 
                        item.title + '" target="_blank" >' +
                        item.name + '</a></div>';
                });

                content += '</div>';
            }
        });

        $("#nav_content").empty();
        $("#nav_content").append(content);
    });
}

/**
 * 心情随笔
 */
$(function() {
    $.getJSON("../assets/data/essays.json", function(urls) {
        content = ""
        $.each(urls, function(etime, essay){
            // alert(etime+"::"+essay);
            content += '<div class="essay">'
                + '<img src="../assets/imgs/khy_face_130.png" width="80" height="80"/>'
                + '<div class="sg_text">'
                + '<span class="org_box_cor cor2"></span>' + essay + '</div>'
                + '<div class="essaytime">' + etime + '</div></div>'
        });
        $("#essay_content").empty();
        $("#essay_content").append(content);
    });
});

/**
 * 切换搜索输入框
 */
function change_search(se){
    div_baidu = document.getElementById("div_baidu");
    div_google = document.getElementById("div_google");
    button_baidu = document.getElementById("button_baidu");
    button_google = document.getElementById("button_google");

    if (se == 'baidu' )
    {
        div_google.style.display = 'none';
        div_baidu.style.display = 'block';
        button_baidu.style.cssText = 'background:#2D2D2D;color:#FFF;';
        button_google.style.cssText = 'background:#D4D7DB;color:#2D2D2D;';
    }
    else
    {
        div_baidu.style.display = 'none';
        div_google.style.display = 'block';
        button_baidu.style.cssText = 'background:#D4D7DB;color:#2D2D2D;';
        button_google.style.cssText = 'background:#2D2D2D;color:#FFF;';
    }
}