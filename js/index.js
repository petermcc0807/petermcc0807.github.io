'use strict';

const main = async () =>
{
    const filters = [ { services: [ '0000180D-0000-1000-8000-00805F9B34FB' ] }];

    let devices;

    console.log('main(): Getting BLE devices...');

    try
    {
        devices = await navigator.bluetooth.requestDevice({ filters });

        console.log('main(): got BLE devices');

        // Do something
    }

    catch (exception)
    {
        console.log(exception);
    }
}

main();
