import useSWR from 'swr';
import { Query, Respons } from '../elasticSearchTyper';

export const stillingssøkProxy = '/rekrutteringsbistand-stillingssok/stillingssok-proxy';

if (process.env.REACT_APP_MOCK) {
    require('./mock-api.ts');
}

export const useSøk = (query: Query) => {
    return useSWR(JSON.stringify(query), søk);
};

export const søk = async (query: string): Promise<Respons> => {
    const respons = await post(`${stillingssøkProxy}/_search`, query);

    if (respons.status !== 200) {
        throw Error('Klarte ikke å gjøre et søk');
    }

    return respons.json();
};

const post = (url: string, body: string) => {
    return fetch(url, {
        body,
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
