///////////////////////////////////////////////////////////////////////////////
// Project      : APStore
// File         : service-worker.js
// Version      : v0.0.1
//
// Description  : User interface service worker
//
// Author       : Peter McCarthy
// Created      : 05/05/2021
// Last Updated : 05/05/2021
//
// TODO     [1] : N/A
///////////////////////////////////////////////////////////////////////////////

// Constants

const VERSION = '0.0.3';

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

// Functions (event handlers)

//
// self.addEventListener(install)
//
self.addEventListener('install', (event) =>
{
    console.log('self.addEventListener(install)');

    self.skipWaiting();

    event.waitUntil(caches.open(CACHE_NAME).then((cache) =>
    {
        return cache.addAll(ASSETS);
    }).catch((error) =>
    {
        console.log('self.addEventListener(install): caches.open();', error);
    }));
});

//
// self.addEventListener(activate)
//
self.addEventListener('activate', (event) =>
{
    console.log('self.addEventListener(activate)');
});

//
// self.addEventListener(fetch)
//
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
    }));
});
