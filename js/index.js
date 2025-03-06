'use strict';

const filters = [ { services: [ '0000180D-0000-1000-8000-00805F9B34FB'.toLowerCase() ] }];

const main = () =>
{
    const button = document.getElementById('BLEButton');

    button.addEventListener('click', async () =>
    {
        let device;

        console.log('main(): Getting BLE devices...');

        try
        {
            const devices = await navigator.bluetooth.requestDevice({ filters });

            console.log('main(): got BLE devices');

            // Do something
        }

        catch (exception)
        {
            console.log(exception);
        }

        if (device !== undefined)
        {
            // Do something
        }
    });
}

main();
