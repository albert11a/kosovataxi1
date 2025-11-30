// sw-shofer.js
// -----------------------------------------------------
// HYBRID MODE:
// ✔ Icons & Manifest OFFLINE
// ✔ HTML / CSS / JS IMMER frisch → keine alten Versionen
// ✔ Sofortige Updates ohne Inkognito
// -----------------------------------------------------

const STATIC_CACHE = "shofer-static-v1";

// Dateien, die OFFLINE verfügbar sein sollen
const OFFLINE_ASSETS = [
  "/fahrer.html",
  "/icon-shofer-192.png",
  "/icon-shofer-512.png",
  "/manifest-shofer.json"
];

// INSTALL – speichert ausschließlich Logos & manifest
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
          if (key !== STATIC_CACHE) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH – HTML/CSS/JS immer LIVE vom Server
// Icons & manifest aus Cache
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Wenn es ein Asset ist → Cache
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

  // HTML, CSS, JS → IMMER LIVE
  event.respondWith(fetch(event.request));
});
