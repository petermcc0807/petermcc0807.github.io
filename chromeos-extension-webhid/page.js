'use strict';

const main = () =>
{
    const connectButton = document.getElementById('ConnectButton');

    connectButton.addEventListener('click', async () =>
    {
        try
        {
            // const filters = [ { vendorId: 0x1D6B, productId: 0x0104 } ]; // Promethean dongle
            // const filters = [ { vendorId: 0x1C59, productId: 0x0023 } ]; // C64 joystick
            const filters = [ { vendorId: 0x054C, productId: 0x0CE6 } ]; // Sony controller

            await navigator.hid.requestDevice({ filters });

            chrome.runtime.sendMessage('openDevice');
        }

        catch (exception) { }
    });
};

main();
