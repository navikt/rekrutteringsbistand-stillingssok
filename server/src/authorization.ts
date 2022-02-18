import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { tokenIsValid } from './azureAd';

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

export const setOnBehalfOfToken =
    (scope: string) => async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = retrieveToken(req.headers);

        if (!accessToken) {
            res.status(500).send('Kan ikke be om OBO-token siden accessToken ikke finnes');
        } else {
            console.log('Bruker accessToken til å hente OBO-token');

            const url = process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT;
            const formData = new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                scope: scope,
                client_id: process.env.AZURE_APP_CLIENT_ID,
                client_secret: process.env.AZURE_APP_CLIENT_SECRET,
                assertion: accessToken,
                requested_token_use: 'on_behalf_of',
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Fikk OBO-token!');

                const body = (await response.json()) as OboToken;
                // Cache
                req.headers.authorization = `Bearer ${body.access_token}`;
                next();
            } else {
                res.status(500).send('Feil ved henting av OBO-token');
            }
        }
    };

type OboToken = {
    access_token: string;
    expires_in: string;
    ext_expires_in: string;
    token_type: string;
};
