const CACHE_NAME = 'germain-v3';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/prospectos/donde-germain',
    '/germain_icon_192.png',
    '/germain_icon_512.png',
    '/manifest.json',
    OFFLINE_URL
];

// Install event - precache assets with resilience
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Usamos map y allSettled para que si un asset da 404, el SW se instale igual
            return Promise.allSettled(
                PRECACHE_ASSETS.map(url =>
                    cache.add(url).catch(err => console.warn(`⚠️ Cache failed for: ${url}`, err))
                )
            );
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    event.waitUntil(clients.claim());
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone and cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Return cached version if network fails
                return caches.match(event.request).then((cachedResponse) => {
                    return cachedResponse || caches.match(OFFLINE_URL);
                });
            })
    );
});

// Handle push notifications (future use)
self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {};
    const title = data.title || 'Donde Germain';
    const options = {
        body: data.body || '¡Tu pedido está listo!',
        icon: '/germain_pwa_icon.jpg',
        badge: '/germain_pwa_icon.jpg',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/prospectos/donde-germain'
        }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/prospectos/donde-germain';
    event.waitUntil(clients.openWindow(url));
});
