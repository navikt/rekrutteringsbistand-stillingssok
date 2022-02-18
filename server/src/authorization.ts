import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { tokenIsValid } from './azureAd';
import fetch from 'node-fetch';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const retrieveToken = (headers: IncomingHttpHeaders) =>
    headers.authorization?.replace('Bearer ', '');

const userIsLoggedIn = async (req: Request): Promise<boolean> => {
    const token = retrieveToken(req.headers);
    console.log('Authorization header er definert:', !!token);

    return token && (await tokenIsValid(token));
};

export const ensureLoggedIn: Middleware = async (req, res, next) => {
    if (await userIsLoggedIn(req)) {
        next();
    } else {
        res.status(401).send('Bruker er ikke logget inn');
    }
};

export const removeIssoIdToken: Middleware = async (req, _, next) => {
    console.log('Mottok cookies:', req.cookies);
    req.cookies['isso-idtoken'] = undefined;
    next();
};

type CachetOboToken = {
    token: OboToken;
    expires: number;
};

type NavIdent = string;

const oboTokenCache: Record<string, Record<NavIdent, CachetOboToken>> = {};

const tokenErFremdelesGyldig = (token: CachetOboToken) => token.expires >= Date.now() - 5000;

const hentNyttOboToken = async (accessToken: string, scope: string): Promise<OboToken> => {
    console.log('Bruker accessToken til å hente OBO-token');

    const url = process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT;
    const formData = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        scope: scope,
        client_id: process.env.AZURE_APP_CLIENT_ID,
        client_secret: process.env.AZURE_APP_CLIENT_SECRET,
        assertion: accessToken,
        requested_token_use: 'on_behalf_of',
    };

    console.log('Henter OBO token med innstillinger:', formData);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
    });

    if (response.ok) {
        const token = await response.json();

        console.log('Fikk OBO-token:', token);
        return token;
    } else {
        throw new Error('Klarte ikke å hente nytt OBO-token');
    }
};

const hentOboToken = async (accessToken: string, scope: string) => {
    const oboTokenFraCache = oboTokenCache[scope]?.[accessToken];

    if (oboTokenFraCache && tokenErFremdelesGyldig(oboTokenFraCache)) {
        console.log('Bruker token fra cache som utløper', new Date(oboTokenFraCache.expires));
        return oboTokenFraCache.token;
    } else {
        const nyttOboToken = await hentNyttOboToken(accessToken, scope);
        const expires = Date.now() + nyttOboToken.expires_in * 1000;

        console.log('Fikk nytt OBO-token som utløper', expires);

        if (!oboTokenCache[scope]) {
            oboTokenCache[scope] = {};
        }

        oboTokenCache[scope][accessToken] = {
            token: nyttOboToken,
            expires,
        };

        return nyttOboToken;
    }
};

export const setOnBehalfOfToken =
    (scope: string) => async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = retrieveToken(req.headers);

        if (!accessToken) {
            res.status(500).send('Kan ikke be om OBO-token siden accessToken ikke finnes');
        } else {
            try {
                const token = await hentOboToken(accessToken, scope);

                req.headers.authorization = `Bearer ${token.access_token}`;
                next();
            } catch (e) {
                res.status(500).send('Feil ved henting av OBO-token');
            }
        }
    };

type OboToken = {
    access_token: string;
    expires_in: number;
    ext_expires_in: number;
    token_type: string;
};
