const CACHE = 'mdt-v1';
const FILES = [
  '/qDervis/',
  '/qDervis/index.html',
  '/qDervis/style.css',
  '/qDervis/script.js',
  '/qDervis/logo.png',
  '/qDervis/fotograf.jpg',
  '/qDervis/fotograf1.jpg',
  '/qDervis/fotograf2.jpg',
  '/qDervis/fotograf3.jpg',
  '/qDervis/fotograf4.jpg',
  '/qDervis/fotograf5.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
