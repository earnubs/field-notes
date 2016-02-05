---
title: Karma Test Run as a Gulp Task
publishedDate: 2016-01-22T11:04
tags: javascript, gulp, karma
---

This is my gulp task for running JS unit tests through Karma, using the `run_complete` event gives more accurate timings in gulp logs.

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
