const CACHE = 'dawai-v21';
const BASE = '/dawai';
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  // Only handle same-origin GET; let Firebase, cross-origin, and POST pass through untouched
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(response => {
      const clone = response.clone();
      caches.open(CACHE).then(c => c.put(req, clone)).catch(()=>{});
      return response;
    }).catch(() => caches.match(req).then(r => r || caches.match(BASE + '/index.html')))
  );
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(cs => {
    if(cs.length) return cs[0].focus();
    return clients.openWindow(BASE + '/');
  }));
});
