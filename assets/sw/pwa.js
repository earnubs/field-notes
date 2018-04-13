self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('carisenda-2018-04-11T21:32').then(function(cache) {
      return cache
        .addAll([
          '/',
          '/index.html',
          '/static/css/all.css',
          '/static/js/lib/moment.min.js',
          '/static/js/datetime.js',
          '/static/font/DINWeb-Bold.woff2',
          '/static/font/DINWeb-Light.woff2'
        ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
