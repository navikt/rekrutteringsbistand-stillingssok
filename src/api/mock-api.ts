import fetchMock, { MockOptionsMethodPost } from 'fetch-mock';
import { stillingssøkProxy } from './api';
import { resultat } from './mock-data';

const adsUrl = `${stillingssøkProxy}/_search`;

const logg = (url: string, options: MockOptionsMethodPost, response: any) => {
    console.info(`Mock ${options.method} mot ${url}:`, response);

    return response;
};

fetchMock.config.fallbackToNetwork = true;
fetchMock.post(
    adsUrl,
    (url: string, options: MockOptionsMethodPost) => logg(url, options, resultat),
    {
        delay: 1000,
    }
);
