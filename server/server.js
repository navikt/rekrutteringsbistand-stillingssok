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
    app.get(`/internal/isAlive`, (req, res) => res.sendStatus(200));
    app.get(`/internal/isReady`, (req, res) => res.sendStatus(200));

    app.use(`${basePath}/static`, corsMiddleware, express.static(buildPath + '/static'));

    app.use(
        `${basePath}/asset-manifest.json`,
        corsMiddleware,
        express.static(`${buildPath}/asset-manifest.json`)
    );

    app.use(`${basePath}/*`, ensureLoggedIn);

    app.use(
        `${basePath}/stillingssok-proxy`,
        corsMiddleware,
        setupProxy(`${basePath}/stillingssok-proxy`, process.env.STILLINGSOK_PROXY_URL)
    );

    app.use(
        `${basePath}/stilling-api`,
        corsMiddleware,
        setupProxy(`${basePath}/stilling-api`, process.env.STILLING_API_URL)
    );

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

const userIsLoggedIn = (req, res) => {
    console.log(
        'Authorization header:',
        req.headers.authorization,
        'Resten av headers:',
        req.headers
    );

    return req.headers.authorization;
};

const ensureLoggedIn = (req, res, next) => {
    if (userIsLoggedIn(req, res)) {
        next();
    } else {
        res.redirect(`/oauth2/login?${req.originalUrl}`);
    }
};

startServer();
