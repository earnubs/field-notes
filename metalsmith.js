'use strict';
const beautify = require('js-beautify').html;
const branch = require('metalsmith-branch');
const collections = require('metalsmith-collections');
const debug = require('metalsmith-debug');
const drafts = require('metalsmith-drafts');
const excerpts = require('metalsmith-excerpts');
const layouts = require('metalsmith-layouts');
const mark = require('marked');
const markdown = require('metalsmith-markdown');
const metalsmith = require('metalsmith');
const minify = require('html-minifier').minify;
const moment = require('moment');
const nunjucks = require('nunjucks');
const permalinks = require('metalsmith-permalinks');
const sourcelink = require('metalsmith-source-link');
const typography = require('metalsmith-typography');

const renderer = new mark.Renderer();
renderer.heading = function (text, level) {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return `<h${level} id="${escapedText}"><a href="#${escapedText}">${text}</a></h${level}>`;
};

const config = require('./config.json');
const manifest = require('./build/static/js/manifest.json');

nunjucks.configure('./templates', {watch: false});

module.exports = function(callback) {
  return metalsmith(__dirname)
    .metadata({
      site: config,
      webpack: manifest,
      build_date: moment().format(),
      build_date_formatted: moment().format('LLLL'),
      revno: require('child_process')
        .execSync('git rev-parse --short origin/master')
        .toString().trim()
    })
    .clean(false) // leave for gulp
    .source('./src')
    .destination('./build')
    .ignore(['.*.swp'])
    .use(debug())
    .use(sourcelink('https://github.com/earnubs/field-notes/tree/master/'))
    .use(drafts())
    .use(markdown({
      renderer: renderer,
      langPrefix: 'hl',
      highlight: (code) => {
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
          reverse: true,
          refer: false
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
    .use((files, metalsmith, done) => {
      Object.keys(files).forEach((file) => {
        const content = files[file].contents.toString();
        const min = minify(content, {
          removeAttributeQuotes: true,
          removeComments: true,
          collapseBooleanAttributes: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeOptionalTags: true
        });
        const beaut = beautify(min, {
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
    .build((err) => {
      if (err) {
        throw new Error(err);
      } else {
        return callback(); // let gulp run async
      }
    });
};
