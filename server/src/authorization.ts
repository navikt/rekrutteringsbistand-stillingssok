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
        console.log('Bruker er ikke logget inn, videresender til /oauth2/login');
        res.redirect(
            `https://${req.hostname}/oauth2/login?redirect=https://${req.hostname}/stillingssok?standardsok`
        );
    }
};
