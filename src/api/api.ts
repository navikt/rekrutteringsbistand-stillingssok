import { Query, Respons } from '../elasticSearchTyper';
import StandardsøkDto from '../søk/standardsøk/Standardsøk';
import { getMiljø } from '../utils/sentryUtils';

const hentServerIngress = (): string => {
    switch (getMiljø()) {
        case 'prod-fss':
            return 'https://rekrutteringsbistand.intern.nav.no';
        case 'dev-fss':
            return 'https://rekrutteringsbistand.dev.intern.nav.no';
        default:
            return '';
    }
};

const serverBaseUrl = hentServerIngress() + '/rekrutteringsbistand-stillingssok';

export const stillingssøkProxy = `${serverBaseUrl}/rekrutteringsbistand-stillingssok/stillingssok-proxy`;
export const stillingApi = `${serverBaseUrl}/rekrutteringsbistand-stillingssok/stilling-api`;

if (process.env.REACT_APP_MOCK) {
    require('../mock-api/mock-api.ts');
}

export const søk = async (query: Query): Promise<Respons> => {
    const respons = await post(`${stillingssøkProxy}/stilling/_search`, query);

    if (respons.status === 403) {
        // redirectTilLogin();
    } else if (respons.status !== 200) {
        throw Error(`Klarte ikke å gjøre et søk. ${logErrorResponse(respons)}`);
    }

    return respons.json();
};

export const hentStandardsøk = async (): Promise<StandardsøkDto> => {
    const respons = await fetch(`${stillingApi}/standardsok`, {
        method: 'GET',
    });

    if (respons.ok) {
        return await respons.json();
    }

    throw Error(`Klarte ikke å hente standardsøk. ${logErrorResponse(respons)}`);
};

export const oppdaterStandardsøk = async (standardsøk: string): Promise<StandardsøkDto> => {
    const respons = await put(`${stillingApi}/standardsok`, {
        søk: standardsøk,
    });

    if (respons.ok) {
        return await respons.json();
    }

    throw Error(`Klarte ikke å oppdatere standardsøk. ${logErrorResponse(respons)}`);
};

const logErrorResponse = (respons: Response) => {
    return `Statuskode: ${respons.status}, Statustekst: ${respons.statusText}, URL: ${respons.url}`;
};

const post = (url: string, body: object) => jsonRequest(url, body, 'POST');
const put = (url: string, body: object) => jsonRequest(url, body, 'PUT');

const jsonRequest = (url: string, body: object, method: string) =>
    fetch(url, {
        body: JSON.stringify(body),
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    });

/*
const redirectTilLogin = () => {
    const loginEndpoint = `${serverBaseUrl}/oauth2/login`;
    window.location.href = `${loginEndpoint}?redirect=${window.location.href}`;
};
*/
