//
// NOTE [1] : If hosting in Github Pages (cannot disable caching), delete local cache to force refresh
//
//      [2] : https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
//

const VERSION = '0.0.1';

const CACHE_NAME = 'apstore';

const ASSETS =
[
    '/',
    '/index.html',
    '/img/logo-512x512.png',
    '/js/index.js',
    '/js/socket.io/socket.io.js',
    '/js/socket.io/socket.io.js.map'
];

self.addEventListener('install', event =>
{
    console.log('self.addEventListener(install)');

    // NOTE: see [1]
    event.waitUntil(caches.delete(CACHE_NAME).then((cache) =>
    {
        console.log('self.addEventListener(install): caches.delete(); cache deleted');

        // Do something
    }).catch((error) =>
    {
        console.log('self.addEventListener(install): caches.delete();', error);

        // Do something
    }));
    // NOTE

    event.waitUntil(caches.open(CACHE_NAME).then((cache) =>
    {
        cache.addAll(ASSETS);

        console.log('self.addEventListener(install): caches.open(); assets cached');

        // Do something
    }).catch((error) =>
    {
        console.log('self.addEventListener(install): caches.open();', error);

        // Do something
    }));

    self.skipWaiting();    
});

self.addEventListener('activate', (event) =>
{
    console.log('self.addEventListener(activate)');

    // Do something
});

self.addEventListener('fetch', (event) =>
{
    console.log('self.addEventListener(fetch)');

    event.respondWith(caches.match(event.request).then((response) =>
    {
        let promise;

        if (response !== undefined)
            promise = response;
        else
            promise = fetch(event.request);

        return promise;
    }).catch((error) =>
    {
        console.log('self.addEventListener(fetch): caches.match();', error);

        // Do something
    }));
});
