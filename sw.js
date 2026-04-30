const CACHE_NAME = 'hb-mkt-v2';
const ASSETS = ['./', './index.html', './manifest.json',
  'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;600&family=Space+Mono:wght@400&display=swap'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.anthropic.com')) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(ca => ca.put(e.request, c)); }
    return r;
  }).catch(() => caches.match(e.request)));
});
