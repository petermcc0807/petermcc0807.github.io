///////////////////////////////////////////////////////////////////////////////
// Project      : APStore
// File         : index.ws.js
// Version      : v0.0.2
//
// Description  : User interface script
//
// Author       : Peter McCarthy
// Created      : 10/05/2021
// Last Updated : 11/05/2021
//
// TODO     [1] : N/A
///////////////////////////////////////////////////////////////////////////////

// Constants

const PORT = 10242;

const RECONNECT_TIMEOUT = 2500;

// Functions

//
// main()
//
const main = () =>
{
    window.addEventListener('load', () =>
    {
        const uuid = uuidv4();

        let webSocket;

        const button = document.getElementById('PingButton');

        button.onclick = () =>
        {
            const message =
            {
                uuid: uuid,

                time: Date.now()
            };

            try { webSocket.send(JSON.stringify(message)); }

            catch (exception) { }
        };

        button.disabled = true;

        const connect = () =>
        {
            const url = `ws://localhost:${ PORT }`;

            webSocket = new WebSocket(url);

            webSocket.addEventListener('open', (event) =>
            {
                console.log('webSocket.addEventListener(open)');

                button.disabled = false;
            });

            webSocket.addEventListener('close', (event) =>
            {
                console.log('webSocket.addEventListener(close)');

                button.disabled = true;

                const timerId = setTimeout(() => connect(), RECONNECT_TIMEOUT);
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
