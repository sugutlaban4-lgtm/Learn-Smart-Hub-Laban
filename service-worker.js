/* ================================================================
   LEARN SMART HUB SERVICE WORKER

   Strategy, chosen for a site used on slow and expensive data:
   - pages (navigations): network first, so a student always gets the
     current version when they have signal, falling back to the cached
     copy and then to offline.html.
   - static assets (css/js/images): stale-while-revalidate, so a repeat
     visit is instant but improvements still arrive on the next load.
   - everything else: straight to the network.
================================================================ */

const VERSION = "lsh-v16-2026-10-29";

// Long-lived cache for the versioned Firebase modules the session gate imports.
const VENDOR = "lsh-vendor";

const PRECACHE = [
    "./gate.js",
    "./app.js",
    "./",
    "./index.html",
    "./offline.html",
    "./login.html",
    "./signup.html",
    "./manifest.json",
    "./css/site.css",
    "./css/study.css",
    "./js/study.js",
    "./dashboard-premium-panel.js",
    "./css/dashboard.css",
    "./css/admin.css",
    "./admin.html",
    "./manifest-admin.json",
    "./js/admin-app.js",
    "./icons/admin-192.png",
    "./icons/admin-512.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

const ASSET_PATTERN =
    /\.(?:css|js|png|jpe?g|gif|svg|webp|woff2?|ttf|ico)$/i;


/* Versioned Firebase modules from gstatic. These never change for a given
 * version, so they are cached on first use and served from cache afterwards.
 * Keeping them locally is what lets a signed-in student open notes with no
 * network at all. */
const VENDOR_HOST = "www.gstatic.com";
const VENDOR_PREFIX = "/firebasejs/";

function isVendorRequest(url) {
    return url.hostname === VENDOR_HOST && url.pathname.startsWith(VENDOR_PREFIX);
}

self.addEventListener("install", event => {

    event.waitUntil((async () => {

        const cache = await caches.open(VERSION);

        // addAll is all-or-nothing, so add one by one and ignore misses.
        await Promise.all(
            PRECACHE.map(url =>
                cache.add(new Request(url, { cache: "reload" }))
                    .catch(() => undefined)
            )
        );

        await self.skipWaiting();

    })());

});


self.addEventListener("activate", event => {

    event.waitUntil((async () => {

        const keys = await caches.keys();

        await Promise.all(
            keys
                .filter(key => key !== VERSION && key !== VENDOR)
                .map(key => caches.delete(key))
        );

        await self.clients.claim();

    })());

});


self.addEventListener("fetch", event => {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Firebase modules: cache first, then remember them for next time.
    if (isVendorRequest(url)) {

        event.respondWith((async () => {

            const cache = await caches.open(VENDOR);

            const cached = await cache.match(request);

            if (cached) return cached;

            const response = await fetch(request);

            // Only keep responses the browser can actually execute later;
            // an opaque or failed response would break the import next time.
            if (response && response.ok && response.type !== "opaque") {
                cache.put(request, response.clone());
            }

            return response;

        })());

        return;
    }

    if (url.origin !== self.location.origin) {
        return;
    }

    // Pages
    if (request.mode === "navigate") {

        event.respondWith((async () => {

            try {

                const fresh = await fetch(request);

                const cache = await caches.open(VERSION);

                cache.put(request, fresh.clone());

                return fresh;

            } catch (error) {

                const cached = await caches.match(request);

                return cached ||
                    (await caches.match("./offline.html")) ||
                    new Response("Offline", {
                        status: 503,
                        headers: { "Content-Type": "text/plain" }
                    });

            }

        })());

        return;
    }

    // Static assets
    if (ASSET_PATTERN.test(url.pathname)) {

        event.respondWith((async () => {

            const cache = await caches.open(VERSION);

            const cached = await cache.match(request);

            const network = fetch(request)
                .then(response => {

                    if (response && response.ok) {
                        cache.put(request, response.clone());
                    }

                    return response;

                })
                .catch(() => undefined);

            return cached || (await network) || Response.error();

        })());

    }

});
