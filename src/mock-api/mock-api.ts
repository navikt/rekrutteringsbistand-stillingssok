import fetchMock, { MockOptionsMethodPost, MockRequest } from 'fetch-mock';
import { stillingApi, stillingssøkProxy } from '../api/api';
import StandardsøkDto from '../søk/standardsøk/Standardsøk';
import standardsøk from './mock-data/standardsøk';
import { resultat } from './mock-data/stillingssøk';

const adsUrl = `${stillingssøkProxy}/stilling/_search`;
const standardsøkUrl = `${stillingApi}/standardsok`;

const logg = (url: string, options: MockOptionsMethodPost, response: any) => {
    console.info(`Mock ${options.method} mot ${url} med body`, options.body, 'Response:', response);

    return response;
};

const putStandardsøk = (url: string, options: MockRequest): StandardsøkDto => {
    return {
        ...standardsøk,
        søk: options.body as any,
    };
};

fetchMock.config.fallbackToNetwork = true;
fetchMock
    .post(adsUrl, (url: string, options: MockOptionsMethodPost) => logg(url, options, resultat))
    .get(standardsøkUrl, standardsøk)
    .put(standardsøkUrl, putStandardsøk);
