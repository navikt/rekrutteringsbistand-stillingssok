import fetchMock, { MockOptionsMethodPost } from 'fetch-mock';
import { stillingssøkProxy } from './api';
import { resultat } from './mock-data';

const adsUrl = `${stillingssøkProxy}/stilling/_search`;

const logg = (url: string, options: MockOptionsMethodPost, response: any) => {
    console.info(
        `Mock ${options.method} mot ${url} med body`,
        JSON.parse(options.body as any),
        'Response:',
        response
    );

    return response;
};

fetchMock.config.fallbackToNetwork = true;
fetchMock.post(adsUrl, (url: string, options: MockOptionsMethodPost) =>
    logg(url, options, resultat)
);
