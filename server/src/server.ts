import path from 'path';
import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { initializeAzureAd } from './azureAd';
import { ensureLoggedIn, setOnBehalfOfToken } from './authorization';

const app = express();

const port = process.env.PORT || 3000;

const basePath = '/rekrutteringsbistand-stillingssok';
const buildPath = path.join(__dirname, '../build');

const cluster = process.env.NAIS_CLUSTER_NAME;
const fssMiljø = cluster === 'prod-gcp' ? 'prod-fss' : 'dev-fss';

// Krever ekstra miljøvariabler, se nais.yaml
const setupProxy = (fraPath: string, tilTarget: string) =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        pathRewrite: (path) => path.replace(fraPath, ''),
    });

const startServer = () => {
    app.get(
        [`${basePath}/internal/isAlive`, `${basePath}/internal/isReady`],
        (req: Request, res: Response) => res.sendStatus(200)
    );

    app.use(`${basePath}/static`, express.static(buildPath + '/static'));
    app.use(`${basePath}/asset-manifest.json`, express.static(`${buildPath}/asset-manifest.json`));

    app.use(
        `${basePath}/stillingssok-proxy`,
        ensureLoggedIn,
        setOnBehalfOfToken(
            `api://${cluster}.arbeidsgiver.rekrutteringsbistand-stillingssok-proxy/.default`
        ),
        setupProxy(`${basePath}/stillingssok-proxy`, process.env.STILLINGSOK_PROXY_URL)
    );

    app.use(
        `${basePath}/stilling-api`,
        ensureLoggedIn,
        setOnBehalfOfToken(
            `api://${fssMiljø}.arbeidsgiver.rekrutteringsbistand-stilling-api/.default`
        ),
        setupProxy(`${basePath}/stilling-api`, process.env.STILLING_API_URL)
    );

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

initializeAzureAd();

startServer();
