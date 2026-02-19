/* Service Worker - PWA - App Missões e Estudo Bíblico */
const CACHE_NAME = 'missoes-biblia-v1';
const urlsParaCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
  'https://unpkg.com/alpinejs@3.13.3/dist/cdn.min.js',
  '/assets/css/tema.css',
  '/assets/css/componentes.css',
  '/assets/css/utilidades.css',
  '/assets/js/config/supabase.js',
  '/assets/js/app.js'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsParaCache).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  if (evento.request.url.startsWith('https://') && !evento.request.url.includes(self.location.host)) {
    return;
  }
  evento.respondWith(
    caches.match(evento.request).then((resposta) => resposta || fetch(evento.request))
  );
});
