const main = () =>
{
    window.addEventListener('load', () =>
    {
        if ('serviceWorker' in navigator)
        {
            navigator.serviceWorker.register('/service-worker.js').then(registration =>
            {
                console.log('navigator.serviceWorker.register(): service worker registered');

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

                                    // Do something

                                    if ('Notification' in window)
                                    {
                                        const notify = () =>
                                        {
                                            registration.showNotification('APStore', { body: 'Update installed' });

                                            location.reload();
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

                            // Do something
                        }
                    });
                }

                const timerId = setInterval(() => { const promise = registration.update(); }, 15000);

                // Do something
            }).catch(error =>
            {
                console.log('navigator.serviceWorker.register(): service worker not registered;', error);

                // Do something
            });

            // Do something
        }

        /* // const socket = io('http://localhost:10241');
        const socket = io('https://localhost:10241');

        socket.on('pong', (data) =>
        {
            console.log(`socket.on(pong): id=${ socket.id }, data=${ JSON.stringify(data) }`);

            // Do something
        });

        const button = document.getElementById('PingButton');

        button.onclick = () =>
        {
            // Do something

            socket.emit('ping', { time: Date.now() });
        }; */
    });

    // Do something
};

main();
