const del = require('del');
const gulp = require('gulp');
const webpack = require('webpack');

const metalsmith = require('./metalsmith.js');

const build = gulp.series(
  // clean,
  blog
)

gulp.task('default', build);
gulp.task('blog', blog);

function clean() {
  return del(['build']);
}

function blog(done) {
  metalsmith(done);
}
