var beautify = require('js-beautify').html;
var branch = require('metalsmith-branch');
var collections = require('metalsmith-collections');
var config = require('./config.json');
var drafts = require('metalsmith-drafts');
var excerpts = require('metalsmith-excerpts');
var layouts = require('metalsmith-layouts');
var marked = require('marked');
var markdown = require('metalsmith-markdown');
var metalsmith = require('metalsmith');
var minify = require('html-minifier').minify;
var moment = require('moment');
var nunjucks = require('nunjucks');
var path = require('path');
var permalinks = require('metalsmith-permalinks');
var typography = require('metalsmith-typography');
//var renderer = new marked.Renderer();

/**
renderer.code = function(code, lang, escaped) {
  var openCodeTag = '</div></div><div class=b-post__code><div class=b-post__container>';
  var closeCodeTag = '</div></div><div class=b-post__container><div class=b-post__body>';

  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return openCodeTag
      + '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>'
      + closeCodeTag;
  }

  return openCodeTag
    + '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n'
    + closeCodeTag;
};
**/

nunjucks.configure('./templates', {watch: false});

module.exports = function(callback) {
  return metalsmith(__dirname)
  .metadata({
    site: config
  })
  .clean(false) // leave for gulp
  .source('./src')
  .destination('./build')
  .ignore(['.*.swp'])
  .use(function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      var metadata = metalsmith.metadata();
      // XXX test for path strings, else path will fail
      var srcPath = path.relative(__dirname, metalsmith.source());
      var filePath = path.join(srcPath, file);
      files[file].github = metadata.site.github + filePath;
    });
    done();
  })
  .use(drafts())
  .use(markdown({
    langPrefix: 'hl',
    //renderer: renderer,
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  }))
  .use(typography())
  .use(excerpts())
  .use(
    collections({
      posts: {
        pattern: 'posts/**.html',
        sortBy: 'publishedDate',
        reverse: true
      }
    })
  )
  .use(
    branch('posts/**.html')
    .use(permalinks({
      pattern: 'posts/:title',
      relative: false
    }))
  )
  .use(
    branch(['!posts/**.html', '!index.html'])
    .use(permalinks({
      relative: false
    }))
  )
  .use(
    layouts({
      engine: 'nunjucks',
      default: 'base.html',
      directory: 'templates',
      pattern: '**/*.html',
      moment: moment
    })
  )
  .use(function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      var content = files[file].contents.toString();
      var min = minify(content, {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeOptionalTags: true
      });
      var beaut = beautify(min, {
        'indent_size': 2,
        'indent_char': ' ',
        'eol': '\n',
        'indent_level': 0,
        'indent_with_tabs': false,
        'preserve_newlines': true,
        'max_preserve_newlines': 0,
        'brace_style': 'collapse',
        'wrap_line_length': 0,
        'wrap_attributes': 'auto',
        'wrap_attributes_indent_size': 4,
        'end_with_newline': true,
        'extra_liners': 'head,body,pre,/html]'
      });

      files[file].contents = new Buffer(beaut);
    });
    done();
  })
  .build(function(err) {
    if (err) {
      throw new Error(err);
    } else {
      return callback(); // let gulp run async
    }
  });
};
