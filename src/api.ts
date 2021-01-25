import { Respons, Query } from './elasticSearchTyper';

const stillingsøkProxy = '/rekrutteringsbistand-stillingssok/stillingssok-proxy';

export const hentAlleStillinger = async (): Promise<Respons> => {
    const query: Query = {
        query: {
            match_all: {},
        },
    };

    return await søk(query);
};

const søk = async (query: Query): Promise<Respons> => {
    const respons = await post(`${stillingsøkProxy}/_search`, query);

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
