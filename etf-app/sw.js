// Makes the launcher installable and lets it open offline to the "no connection" note.
// Only this folder's own files are cached; the app itself (script.google.com) is never touched.
const SHELL = 'etf-shell-v1', FILES = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (new URL(e.request.url).origin !== location.origin) return;              // the app frame goes straight to Google
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(SHELL).then(s => s.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
