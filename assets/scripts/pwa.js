self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('carisenda-2018-06-02T21:53').then((cache) => {
      return cache
        .addAll([
          '/',
          '/static/font/DINWeb-Bold.woff2',
          '/static/font/DINWeb-Light.woff2',
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
