/**
 * sw.js — Service Worker
 * Strategy: Network-first with cache fallback.
 * Bump CACHE_NAME to force a fresh install and clear old caches.
 */

const CACHE_NAME = "pwa-v1";

/**
 * Files to pre-cache on install.
 * Add your compiled JS/CSS bundle paths here (e.g. from your build output).
 */
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
];

// ── Install: pre-cache the app shell ───────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()) // activate immediately
  );
});

// ── Activate: delete all caches that aren't CACHE_NAME ────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim()) // take control of all open tabs
  );
});

// ── Fetch: network-first, fall back to cache ──────────────────────────
self.addEventListener("fetch", (event) => {
  // Only handle GET requests. Skip cross-origin requests (analytics, CDN etc).
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache a clone of every successful response.
        if (networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() =>
        // Network failed — serve from cache, or a fallback offline page.
        caches.match(event.request).then(
          (cached) => cached ?? caches.match("/index.html")
        )
      )
  );
});
