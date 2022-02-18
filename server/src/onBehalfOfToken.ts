type OboToken = {
    access_token: string;
    expires_in: number;
    ext_expires_in: number;
    token_type: string;
};

type CachetOboToken = {
    token: OboToken;
    expires: number;
};

type Scope = string;
type AccessToken = string;

const tokenCache: Record<Scope, Record<AccessToken, CachetOboToken>> = {};

export async function hentOnBehalfOfToken(accessToken: string, scope: string) {
    console.log('hentOnBehalfOfToken');
    const oboTokenFraCache = tokenCache[scope]?.[accessToken];

    if (oboTokenFraCache && tokenErFremdelesGyldig(oboTokenFraCache)) {
        console.log('hentOnBehalfOfToken: returnerer fra cache');
        return oboTokenFraCache.token;
    } else {
        const nyttOboToken = await hentNyttOnBehalfOfToken(accessToken, scope);
        console.log('hentOnBehalfOfToken: hentet nytt token');
        const expires = Date.now() + nyttOboToken.expires_in * 1000;
        console.log('hentOnBehalfOfToken: satt expiry token');

        if (!tokenCache[scope]) {
            tokenCache[scope] = {};
        }

        console.log('hentOnBehalfOfToken: init greier');

        tokenCache[scope][accessToken] = {
            token: nyttOboToken,
            expires,
        };

        console.log('hentOnBehalfOfToken: har satt greier');

        console.log('hentOnBehalfOfToken: returnerer nytt');
        return nyttOboToken;
    }
}

async function hentNyttOnBehalfOfToken(accessToken: string, scope: string): Promise<OboToken> {
    console.log('hentNyttOnBehalfOfToken');

    const formData = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        scope,
        client_id: process.env.AZURE_APP_CLIENT_ID,
        client_secret: process.env.AZURE_APP_CLIENT_SECRET,
        assertion: accessToken,
        requested_token_use: 'on_behalf_of',
    };

    console.log('hentNyttOnBehalfOfToken med formdata', formData);

    const url = process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT;

    console.log('hentNyttOnBehalfOfToken med url', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Fikk ikke gyldig OBO-token');
        }
    } catch (e) {
        throw new Error('Feil ved henting av nytt OBO-token');
    }
}

function tokenErFremdelesGyldig(token: CachetOboToken) {
    return token.expires >= Date.now() - 5000;
}
