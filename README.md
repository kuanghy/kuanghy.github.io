旷世的忧伤 | Huoty's Blog
=======================

我的 Github 博客，博客模板引用自 [Harmony](https://github.com/gayanvirajith/harmony) 自适应 Jekyll 主题，并对其做了部分修改。

- Built for jekyll 2.x
- Supports Google analytics and RSS feeds
- Sass based styles
- Browser support: IE 8+, Chrome, Safari and Firefox
- Fluidly responsive

## About jekyll

[Jekyll](http://jekyllrb.com/) is a static site generator, an open-source tool for creating simple yet powerful websites of all shapes and sizes.

## How to install/run

1. Fork this repository.
2. Clone it: git clone https://github.com/YOUR-USERNAME/harmony.
3. If you're completely new to jekyll, please read more about [Jekyll](http://jekyllrb.com/) and [Github pages](https://help.github.com/articles/using-jekyll-with-pages).
4. Change your directory into cloned repository.
5. Run `bundle install`
6. Edit the _config.yml on root directory. Change `url` property to to
`http://127.0.0.1:4000` since you are going to run on localhost.
7. Run the jekyll server by having: `jekyll serve --baseurl ''` or `rake preview`   

Point your browser to [http://localhost:4000](http://localhost:4000).

Note: If you are a windows user please refer to this nice website - http://jekyll-windows.juthilo.com/ by Julian Thilo to configure ruby + jekyll on windows.

## Options/Usage

Harmony has some customizable options. All the configuration details are
configured in `_config.yml` file under root of the harmony directory.

Feel free to change your `name`, `descriptionn`, `meta_description`, `author details`,
`social media names` and `Google analytics id` accordingly.

``` yml
# Harmony theme configuration. Please change accordingly.
harmony:
  name: Harmony
  # Little description about your site
  description: Harmony is free responsive jekyll theme.
  meta_description: Harmony is free responsive jekyll theme. It will appear in your document head meta (for Google search results) and in your feed.xml site description.
  basetheme: theme-base-01 # pre defined the{{ site.url | prepend: site.baseurl }}mes are darken, blue-water, reddish.
  author: # Author details
    name: Gayan Virajith
    email: gayanvirajith@gmail.com
    url: http://gayanvirajith.github.io

  # Google Analytics key, leave blank to ignore
  google_analytics_key: UA-xxxx-x

  # Profile links, leave blank to ignore
  social:
    github: gayanvirajith
    twitter: gayanvirajith
    facebook: gayanvirajith
    gplus: +GayanVirajith
    dribble: gayan
    pinterest:
  # Toggle disclaimer in footer
  show_disclaimer: true
```

### Includes

All the partial includes are under `_includes` directory.

#### Header navigation links

Feel free to add/edit links for your header in the file `header-links.html`.

#### Footer links

Customize your footer links by editing `_includes/footer-links.html`

#### Copyrights/Disclaimer statements

All copyright notes are under `_includes/footer.html`. Also note that you
can toggle on/off copyright notes from the front-end by setting up `show_disclaimer`
property in `_config.yml`.

#### Feedback/Bugs/Suggestions

Please submit as an [issue](https://github.com/web-create/harmony/issues/new),
I am happy to response back.
