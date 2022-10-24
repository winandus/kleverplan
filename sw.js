const BASE = location.protocol + "//" + location.host;
const PREFIX = "V1";
const CACHED_FILES = [
  "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.2/tailwind.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PREFIX);
      await cache.addAll([...CACHED_FILES, "/offline.html"]);

    })()
  );
  // console.log(`${PREFIX} Install`);
});

self.addEventListener("activate", (event) => {
  clients.claim();
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (!key.includes(PREFIX)) {
            return caches.delete(key);
          }
        })
      );
    })()
  );
  // console.log(`${PREFIX} Active`);
});

self.addEventListener("fetch", (event) => {
  // console.log(
  //   `${PREFIX} Fetching : ${event.request.url}, Mode : ${event.request.mode}`
  // );
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          return await fetch(event.request);
        } catch (e) {
          const cache = await caches.open(PREFIX);
          return await cache.match("/offline.html");
        }
      })()
    );
  } else if (CACHED_FILES.includes(event.request.url)) {
    event.respondWith(caches.match(event.request));
  }
});