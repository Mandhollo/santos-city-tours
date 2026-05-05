const CACHE_NAME = 'santos-tours-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './fotos/bolsa-do-cafe.jpg',
  './fotos/monte-serrat.jpg',
  './fotos/museu-do-pele.jpg',
  './fotos/vila-belmiro.jpg',
  './fotos/emissario-submarino.jpg',
  './fotos/orla-gonzaga.jpg',
  './fotos/aquarium-municipal.jpg',
  './fotos/pitangueiras.jpg',
  './fotos/teleferico-sao-vicente.jpg',
  './fotos/ilha-porchat.jpg',
  './fotos/memorial-necropole.jpg',
  './fotos/bondinho-turistico.jpg'
];

// Install - cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - cache first, then network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
