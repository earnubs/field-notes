var branch = require('metalsmith-branch');
var collections = require('metalsmith-collections');
var config = require('./config.json');
var drafts = require('metalsmith-drafts');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');
var metalsmith = require('metalsmith');
var metallic = require('metalsmith-metallic');
var moment = require('moment');
var nunjucks = require('nunjucks');
var permalinks = require('metalsmith-permalinks');
var typography = require('metalsmith-typography');
var path = require('path');

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
  .use(metallic())
  .use(markdown())
  .use(typography())
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
    branch('posts/**.md')
    .use(permalinks({
      pattern: 'posts/:title',
      relative: false
    }))
  )
  .use(
    branch(['!posts/**.md', '!index.md'])
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
