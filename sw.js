const CACHE_NAME = 'nayyah-v1-permanent';
const ASSETS = [
  '/',
  '/index.html',
  '/css/nayyah-hud.css',
  '/js/core.js',
  '/js/navigator.js',
  '/js/mesh.js',
  '/js/audio.js',
  '/assets/map-offline.svg',
  '/assets/landmarks.json'
];

// INSTALL: Cache SEMUA aset kritis segera
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Aktivasi instan
});

// FETCH: Selalu ambil dari cache dulu, network hanya fallback
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request);
    })
  );
});
