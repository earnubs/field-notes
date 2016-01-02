var autoprefixer = require('autoprefixer');
var build = require('./build.js');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var postcss = require('gulp-postcss');

gulp.task('metalsmith', ['clean'], function (cb) {
  build(cb);
});

gulp.task('images', ['clean'], function() {
  return gulp.src('./assets/images/**')
  .pipe(gulp.dest('build/img/'));
});

gulp.task('fonts', ['clean'], function() {
  return gulp.src('./assets/fonts/**')
  .pipe(gulp.dest('build/font/'));
});

gulp.task('styles', ['clean'], function () {
  var processors = [
    autoprefixer()
  ];
  return gulp.src('assets/style/*.css')
  .pipe(postcss(processors))
  .pipe(concat('all.css'))
  .pipe(gulp.dest('build/css/'));
});

gulp.task('clean', function () {
  return del(['build']);
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*', 'assets/**/*'], ['build']);
});

gulp.task('build', ['metalsmith', 'styles', 'images', 'fonts']);
gulp.task('default', ['build']);
