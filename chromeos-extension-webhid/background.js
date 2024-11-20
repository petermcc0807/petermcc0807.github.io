'use strict';

// const HOST = '100.115.92.2';
const HOST = '192.168.0.19';
// const PORT = '8080';
const PORT = 10240;

const BUTTONS =
{
    // Promethean dongle

    /* byteIndex: 0,

    byteValues:
    {
        none: 0x00,
        toggleState: 0x00,
        close: 0x00
    } */

    // C64 joystick

    /* byteIndex: 5,

    byteValues:
    {
        none: 0x0f,
        toggleState: 0x1f,
        close: 0x2f
    } */

    // Sony controller

    byteIndex: 7,

    byteValues:
    {
        none: 0x08,
        toggleState: 0x18,
        close: 0x48
    }
};

let initialised = false;

let window;

let leftButtonPressed;
let rightButtonPressed;

chrome.alarms.create({ periodInMinutes: (1 / 60) });

chrome.alarms.onAlarm.addListener(async (alarm) =>
{
    if (initialised === false)
    {
        if (window === undefined)
        {
            /* window = await chrome.windows.create({ url: 'https://desktop.one.prometheanworld.com/', type: 'popup', state: 'normal', focused: true });

            const _window = await chrome.windows.update(window.id, { state: 'minimized' }); */

            const options =
            {
                url: 'https://desktop.one.prometheanworld.com/',
                type: 'popup',
                state: 'normal',
                focused: true,
                top: 0,
                left: 0,
                // TEMPORARY
                width: 50,
                height: 100
                // TEMPORARY
            };

            chrome.windows.create(options, (_window) =>
            {
                window = _window;

                const options = { state: 'minimized' };

                chrome.windows.update(window.id, options, (_window) =>
                {
                    // Do something
                });
            });

            window = { };
        }

        // Do something

        initialised = true;
    }

    try
    {
        const timestamp = Date.now();

        const url = `http://${HOST}:${PORT}/api/chromeos?timestamp=${ timestamp }`;

        console.log(`chrome.alarms.onAlarm(): url=${ url }`);

        const response = await fetch(url);

        const json = await response.json();

        console.log(`chrome.alarms.onAlarm(): json=${ JSON.stringify(json) }`);

        const error = json.error;

        // Do something
    }

    catch (exception) { }
});

chrome.runtime.onMessage.addListener(async (message) =>
{
    if (message === 'openDevice')
    {
        console.log('chrome.runtime.onMessage(openDevice)');

        const devices = await navigator.hid.getDevices();

        const device = devices[0];

        await device.open();

        const productName = device.productName;

        console.log(`chrome.runtime.onMessage(openDevice): Device '${ productName }' opened`);

        device.addEventListener('inputreport', async (event) =>
        {
            const { data, device, reportId } = event;

            const bytes = new Uint8Array(data.buffer);

            const byte = bytes[BUTTONS.byteIndex];

            if (leftButtonPressed === undefined)
            {
                if (byte === BUTTONS.byteValues.none)
                    leftButtonPressed = false;
                else if (byte === BUTTONS.byteValues.toggleState)
                    leftButtonPressed = true;
                else { }
            }
            else
            {
                if (byte === BUTTONS.byteValues.none)
                    leftButtonPressed = false;
                else if (byte === BUTTONS.byteValues.toggleState)
                {
                    if (leftButtonPressed === false)
                    {
                        console.log('device.on(inputreport): Toggle State button pressed');

                        if (window !== undefined)
                        {
                            chrome.windows.get(window.id, (_window) =>
                            {
                                let options;

                                if (_window.state === 'minimized')
                                    options = { state: 'normal', focused: true };
                                else if (_window.state === 'normal')
                                    options = { state: 'minimized' };
                                else { }

                                if (options !== undefined)
                                    chrome.windows.update(window.id, options, (_window) => { });
                            });
                        }
                        else
                        {
                            const options =
                            {
                                url: 'https://desktop.one.prometheanworld.com/',
                                type: 'popup',
                                state: 'normal',
                                focused: true,
                                top: 0,
                                left: 0,
                                // TEMPORARY
                                width: 50,
                                height: 100
                                // TEMPORARY
                            };

                            chrome.windows.create(options, (_window) =>
                            {
                                window = _window;

                                const options = { state: 'minimized' };

                                chrome.windows.update(window.id, options, (_window) => { });
                            });
                        }
                    }

                    leftButtonPressed = true;
                }
                else { }
            }

            if (rightButtonPressed === undefined)
            {
                if (byte === BUTTONS.byteValues.none)
                    rightButtonPressed = false;
                else if (byte === BUTTONS.byteValues.close)
                    rightButtonPressed = true;
                else { }
            }
            else
            {
                if (byte === BUTTONS.byteValues.none)
                    rightButtonPressed = false;
                else if (byte === BUTTONS.byteValues.close)
                {
                    if (rightButtonPressed === false)
                    {
                        console.log('device.on(inputreport): Close button pressed');

                        if (window !== undefined)
                        {
                            chrome.windows.remove(window.id, (_window) =>
                            {
                                window = undefined;
                            });
                        }
                    }

                    rightButtonPressed = true;
                }
                else { }
            }
        });
    }
});
