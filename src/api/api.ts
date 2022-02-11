import { Query, Respons } from '../elasticSearchTyper';
import StandardsøkDto from '../søk/standardsøk/Standardsøk';
import { getMiljø } from '../utils/sentryUtils';

const hentProxyBaseUrl = (): string => {
    switch (getMiljø()) {
        case 'prod-fss':
            return 'https://rekrutteringsbistand.intern.nav.no';
        case 'dev-fss':
            return 'https://rekrutteringsbistand.dev.intern.nav.no';
        default:
            return '';
    }
};

export const stillingssøkProxy = `${hentProxyBaseUrl()}/rekrutteringsbistand-stillingssok/stillingssok-proxy`;
export const stillingApi = `${hentProxyBaseUrl()}/rekrutteringsbistand-stillingssok/stilling-api`;

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

const post = (url: string, body: object) => jsonRequestUtenCORS(url, body, 'POST');
const put = (url: string, body: object) => jsonRequestUtenCORS(url, body, 'PUT');

const jsonRequestUtenCORS = (url: string, body: object, method: string) =>
    fetch(url, {
        body: JSON.stringify(body),
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    });

/*
const redirectTilLogin = () => {
    const loginserviceUrl =
        getMiljø() === 'dev-fss'
            ? 'https://loginservice.nais.preprod.local/login'
            : 'https://loginservice.nais.adeo.no/login';

    window.location.href = `${loginserviceUrl}?redirect=${window.location.href}`;
};
*/
