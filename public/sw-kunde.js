// sw-kunde.js
// -----------------------------------------------------
// HYBRID MODE:
// ✔ Logos & Manifest offline
// ✔ HTML / CSS / JS immer live → keine Cache-Probleme
// ✔ Sofortige Updates ohne löschen/Inkognito
// -----------------------------------------------------

const STATIC_CACHE = "kunde-static-v1";

// Alles was OFFLINE bleiben soll
const OFFLINE_ASSETS = [
  "/kunde.html",
  "/icon-kunde-192.png",
  "/icon-kunde-512.png",
  "/manifest-kunde.json"
];

// INSTALL – speichert ausschließlich Icons + manifest
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(OFFLINE_ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE – löscht alte Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH – HTML/CSS/JS immer LIVE laden
// Icons & Manifest offline aus Cache holen
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Wenn PNG/Icon/Manifest → cache first
  if (
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".json") ||
    url.pathname.includes("icon")
  ) {
    event.respondWith(
      caches.match(event.request).then((resp) => resp || fetch(event.request))
    );
    return;
  }

  // Alles andere → IMMER live
  event.respondWith(fetch(event.request));
});
