var autoprefixer = require('autoprefixer');
var build = require('./build.js');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var webserver = require('gulp-webserver');


gulp.task('metalsmith', ['clean'], function (cb) {
  build(cb);
});

gulp.task('images', ['clean'], function() {
  return gulp.src('./assets/images/**')
  .pipe(gulp.dest('build/img/'));
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

gulp.task('webserver', function() {
  gulp.src('build')
  .pipe(webserver({
    livereload: true,
    directoryListing: true,
    open: true
  }));
});

gulp.task('build', ['metalsmith', 'styles', 'images']);
gulp.task('default', ['build']);
gulp.task('www', ['build', 'webserver']);
