const main = () =>
{
    window.addEventListener('load', () =>
    {
        const webSocket = new WebSocket('ws://localhost:10242');

        webSocket.addEventListener('message', (event) =>
        {
            console.log('webSocket.addEventListener(message): event.data=' + event.data);
        });

        const button = document.getElementById('PingButton');

        button.onclick = () =>
        {
            webSocket.send('{\"time\":' + Date.now() + '}');
        };
    });
};

main();
