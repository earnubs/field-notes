var branch = require('metalsmith-branch');
var collections = require('metalsmith-collections');
var excerpts = require('metalsmith-excerpts');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');
var metalsmith = require('metalsmith');
var moment = require('moment');
var nunjucks = require('nunjucks');
var permalinks = require('metalsmith-permalinks');
var serve = require('metalsmith-serve');
var typography = require('metalsmith-typography');
var watch = require('metalsmith-watch');

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
  .use(markdown())
  .use(typography())
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
