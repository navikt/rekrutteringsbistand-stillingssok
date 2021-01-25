import { Respons, Query } from '../elasticSearchTyper';

export const stillingssøkProxy = '/rekrutteringsbistand-stillingssok/stillingssok-proxy';

if (process.env.REACT_APP_MOCK) {
    require('./mock-api.ts');
}

export const hentAlleStillinger = async (): Promise<Respons> => {
    const query: Query = {
        query: {
            match_all: {},
        },
    };

    return await søk(query);
};

const søk = async (query: Query): Promise<Respons> => {
    const respons = await post(`${stillingssøkProxy}/_search`, query);

    if (respons.status !== 200) {
        throw Error('Klarte ikke å gjøre et søk');
    }

    return respons.json();
};

const post = (url: string, body: object) => {
    return fetch(url, {
        body: JSON.stringify(body),
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
