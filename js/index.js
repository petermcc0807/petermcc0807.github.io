'use strict';

const UUID_SERVICE = '0000180D-0000-1000-8000-00805F9B34FB'.toLowerCase();
const UUID_CHARACTERISTIC = '00002A37-0000-1000-8000-00805F9B34FB'.toLowerCase();

const filters = [ { services: [ UUID_SERVICE ] }];

const main = () =>
{
    const button = document.getElementById('BLEButton');

    button.addEventListener('click', async () =>
    {
        let device;

        console.log('main(): Getting BLE device...');

        try
        {
            const device = await navigator.bluetooth.requestDevice({ filters });

            console.log('main(): got BLE device');

            const server = await device.gatt.connect();

            const service = await server.getPrimaryService(UUID_SERVICE);

            const characteristic = service.getCharacteristic(UUID_CHARACTERISTIC);

            // Do something

            console.log('foo');
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
