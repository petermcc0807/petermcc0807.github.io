//
// NOTE [1] : https://developer.chrome.com/docs/extensions/develop/concepts/messaging
//

'use strict';

const isChromeOS = window.navigator.userAgent.includes('CrOS');
const isNUC = window.navigator.userAgent.includes('Linux');
const isWindows = window.navigator.userAgent.includes('Windows');

const WIDTH = window.screen.availWidth;
const HEIGHT = isChromeOS === true ? 132 : isNUC === true ? 100 : isWindows === true ? 140 : 100;
const AVAIL_HEIGHT = isChromeOS === true ? window.screen.availHeight : isNUC === true ? window.screen.height : isWindows === true ? window.screen.availHeight : window.screen.height;
const GETDISPLAYMEDIA_HEIGHT = isChromeOS === true ? 50 : isNUC === true ? 50 : isWindows === true ? 50 : 50;

const CHROMEOSANDROIDBRIDGE_PING_INTERVAL = 5000;
const APP_CHECKCLOSED_INTERVAL = 100;

const CHROMEOSANDROIDBRIDGE_TIMEOUT = 2500;

const apps =
{
    whiteboard:
    {
        url: 'https://whiteboard.explaineverything.com?singlePlayer=true',

        width: window.screen.width,
        height: window.screen.height,

        window: null
    },
    annotate:
    {
        urlAndroid: 'http://100.115.92.2:8080/api/open?app=annotate',
        url: 'https://annotate.one.prometheanworld.com/1',

        width: window.screen.width,
        height: window.screen.height,

        window: null
    },
    timer:
    {
        url: 'https://timer.one.prometheanworld.com/1',

        width: 600,
        height: 600,

        window: null
    },
    spinner:
    {
        url: 'https://spinner.one.prometheanworld.com/1',

        width: 850,
        height: 850,

        window: null
    },
    screenShare:
    {
        urlAndroid: 'http://100.115.92.2:8080/api/open?app=screenshare',
        url: 'screen-share.html',

        width: 400,
        height: 125,

        window: null
    }
};

const appDivTabOrder = [ 'WhiteboardAppDiv', 'AnnotateAppDiv', 'TimerAppDiv', 'SpinnerAppDiv', 'ScreenShareAppDiv' ];

let appDivTabOrderIndex = 0;

