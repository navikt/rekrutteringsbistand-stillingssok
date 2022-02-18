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

export const hentOnBehalfOfToken = async (accessToken: string, scope: string) => {
    console.log('hentOnBehalfOfToken');
    const oboTokenFraCache = tokenCache[scope]?.[accessToken];

    if (oboTokenFraCache && tokenErFremdelesGyldig(oboTokenFraCache)) {
        console.log('hentOnBehalfOfToken: returnerer fra cache');
        return oboTokenFraCache.token;
    } else {
        const nyttOboToken = await hentNyttOnBehalfOfToken(accessToken, scope);
        const expires = Date.now() + nyttOboToken.expires_in * 1000;

        if (!tokenCache[scope]) {
            tokenCache[scope] = {};
        }

        tokenCache[scope][accessToken] = {
            token: nyttOboToken,
            expires,
        };

        console.log('hentOnBehalfOfToken: returnerer nytt');
        return nyttOboToken;
    }
};

const hentNyttOnBehalfOfToken = async (accessToken: string, scope: string): Promise<OboToken> => {
    console.log('hentNyttOnBehalfOfToken');

    const url = process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT;
    const formData = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        scope: scope,
        client_id: process.env.AZURE_APP_CLIENT_ID,
        client_secret: process.env.AZURE_APP_CLIENT_SECRET,
        assertion: accessToken,
        requested_token_use: 'on_behalf_of',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Klarte ikke å hente nytt OBO-token');
    }
};

const tokenErFremdelesGyldig = (token: CachetOboToken) => token.expires >= Date.now() - 5000;
