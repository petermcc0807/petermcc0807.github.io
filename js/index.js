'use strict';

const UUID_SERVICE = '0000180D-0000-1000-8000-00805F9B34FB'.toLowerCase();
const UUID_CHARACTERISTIC = '00002A37-0000-1000-8000-00805F9B34FB'.toLowerCase();

const filters = [ { services: [ UUID_SERVICE ] }];

const main = () =>
{
    const button = document.getElementById('BLEButton');

    button.addEventListener('click', async () =>
    {
        console.log('main(): Requesting BLE device...');

        try
        {
            const device = await navigator.bluetooth.requestDevice({ filters });

            console.log('main(): requested device');

            console.log('main(): Connecting to server...');

            const server = await device.gatt.connect();

            console.log('main(): connected to server');

            console.log('main(): Getting service...');

            const service = await server.getPrimaryService(UUID_SERVICE);

            console.log('main(): got service');

            console.log('main(): Getting characteristic...');

            const characteristic = await service.getCharacteristic(UUID_CHARACTERISTIC);

            console.log('main(): got characteristic');

            // Do something
        }

        catch (exception)
        {
            console.log(exception);
        }
    });
}

main();
