var branch = require('metalsmith-branch');
var collections = require('metalsmith-collections');
var config = require('./config.json');
var drafts = require('metalsmith-drafts');
var excerpts = require('metalsmith-excerpts');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');
var metalsmith = require('metalsmith');
var moment = require('moment');
var nunjucks = require('nunjucks');
var permalinks = require('metalsmith-permalinks');
var prism = require('metalsmith-prism');
var tags = require('metalsmith-tags');
var typography = require('metalsmith-typography');
var hyphenate = require('metalsmith-hyphenate');

nunjucks.configure('./templates', {watch: false});

module.exports = function(callback) {
  return metalsmith(__dirname)
  .metadata({
    site: config
  })
  .clean(false) // leave for gulp
  .source('./src')
  .destination('./build')
  .ignore('*.swp')
  .use(drafts())
  .use(markdown( { langPrefix: 'language-' } ))
  .use(hyphenate({
    elements: ['p', 'blockquote']
  }))
  .use(prism())
  .use(typography())
  .use(excerpts())
  .use(tags({
    handle: 'tags',
    path: 'tags/:tag.html',
    layout: './tags.html'
  }))
  /**
  .use(function(files, foo, done) {
    //console.log(files['posts/entropy-haveged.html'].contents.toString('ascii'));
    console.log(files['tags/javascript.html'].pagination.files);
    done();
  })
  **/
  .use(
    collections({
      posts: {
        pattern: 'posts/**.html',
        sortBy: 'date',
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
  .build(function(err) {
    if (err) {
      throw new Error(err);
    } else {
      return callback(); // let gulp run async
    }
  });
};
