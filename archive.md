---
layout: default
title: 博客归档
permalink: /archive/
---

<div class="page-content wc-container">
  <h1>博客归档</h1>  
  {% for post in site.posts %}
  	{% capture currentyear %}{{post.date | date: "%Y"}}{% endcapture %}
  	{% if currentyear != year %}
    	{% unless forloop.first %}</ul>{% endunless %}
    		<h3>{{ currentyear }}</h3>
    		<ul class="posts">
    		{% capture year %}{{currentyear}}{% endcapture %}
  		{% endif %}
    <li>
        <span>{{ post.date | date_to_string }}</span> &raquo;
        <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    </li>
    {% if forloop.last %}</ul>{% endif %}
{% endfor %}
</div>
