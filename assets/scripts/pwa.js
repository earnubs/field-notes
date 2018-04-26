self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('carisenda-2018-04-26T21:18').then((cache) => {
      return cache
        .addAll([
          '/',
          '/index.html',
          '/static/css/all.css',
          '/static/font/DINWeb-Bold.woff2',
          '/static/font/DINWeb-Light.woff2',
          '/static/img/favicon.png',
          '/static/js/datetime.js',
          '/static/js/lib/moment.min.js',
        ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
