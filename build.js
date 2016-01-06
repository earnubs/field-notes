var branch = require('metalsmith-branch');
var collections = require('metalsmith-collections');
var drafts = require('metalsmith-drafts');
var excerpts = require('metalsmith-excerpts');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');
var metalsmith = require('metalsmith');
var moment = require('moment');
var nunjucks = require('nunjucks');
var permalinks = require('metalsmith-permalinks');
var prism = require('metalsmith-prism');
var typography = require('metalsmith-typography');
var hyphenate = require('metalsmith-hyphenate');
var wc = require("metalsmith-word-count");

nunjucks.configure('./templates', {watch: false});

module.exports = function(callback) {
  return metalsmith(__dirname)
  .clean(false) // leave for gulp
  .metadata({
    site: {
      title: 'Field Notes',
      url: 'http://carisenda.com'
    }
  })
  .source('./src')
  .destination('./build')
  .ignore('*.swp')
  .use(drafts())
  .use(markdown( { langPrefix: 'language-' } ))
  .use(prism())
  .use(typography())
  .use(wc())
  .use(hyphenate({
    elements: ['p', 'blockquote']
  }))
  .use(excerpts())
  .use(
    collections({
      posts: {
        pattern: 'posts/**.html',
        sortBy: 'date',
        reverse: true,
        metadata: {
          name: 'Posts',
          description: 'Posts for ...'
        }
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
    branch(['!posts/**.html', '!index.md'])
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
  //.use(
  //  serve({
  //    port: 8080,
  //    verbose: true
  //  })
  //)
  //.use(
  //  watch({
  //    pattern: '**/*'
  //  })
  //)
  .build(function(err) {
    if (err) {
      throw new Error(err);
    } else {
      return callback(); // let gulp run async
    }
  });
};
