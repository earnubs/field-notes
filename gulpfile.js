'use strict';

var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var csso = require('postcss-csso');
var uglify = require('gulp-uglify');

gulp.task('metalsmith', function (cb) {
  let build = require('./build.js');
  build(cb);
  delete require.cache[require.resolve('./build.js')];
});

gulp.task('images', function() {
  return gulp.src('./assets/images/**')
    .pipe(gulp.dest('build/static/img/'));
});

gulp.task('fonts', function() {
  return gulp.src('./assets/fonts/**')
    .pipe(gulp.dest('build/static/font/'));
});

gulp.task('styles', function () {
  var processors = [
    autoprefixer(),
    csso()
  ];
  return gulp.src('assets/style/*.css')
    .pipe(postcss(processors))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('build/static/css/'));
});

gulp.task('scripts', function() {
  return gulp.src('./assets/scripts/**')
    .pipe(uglify())
    .pipe(gulp.dest('build/static/js/'));
});

gulp.task('manifest', function() {
  return gulp.src('./manifest.json')
    .pipe(gulp.dest('build/'));
});

gulp.task('clean', function () {
  return del(['build']);
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*', 'assets/**/*', 'templates/**/*'], ['build']);
});

gulp.task('build', ['metalsmith', 'scripts', 'styles', 'images', 'fonts', 'manifest']);
gulp.task('default', ['build']);
