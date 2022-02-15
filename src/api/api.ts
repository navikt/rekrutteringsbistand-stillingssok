import { Query, Respons } from '../elasticSearchTyper';
import StandardsøkDto from '../søk/standardsøk/Standardsøk';
import { getMiljø } from '../utils/sentryUtils';

const hentServerIngress = (): string => {
    switch (getMiljø()) {
        case 'prod-gcp':
            return 'https://rekrutteringsbistand-stillingssok.intern.nav.no';
        case 'dev-gcp':
            return 'https://rekrutteringsbistand-stillingssok.dev.intern.nav.no';
        default:
            return '';
    }
};

const serverBaseUrl = hentServerIngress();

export const stillingssøkProxy = `${serverBaseUrl}/stillingssok-proxy`;
export const stillingApi = `${serverBaseUrl}/stilling-api`;

if (process.env.REACT_APP_MOCK) {
    require('../mock-api/mock-api.ts');
}

export const søk = async (query: Query): Promise<Respons> => {
    const respons = await post(`${stillingssøkProxy}/stilling/_search`, query);

    if (respons.status === 403) {
        throw Error('Er ikke logget inn');
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
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
