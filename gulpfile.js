'use strict';

const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const csso = require('postcss-csso');
const del = require('del');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const webpack = require('webpack');

const config = require('./webpack.config.js');


const build = gulp.series(
  clean,
  gulp.parallel(images, fonts, styles, www,
    gulp.series(bundle, blog)
  ));

gulp.task('default', build);
gulp.task('blog', blog);

function clean() {
  return del(['build']);
}

function blog(cb) {
  const metalsmith = require('./metalsmith.js');
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

function www() {
  return gulp.src('./www/*', {dot: true})
    .pipe(gulp.dest('build/'));
}

function bundle() {
  return new Promise(resolve => webpack(config, (err, stats) => {
    if(err) console.log('Webpack', err); // eslint-disable-line no-console
    console.log(stats.toString({ /* stats options */ })); // eslint-disable-line no-console
    resolve();
  }));
}
