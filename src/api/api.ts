import { Query, Respons } from '../domene/elasticSearchTyper';
import StandardsøkDto from '../filter/standardsøk/Standardsøk';

export const stillingssøkProxy = `/stillingssok-proxy`;
export const stillingApi = `/stilling-api`;

export const søk = async (query: Query, forklarScore: boolean = false): Promise<Respons> => {
    const url = `${stillingssøkProxy}/stilling/_search`;
    const urlMedParams = forklarScore ? `${url}?explain=true` : url;
    const respons = await post(urlMedParams, query);

    if (respons.status === 401) {
        videresendTilInnlogging();
    } else if (respons.status === 403) {
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

    if (respons.status === 401) {
        videresendTilInnlogging();
    } else if (respons.ok) {
        return await respons.json();
    }

    throw Error(`Klarte ikke å hente standardsøk. ${logErrorResponse(respons)}`);
};

export const oppdaterStandardsøk = async (
    standardsøk: URLSearchParams
): Promise<StandardsøkDto> => {
    const respons = await put(`${stillingApi}/standardsok`, {
        søk: standardsøk.toString(),
    });

    if (respons.status === 401) {
        videresendTilInnlogging();
    } else if (respons.ok) {
        return await respons.json();
    }

    throw Error(`Klarte ikke å oppdatere standardsøk. ${logErrorResponse(respons)}`);
};

const logErrorResponse = (respons: Response) => {
    return `Statuskode: ${respons.status}, Statustekst: ${respons.statusText}, URL: ${respons.url}`;
};

export const post = (url: string, body: object) => jsonRequest(url, body, 'POST');
const put = (url: string, body: object) => jsonRequest(url, body, 'PUT');

const jsonRequest = (url: string, body?: object, method: string = 'GET') =>
    fetch(url, {
        body: JSON.stringify(body),
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const videresendTilInnlogging = () => {
    window.location.href = `/oauth2/login?redirect=${window.location.pathname}`;
};
