import fetchMock, { MockRequest, MockResponseFunction } from 'fetch-mock';
import { stillingApi, stillingssøkProxy } from '../api/api';
import { resultat } from './mock-data/stillingssøk';
import { kandidatProxyUrl } from '../kandidatbanner/useKandidat';
import StandardsøkDto from '../filter/standardsøk/Standardsøk';
import standardsøk from './mock-data/standardsøk';
import kandidatsøk from './mock-data/kandidatsøk';

const adsUrl = `${stillingssøkProxy}/stilling/_search`;
const standardsøkUrl = `${stillingApi}/standardsok`;

const logg =
    (response: any): MockResponseFunction =>
    (url, opts) => {
        console.info(`Mock ${opts.method} mot ${url}`, { body: opts.body, response });
        return response;
    };

const putStandardsøk = (url: string, options: MockRequest): StandardsøkDto => {
    const nyttSøk = JSON.parse(options.body as string) as StandardsøkDto;

    return {
        ...standardsøk,
        søk: nyttSøk.søk,
    };
};

fetchMock.config.fallbackToNetwork = false;
fetchMock
    .post(adsUrl, logg(resultat))
    .get(standardsøkUrl, logg(standardsøk))
    .put(standardsøkUrl, (url, opts) => {
        const standardsøk = putStandardsøk(url, opts);
        return logg(standardsøk);
    })
    .post(kandidatProxyUrl, logg(kandidatsøk));
