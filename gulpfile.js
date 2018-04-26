'use strict';

const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const csso = require('postcss-csso');
const del = require('del');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const manifest = require('./build/static/js/manifest.json');

const metalsmith = require('./metalsmith.js');

const build = gulp.series(
  clean,
  gulp.parallel(images, fonts, styles, appManifest,
    gulp.series(scripts, blog, scope)
  ));

gulp.task('default', build);
gulp.task('scripts', scripts);

function clean() {
  return del(['build']);
}

function blog(cb) {
  metalsmith(cb);
}

function images() {
  return gulp.src('./assets/images/**')
    .pipe(gulp.dest('build/static/img/'));
}

function fonts() {
  return gulp.src('./assets/fonts/**')
    .pipe(gulp.dest('build/static/font/'));
}

const cssProcessors = [
  autoprefixer(),
  csso()
];

function styles() {
  return gulp.src('assets/style/*.css')
    .pipe(postcss(cssProcessors))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('build/static/css/'));
}

function appManifest() {
  return gulp.src('./src/manifest.json')
    .pipe(gulp.dest('build/'));
}

/** Move the service worker to top level scope */
/** FIXME use headers to do this in future */
function scope() {
  return gulp.src(`./build/static/js/${manifest['pwa.js']}`)
    .pipe(gulp.dest('build/'));
}

function scripts() {
  return new Promise(resolve => webpack(config, (err, stats) => {
    if(err) console.log('Webpack', err); // eslint-disable-line no-console
    console.log(stats.toString({ /* stats options */ })); // eslint-disable-line no-console
    resolve();
  }));
}


//gulp.task('metalsmith', function (cb) {
//  let build = require('./metalsmith.js');
//  build(cb);
//  delete require.cache[require.resolve('./metalsmith.js')];
//});
//
//
//gulp.task('scripts', function() {
//  return gulp.src('./assets/scripts/**')
//    .pipe(uglify())
//    .pipe(gulp.dest('build/static/js/'));
//});
//
//gulp.task('manifest', function() {
//  return gulp.src('./manifest.json')
//    .pipe(gulp.dest('build/'));
//});
//
//gulp.task('sw', function() {
//  return gulp.src('./assets/sw/**')
//    .pipe(uglify())
//    .pipe(gulp.dest('build/'));
//});
//
//gulp.task('clean', function () {
//  return del(['build']);
//});

//gulp.task('watch', ['build'], function() {
//  gulp.watch(['src/**/*', 'assets/**/*', 'templates/**/*'], ['build']);
//});

//gulp.task('build', ['metalsmith', 'scripts', 'styles', 'images', 'fonts', 'sw', 'manifest']);
//gulp.task('default', ['build']);
