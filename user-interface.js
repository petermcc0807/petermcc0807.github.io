const Fs = require('fs');
// const Http = require('http');
const Https = require('https');

const Express = require('express');
// const Nocache = require('nocache');

const CERT_PATH = __dirname + '/../cert/localhost.pem';
const CERT_KEY_PATH = __dirname + '/../cert/localhost-key.pem';

// const HOST = '192.168.0.4';
const HOSTS = 'localhost';
const PORT = 10240;

const main = () =>
{
    const express = Express();

    // const nocache = Nocache();

    // express.use(nocache);

    express.get('/', (request, response) =>
    {
        console.log('express.get(/)');

        const path = `${ __dirname }/index.html`;

        response.sendFile(path);
    });

    express.get('*', (request, response) =>
    {
        console.log(`express.get(*): ${ request.originalUrl }`);

        const path = `${ __dirname }/${ request.originalUrl }`;

        response.sendFile(path);
    });

    const options =
    {
        cert: Fs.readFileSync(CERT_PATH),
        key: Fs.readFileSync(CERT_KEY_PATH)
    };

    // const httpServer = Http.createServer(express);
    const httpsServer = Https.createServer(options, express);

    // httpServer.listen(PORT, HOST, () =>
    httpsServer.listen(PORT, HOSTS, () =>
    {
        // console.log(`httpServer.listen(): listening on http://${ HOST }:${ PORT }`);
        console.log(`httpsServer.listen(): listening on https://${ HOSTS }:${ PORT }`);
    });
};

main();
