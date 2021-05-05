///////////////////////////////////////////////////////////////////////////////
// Project      : APStore
// File         : index.js
// Version      : v0.0.1
//
// Description  : User interface script
//
// Author       : Peter McCarthy
// Created      : 05/05/2021
// Last Updated : 05/05/2021
//
// TODO     [1] : N/A
///////////////////////////////////////////////////////////////////////////////

// Constants

const CHECK_UPDATE_INTERVAL = 15000;
const RELOAD_TIMEOUT = 1000;

// Functions

//
// main()
//
const main = () =>
{
    window.addEventListener('load', () =>
    {
        if ('serviceWorker' in navigator)
        {
            navigator.serviceWorker.register('/service-worker.js').then((registration) =>
            {
                console.log('navigator.serviceWorker.register(): service worker registered');

                let timerId;

                if (registration.active != null)
                {
                    registration.addEventListener('updatefound', () =>
                    {
                        console.log('registration.addEventListener(updatefound): update found');

                        const installingServiceWorker = registration.installing;

                        if (installingServiceWorker != null)
                        {
                            installingServiceWorker.addEventListener('statechange', () =>
                            {
                                if (installingServiceWorker.state === 'installed')
                                {
                                    console.log('installingServiceWorker.addEventListener(statechange): update ready to install');

                                    clearInterval(timerId);

                                    if ('Notification' in window)
                                    {
                                        const notify = () =>
                                        {
                                            registration.showNotification('APStore', { body: 'Update installed' });

                                            timerId = setTimeout(() =>
                                            {
                                                location.reload();
                                            }, RELOAD_TIMEOUT);
                                        };

                                        if (Notification.permission === 'granted')
                                            notify();
                                        else
                                            Notification.requestPermission().then((permission) =>
                                            {
                                                if (Notification.permission === 'granted')
                                                    notify();
                                                else
                                                    location.reload();
                                            });
                                    }
                                    else
                                        location.reload();
                                }
                            });
                        }
                    });
                }

                timerId = setInterval(() => { const promise = registration.update(); }, CHECK_UPDATE_INTERVAL);
            }).catch((error) =>
            {
                console.log('navigator.serviceWorker.register(): service worker not registered;', error);
            });
        }

        const socket = io('https://localhost:10241');

        socket.on('pong', (data) =>
        {
            console.log(`socket.on(pong): id=${ socket.id }, data=${ JSON.stringify(data) }`);
        });

        const button = document.getElementById('PingButton');

        button.onclick = () =>
        {
            socket.emit('ping', { time: Date.now() });
        };
    });
};

main();
