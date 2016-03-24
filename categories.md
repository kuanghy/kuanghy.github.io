---
layout: default
title: 博客分类
permalink: /categories/
---
<div class="page-content wc-container">
  <h1>博客分类</h1><hr>

  <ul id="label_box">
  {% for category in site.categories %}
    <li><a href="{{ site.baseurl }}/categories/#{{ category | first }}">{{ category | first }}<span>{{ category | last | size }}</span></a></li>
  {% endfor %}
  </ul>

<hr>

  {% for category in site.categories %}
  <h3 id="{{ category | first }}">{{ category | first }}</h3>
  <!-- <span>{{ category | last | size }}</span> -->
  <ul class="arc-list">
      {% for post in category.last %}
          <li>{{ post.date | date:"%d/%m/%Y"}} <a href="{{ post.url }}">{{ post.title }}</a></li>
      {% endfor %}
  </ul>
  {% endfor %}

</div>
