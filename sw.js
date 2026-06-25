/* 프롬프트 서랍 - 오프라인 캐시 (앱 셸) */
const CACHE = "prompt-drawer-v4";
// config.js 는 일부러 미리 캐시하지 않습니다 (연결 키가 바뀌면 즉시 반영되어야 함)
const ASSETS = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  // Supabase API 호출은 캐시하지 않고 항상 네트워크로 (최신 데이터 유지)
  if (url.hostname.endsWith("supabase.co")) return;

  // config.js(연결 키)와 HTML 문서는 '네트워크 우선' →
  // 키나 코드가 바뀌면 항상 최신이 적용되고, 오프라인일 때만 캐시로 대체.
  const isConfig = url.pathname.endsWith("/config.js");
  if (e.request.mode === "navigate" || isConfig) {
    e.respondWith(
      fetch(e.request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match(e.request).then((c) => c || caches.match("./index.html")))
    );
    return;
  }

  // 그 외 정적 자원(아이콘 등)은 '캐시 우선' (빠르고 오프라인 지원)
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached ||
      fetch(e.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
