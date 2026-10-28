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

const VERSION = "lsh-v3-2026-10-28";

const PRECACHE = [
    "./",
    "./index.html",
    "./offline.html",
    "./login.html",
    "./signup.html",
    "./manifest.json",
    "./css/site.css",
    "./css/style.css",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

const ASSET_PATTERN =
    /\.(?:css|js|png|jpe?g|gif|svg|webp|woff2?|ttf|ico)$/i;


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
                .filter(key => key !== VERSION)
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