const main = async () =>
{
    window.addEventListener('load', async (event) =>
    {
        const div = document.getElementById(appDivTabOrder[appDivTabOrderIndex]);

        const options =
        {
            preventScroll: true,
            focusVisible: true
        };

        div.focus(options);

        if (chrome.runtime !== undefined)
        {
            const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'load', data: { width: WIDTH, height: HEIGHT, availHeight: AVAIL_HEIGHT, isChromeOS } });

            console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

            // Do something
        }
    });

    window.addEventListener('resize', (event) =>
    {
        let height = HEIGHT;

        if (apps.annotate.window !== null)
            height += GETDISPLAYMEDIA_HEIGHT;

        window.moveTo(0, (AVAIL_HEIGHT - height));
        window.resizeTo(WIDTH, height);
    });

    const openWhiteboardApp = async () =>
    {
        if (apps.whiteboard.window === null)
        {
            const windowFeatures = `left=0,top=0,width=${ apps.whiteboard.width },height=${ apps.whiteboard.height },popup`;

            apps.whiteboard.window = window.open(apps.whiteboard.url, 'Whiteboard', windowFeatures);

            const intervalId = window.setInterval(async () =>
            {
                if (apps.whiteboard.window.closed === true)
                {
                    window.clearInterval(intervalId);

                    apps.whiteboard.window = null;

                    if (chrome.runtime !== undefined)
                    {
                        const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'close', data: { } });

                        console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

                        // Do something
                    }
                }
            }, APP_CHECKCLOSED_INTERVAL);
        }

        if (chrome.runtime !== undefined)
        {
            const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'open', data: { } });

            console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

            // Do something
        }
    };

    const openAnnotateApp = async () =>
    {
        let error = true;

        const div = document.getElementById('AnnotateAppDiv');

        div.style.opacity = 0.5;
        div.style.pointerEvents = 'none';

        if (chrome.runtime !== undefined)
        {
            const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'refocus', data: { } });

            console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

            // Do something
        }

        const url = apps.annotate.urlAndroid;

        console.log(`openAnnotateApp(): url=${ url }`);

        const options = { timeout: CHROMEOSANDROIDBRIDGE_TIMEOUT };

        try
        {
            const response = await axios.get(url, options);

            if (response.status === 200)
            {
                let data = response.data;

                if (typeof data === 'string')
                    data = JSON.parse(data);

                console.log(`openAnnotateApp(): response.data=${ JSON.stringify(data) }`);

                error = data.error;
            }
        }

        catch (exception) { }

        div.style.opacity = 1.0;
        div.style.pointerEvents = 'auto';

        if (error === false)
        {
            if (apps.annotate.window !== null)
                apps.annotate.window.close();

            if (chrome.runtime !== undefined)
            {
                const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'open', data: { } });

                console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

                // Do something
            }
        }
        else
        {
            if (apps.annotate.window === null)
            {
                const windowFeatures = `left=0,top=0,width=${ apps.annotate.width },height=${ apps.annotate.height },popup`;

                apps.annotate.window = window.open(apps.annotate.url, 'Annotate', windowFeatures);

                const intervalId = window.setInterval(async () =>
                {
                    if (apps.annotate.window.closed === true)
                    {
                        window.clearInterval(intervalId);

                        apps.annotate.window = null;

                        if (chrome.runtime !== undefined)
                        {
                            const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'close', data: { } });

                            console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

                            // Do something
                        }
                    }
                }, APP_CHECKCLOSED_INTERVAL);
            }

            if (chrome.runtime !== undefined)
            {
                const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'open', data: { } });

                console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

                // Do something
            }
        }
    };

    const openTimerApp = async () =>
    {
        if (apps.timer.window === null)
        {
            const windowFeatures = `left=0,top=0,width=${ apps.timer.width },height=${ apps.timer.height },popup`;

            apps.timer.window = window.open(apps.timer.url, 'Timer', windowFeatures);

            const intervalId = window.setInterval(async () =>
            {
                if (apps.timer.window.closed === true)
                {
                    window.clearInterval(intervalId);

                    apps.timer.window = null;

                    if (chrome.runtime !== undefined)
                    {
                        const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'close', data: { } });

                        console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

                        // Do something
                    }
                }
            }, APP_CHECKCLOSED_INTERVAL);
        }

        if (chrome.runtime !== undefined)
        {
            const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'open', data: { } });

            console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

            // Do something
        }
    };

    const openSpinnerApp = async () =>
    {
        if (apps.spinner.window === null)
        {
            const windowFeatures = `left=0,top=0,width=${ apps.spinner.width },height=${ apps.spinner.height },popup`;

            apps.spinner.window = window.open(apps.spinner.url, 'Spinner', windowFeatures);

            const intervalId = window.setInterval(async () =>
            {
                if (apps.spinner.window.closed === true)
                {
                    window.clearInterval(intervalId);

                    apps.spinner.window = null;

                    if (chrome.runtime !== undefined)
                    {
                        const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'close', data: { } });

                        console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

                        // Do something
                    }
                }
            }, APP_CHECKCLOSED_INTERVAL);
        }

        if (chrome.runtime !== undefined)
        {
            const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'open', data: { } });

            console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

            // Do something
        }
    };

    const openScreenShareApp = async () =>
    {
        let error = true;

        const div = document.getElementById('ScreenShareAppDiv');

        div.style.opacity = 0.5;
        div.style.pointerEvents = 'none';

        const url = apps.screenShare.urlAndroid;

        console.log(`openScreenShareApp(): url=${ url }`);

        const options = { timeout: CHROMEOSANDROIDBRIDGE_TIMEOUT };

        try
        {
            const response = await axios.get(url, options);

            if (response.status === 200)
            {
                let data = response.data;

                if (typeof data === 'string')
                    data = JSON.parse(data);

                console.log(`openScreenShareApp(): response.data=${ JSON.stringify(data) }`);

                error = data.error;
            }
        }

        catch (exception) { }

        div.style.opacity = 1.0;
        div.style.pointerEvents = 'auto';

        if (error === false)
        {
            if (apps.screenShare.window !== null)
                apps.screenShare.window.close();

            if (chrome.runtime !== undefined)
            {
                const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'open', data: { } });

                console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

                // Do something
            }
        }
        else
        {
            if (apps.screenShare.window === null)
            {
                const windowFeatures = `left=0,top=0,width=${ apps.screenShare.width },height=${ apps.screenShare.height },popup`;

                apps.screenShare.window = window.open(apps.screenShare.url, 'Screen Share', windowFeatures);

                const intervalId = window.setInterval(async () =>
                {
                    if (apps.screenShare.window.closed === true)
                    {
                        window.clearInterval(intervalId);

                        apps.screenShare.window = null;

                        if (chrome.runtime !== undefined)
                        {
                            const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'close', data: { } });

                            console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

                            // Do something
                        }
                    }
                }, APP_CHECKCLOSED_INTERVAL);
            }

            if (chrome.runtime !== undefined)
            {
                const response = await chrome.runtime.sendMessage({ sender: 'launcher', type: 'open', data: { } });

                console.log(`chrome.runtime.sendMessage((response) => {}): sender=${ response.sender }, type=${ response.type }`);

                // Do something
            }
        }
    };

    window.addEventListener('keydown', async (event) =>
    {
        let div;

        const options =
        {
            preventScroll: true,
            focusVisible: true
        };

        if (event.key === 'ArrowLeft')
        {
            console.log('window.on(keydown): ArrowLeft');

            --appDivTabOrderIndex;

            if (appDivTabOrderIndex < 0)
                appDivTabOrderIndex = appDivTabOrder.length - 1;

            div = document.getElementById(appDivTabOrder[appDivTabOrderIndex]);

            div.focus(options);
        }
        else if (event.key === 'ArrowRight')
        {
            console.log('window.on(keydown): ArrowRight');

            ++appDivTabOrderIndex;

            if (appDivTabOrderIndex == appDivTabOrder.length)
                appDivTabOrderIndex = 0;

            div = document.getElementById(appDivTabOrder[appDivTabOrderIndex]);

            div.focus(options);
        }
        else if (event.key === 'Enter')
        {
            console.log('window.on(keydown): Enter');

            div = document.getElementById(appDivTabOrder[appDivTabOrderIndex]);

            if (div.id === 'WhiteboardAppDiv')
                openWhiteboardApp();
            else if (div.id === 'AnnotateAppDiv')
                openAnnotateApp();
            else if (div.id === 'TimerAppDiv')
                openTimerApp();
            else if (div.id === 'SpinnerAppDiv')
                openSpinnerApp();
            else if (div.id === 'ScreenShareAppDiv')
                openScreenShareApp();
            else { }
        }
        else { }
    });

    const intervalId = window.setInterval(async () =>
    {
        const timestamp = Date.now();

        const url = `http://100.115.92.2:8080/api/ping?timestamp=${ timestamp }`;

        console.log(`window.setInterval(() => {}): url=${ url }`);

        const options = { timeout: CHROMEOSANDROIDBRIDGE_TIMEOUT };

        try
        {
            const response = await axios.get(url, options);

            if (response.status === 200)
            {
                let data = response.data;

                if (typeof data === 'string')
                    data = JSON.parse(data);

                console.log(`window.setInterval(() => {}): response.data=${ JSON.stringify(data) }`);

                // Do something
            }
        }

        catch (exception) { }
    }, CHROMEOSANDROIDBRIDGE_PING_INTERVAL);

    const refocus = () =>
    {
        // TEMPORARY
        /* const div = document.getElementById(appDivTabOrder[appDivTabOrderIndex]);

        const options =
        {
            preventScroll: true,
            focusVisible: true
        };

        div.focus(options); */

        const a = document.getElementById('DeepLinkTestAppA');

        a.focus();
        // TEMPORARY
    };

    const div = document.getElementById('Container');

    div.addEventListener('click', (event) =>
    {
        refocus();
    });

    appDivTabOrder.forEach((appDiv, index) =>
    {
        const div = document.getElementById(appDiv);

        div.addEventListener('click', (event) =>
        {
            const id = event.currentTarget.id;

            appDivTabOrderIndex = appDivTabOrder.indexOf(id);

            refocus();

            if (id === 'WhiteboardAppDiv')
                openWhiteboardApp();
            else if (id === 'AnnotateAppDiv')
                openAnnotateApp();
            else if (id === 'TimerAppDiv')
                openTimerApp();
            else if (id === 'SpinnerAppDiv')
                openSpinnerApp();
            else if (id === 'ScreenShareAppDiv')
                openScreenShareApp();
            else { }
        });
    });

    refocus();
};

main();
