const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
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
    origin: [
        'https://rekrutteringsbistand.nais.preprod.local',
        'https://rekrutteringsbistand.nais.adeo.no',
    ],
});

const startServer = () => {
    app.use(setupProxy(`${basePath}/stillingssok-proxy`, process.env.STILLINGSOK_PROXY_URL));
    app.use(setupProxy(`${basePath}/stilling-api`, process.env.STILLING_API_URL));

    app.use(`${basePath}/static`, corsMiddleware, express.static(buildPath + '/static'));
    app.use(
        `${basePath}/asset-manifest.json`,
        corsMiddleware,
        express.static(`${buildPath}/asset-manifest.json`)
    );

    app.get(`${basePath}/internal/isAlive`, (req, res) => res.sendStatus(200));
    app.get(`${basePath}/internal/isReady`, (req, res) => res.sendStatus(200));

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

startServer();
