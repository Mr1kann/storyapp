const CACHE_NAME = "story-app-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/app.bundle.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/favicon.png",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Menginstal...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Pre-caching file...");
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Mengaktifkan...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log(`Service Worker: Menghapus cache lama: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        self.clients.claim();
      })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.url.includes("story-api.dicoding.dev")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        console.warn("Gagal fetch API (offline).");
      })
    );
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
        .catch(() => {
          console.error("Gagal fetch aset (offline dan tidak ada di cache).");
        })
    );
  }
});

self.addEventListener("push", (event) => {
  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: "Story App", body: event.data.text() };
  }

  const title = data.title || "Story App";
  const options = {
    body: data.body || "Ada notifikasi baru!",
    icon: "/icon.png",
    badge: "/icon.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow("/");
      })
  );
});
