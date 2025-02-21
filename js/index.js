'use strict';

const CHROME_EXTENSION = 'conmonkkabbmjdkfbmfiinlfnjbcbolc';

const main = () =>
{
    const intervalId = setInterval(async () =>
    {
        const userAgent = window.navigator.userAgent;

        console.log(`setInterval(): userAgent=${ userAgent }`);

        if (chrome.runtime !== undefined)
        {
            const response = await chrome.runtime.sendMessage(CHROME_EXTENSION, { sender: 'launcher', type: 'close', data: { } });

            console.log(`chrome.runtime.sendMessage(): sender=${ response.sender }, type=${ response.type }`);

            // Do something
        }
    }, 1000);
}

main();
