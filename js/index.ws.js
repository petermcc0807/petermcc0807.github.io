const main = () =>
{
    window.addEventListener('load', () =>
    {
        let webSocket;

        const button = document.getElementById('PingButton');

        button.onclick = () =>
        {
            try { webSocket.send('{\"time\":' + Date.now() + '}'); }

            catch (exception) { }
        };

        button.disabled = true;

        const connect = () =>
        {
            webSocket = new WebSocket('ws://localhost:10242');

            webSocket.addEventListener('open', (event) =>
            {
                console.log('webSocket.addEventListener(open)');

                button.disabled = false;
            });

            webSocket.addEventListener('close', (event) =>
            {
                console.log('webSocket.addEventListener(close)');

                button.disabled = true;

                const timerId = setTimeout(() => connect(), 2500);
            });

            webSocket.addEventListener('message', (event) =>
            {
                console.log(`webSocket.addEventListener(message): event.data=${ event.data }`);
            });

            webSocket.addEventListener('error', (error) =>
            {
                console.log('webSocket.addEventListener(error)');

                webSocket.close();
            });
        };

        connect();
    });
};

main();
