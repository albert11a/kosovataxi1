// sw-admin.js
// -----------------------------------------------------
// HYBRID MODE:
// ✔ admin.html + icons offline
// ✔ JS/CSS/HTML Updates sofort live
// ✔ Kein Neuinstallieren der PWA notwendig
// -----------------------------------------------------

const STATIC_CACHE = "admin-static-v1";

const OFFLINE_ASSETS = [
  "/admin.html",
  "/icon-admin-192.png",
  "/icon-admin-512.png",
  "/manifest-admin.json"
];

// INSTALL → nur statische Assets speichern
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(OFFLINE_ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE → alte Caches löschen
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

// FETCH → alles live, außer Icons + offline files
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Icon / JSON (manifest) → Cache First
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

  // Alles andere → immer live
  event.respondWith(fetch(event.request));
});
