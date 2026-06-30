/* 자가 제거 서비스워커 — 예전 '프롬프트 서랍' 캐시/등록을 정리하고 스스로 해제 */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    } catch (err) {}
    try { await self.registration.unregister(); } catch (err) {}
    try {
      var cs = await self.clients.matchAll({ type: 'window' });
      cs.forEach(function (c) { c.navigate(c.url); });
    } catch (err) {}
  })());
});
