// Simple PWA service worker with stale-while-revalidate & offline fallback
const VERSION = 'v1.0.0';
const CORE = [
  '/',
  '/stockfish-pwa/stockfish.html',
  '/styles.css',
  '/manifest.webmanifest',
  '/img/chesspieces/wikipedia/bK.png',
  '/img/chesspieces/wikipedia/bK.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(CORE);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key !== VERSION) await caches.delete(key);
    }
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Try cache first for core files
  if (CORE.some(path => url.pathname === path)) {
    e.respondWith(caches.open(VERSION).then(c => c.match(e.request)));
    return;
  }
  // For CDN libs: cache-as-you-go so they work offline after first load
  const cdnHosts = ['cdn.jsdelivr.net','cdnjs.cloudflare.com'];
  if (cdnHosts.includes(url.hostname)) {
    e.respondWith((async () => {
      const cache = await caches.open('cdn-'+VERSION);
      const cached = await cache.match(e.request);
      if (cached) return cached;
      try {
        const res = await fetch(e.request);
        if (res.ok) cache.put(e.request, res.clone());
        return res;
      } catch (err) {
        return new Response('Offline and dependency not cached yet.', { status: 503 });
      }
    })());
    return;
  }
  // Default: network falling back to cache
  e.respondWith((async () => {
    try {
      const res = await fetch(e.request);
      const cache = await caches.open(VERSION);
      if (res.ok && e.request.method === 'GET') cache.put(e.request, res.clone());
      return res;
    } catch {
      const cache = await caches.open(VERSION);
      const cached = await cache.match(e.request);
      return cached || new Response('Offline', { status: 503 });
    }
  })());
});
