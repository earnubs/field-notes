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
var watch = require('metalsmith-watch');

nunjucks.configure('./templates', {watch: false});

metalsmith(__dirname)
.clean(true)
.metadata({
  site: {
    title: 'Field Notes',
    url: 'http://carisenda.com'
  }
})
.source('./src')
.destination('./build')
.use(markdown())
.use(excerpts())
.use(collections({
  posts: {
    pattern: 'posts/**.html',
    sortBy: 'date',
    reverse: true
  }
}))
.use(layouts({
  engine: 'nunjucks',
  default: 'base.html',
  directory: 'templates',
  pattern: '**/*.html'
}))
.use(serve({
  port: 8080,
  verbose: true
}))
.use(watch({
  pattern: '**/*'
}))
.build(function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Build complete.');
  }
});
