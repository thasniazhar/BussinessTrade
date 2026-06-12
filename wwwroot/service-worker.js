const CACHE_NAME = 'ykodex-cache-v1';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                OFFLINE_URL,
                'app.css',
                'favicon.png',
                'bootstrap/bootstrap.min.css'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    // We only want to handle navigation requests for the offline fallback
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
    } else {
        // For other requests, just try the network and fallback to cache if available
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
    }
});
