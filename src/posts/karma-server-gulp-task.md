---
title: Karma Test Run as a Gulp Task
publishedDate: 2016-01-22T11:04
tags: javascript, gulp, karma
---

Below is a gulp task for running unit tests through Karma. Using the
`run_complete` event gives more realistic timings in gulp logs then the
example given at
[karma-runner/gulp-karma](https://github.com/karma-runner/gulp-karma/blob/master/gulpfile.js).

```js
 gulp.task('karma', function(done) {
   var server = new Server({
     configFile: __dirname + '/karma.conf.js',
     singleRun: true
   });

   server.on('run_complete', function() {
     done();
   });
   server.start();
 });
```
