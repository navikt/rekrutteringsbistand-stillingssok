import {initializeAzureAd} from "./azureAd";
import {ensureLoggedIn, opprettCookieFraAuthorizationHeader} from "./authorization";

const path = require('path');
const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3000;

const basePath = '/rekrutteringsbistand-stillingssok';
const buildPath = path.join(__dirname, '../build');

// Krever ekstra miljøvariabler, se nais.yaml
const setupProxy = (fraPath, tilTarget) =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        pathRewrite: (path) => path.replace(fraPath, ''),
    });

const corsMiddleware = cors({
    credentials: true,
    origin: [
        'https://rekrutteringsbistand.dev.intern.nav.no',
        'https://rekrutteringsbistand.intern.nav.no',
    ],
});

const startServer = () => {
    app.get([`/internal/isAlive`, `/internal/isReady`], (_, res) => res.sendStatus(200));

    app.use(`${basePath}/static`, corsMiddleware, express.static(buildPath + '/static'));
    app.use(`${basePath}/asset-manifest.json`, corsMiddleware, express.static(`${buildPath}/asset-manifest.json`));

    app.use(`/*`, ensureLoggedIn, opprettCookieFraAuthorizationHeader);

    app.use(
        `/stillingssok-proxy`,
        setupProxy(`/stillingssok-proxy`, process.env.STILLINGSOK_PROXY_URL)
    );

    app.use(`/stilling-api`, setupProxy(`/stilling-api`, process.env.STILLING_API_URL));

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

initializeAzureAd();

startServer();
