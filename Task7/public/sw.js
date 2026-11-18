// Two values below are filled in automatically when you run "npm run build"
const BUILD_ID = "__BUILD_ID__";
const PRECACHE_URLS = ["__PRECACHE_URLS__"];

const PRECACHE = `car-rental-precache-${BUILD_ID}`;
const STATIC_CACHE = "car-rental-static-v1";
const API_CACHE = "car-rental-api-v1";
const CURRENT_CACHES = [PRECACHE, STATIC_CACHE, API_CACHE];

// Some servers send "Vary: Origin" (you saw it in your screenshot).
// ignoreVary makes the cache match files by address only.
const MATCH = { ignoreVary: true };

// Limits, so the caches cannot grow forever
const STATIC_MAX_ENTRIES = 60;
const API_MAX_ENTRIES = 60;

// scope looks like https://user.github.io/React-Fall-2026/Task7/
const SCOPE = self.registration.scope;
const SCOPE_PATH = new URL(SCOPE).pathname;
const SHELL_URL = new URL("index.html", SCOPE).href;
const OFFLINE_URL = new URL("offline.html", SCOPE).href;
const API_PATH = new URL("api/", SCOPE).pathname;

// INSTALL: save the whole app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) =>
      cache.addAll(
        PRECACHE_URLS.map((path) => new Request(new URL(path, SCOPE).href, { cache: "reload" })),
      ),
    ),
  );
});

// ACTIVATE: delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("car-rental-") && !CURRENT_CACHES.includes(name))
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

// The app sends this message when the user presses "Update"
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// FETCH: runs for every request of our pages. Who answers?
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only GET requests can be cached
  if (request.method !== "GET") return;

  // Other websites (Firebase login, Google) are NEVER touched or cached.
  // This keeps tokens and private data out of our caches.
  if (url.origin !== self.location.origin) return;

  // Only our own app folder
  if (!url.pathname.startsWith(SCOPE_PATH)) return;

  // The "Retry Connection" button (Step 6) must use the real network
  if (url.searchParams.has("ping")) return;

  // Opening the app (typing the address, refresh)
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(url));
    return;
  }

  // Public API data: network-first
  if (url.pathname.startsWith(API_PATH)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else (JS, CSS, images, icons): cache-first
  event.respondWith(cacheFirst(request));
});

// Navigation: our app is a single page app, so every page uses the same
// index.html (the "shell"). It is in the precache, so the app opens offline.
async function handleNavigation(url) {
  const isShellPage = url.pathname === SCOPE_PATH || url.pathname === SCOPE_PATH + "index.html";

  if (isShellPage) {
    const shell = await caches.match(SHELL_URL, MATCH);
    if (shell) return shell;
  }

  try {
    return await fetch(url.href);
  } catch {
    // Navigation cannot be completed: show the offline page
    const offline = await caches.match(OFFLINE_URL, MATCH);
    return offline || Response.error();
  }
}

// STRATEGY 1: CACHE-FIRST
async function cacheFirst(request) {
  const cached = await caches.match(request, MATCH);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, response.clone());
      await trimCache(STATIC_CACHE, STATIC_MAX_ENTRIES);
    }
    return response;
  } catch {
    return new Response("", { status: 503, statusText: "Offline" });
  }
}

// STRATEGY 2: NETWORK-FIRST
async function networkFirst(request) {
  const cache = await caches.open(API_CACHE);

  try {
    const response = await fetch(request);
    const contentType = response.headers.get("content-type") || "";
    if (response.ok && contentType.includes("json")) {
      await cache.put(request, response.clone());
      await trimCache(API_CACHE, API_MAX_ENTRIES);
    }
    return response;
  } catch {
    const cached = await cache.match(request, MATCH);
    if (cached) return markAsFromCache(cached);

    // Nothing saved: answer 503 (the app will show the offline page)
    return new Response(JSON.stringify({ error: "offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// A Response cannot be changed, so we make a copy with one extra header.
// The app reads this header to show "you are viewing saved data".
function markAsFromCache(response) {
  const headers = new Headers(response.headers);
  headers.set("X-From-Cache", "true");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Limit the cache size: delete the oldest entries until only maxEntries are left
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const extra = keys.length - maxEntries;
  for (let i = 0; i < extra; i++) {
    await cache.delete(keys[i]);
  }
}