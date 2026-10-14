const CACHE = 'hy-v2', OFFLINE = '/offline.html'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE)).catch(() => {}).then(() => self.skipWaiting()))
})
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') e.respondWith(fetch(e.request).catch(() => caches.match(OFFLINE)))
})

self.addEventListener('push', (e) => {
  let d = {}
  try { d = e.data.json() } catch {}
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const visible = wins.filter((c) => c.visibilityState === 'visible')
    visible.forEach((c) => c.postMessage({ type: 'alert', ...d }))
    await self.registration.showNotification(d.title || 'Hat Yai Flood Watch', {
      body: d.body || '',
      icon: '/icon-192.png',
      tag: d.tag || 'alert',
      renotify: true,
      vibrate: d.vibrate,
      requireInteraction: !!d.urgent,
      silent: visible.length > 0 || d.sound === 'silent',
      data: { url: d.url || '/th' },
    })
  })())
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = new URL(e.notification.data?.url || '/th', self.location.origin).href
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const c of wins) {
      if (new URL(c.url).origin === self.location.origin && 'focus' in c) { await c.focus(); if ('navigate' in c) await c.navigate(url).catch(() => {}); return }
    }
    await self.clients.openWindow(url)
  })())
})
