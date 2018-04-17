'use strict';

const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const csso = require('postcss-csso');
const metalsmith = require('./metalsmith.js');

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

function styles() {
  const processors = [
    autoprefixer(),
    csso()
  ];
  return gulp.src('assets/style/*.css')
    .pipe(postcss(processors))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('build/static/css/'));
}

const build = gulp.series(clean, gulp.parallel(blog, images, fonts, styles));

gulp.task('default', build);

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
