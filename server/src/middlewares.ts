import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { tokenIsValid } from './azureAd';
import { hentOnBehalfOfToken } from './onBehalfOfToken';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

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

export const setOnBehalfOfToken =
    (scope: string) => async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = retrieveToken(req.headers);

        if (!accessToken) {
            res.status(500).send('Kan ikke be om OBO-token siden access-token ikke finnes');
        } else {
            try {
                const token = await hentOnBehalfOfToken(accessToken, scope);
                console.log('setOnBehalfOfToken: fikk token');

                req.headers.authorization = `Bearer ${token.access_token}`;
                console.log('setOnBehalfOfToken: satt token');
                next();
            } catch (e) {
                res.status(500).send('Feil ved henting av OBO-token: ' + e);
            }
        }
    };

function retrieveToken(headers: IncomingHttpHeaders) {
    return headers.authorization?.replace('Bearer ', '');
}

async function userIsLoggedIn(req: Request): Promise<boolean> {
    const token = retrieveToken(req.headers);
    return token && (await tokenIsValid(token));
}
