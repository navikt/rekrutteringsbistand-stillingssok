import fetchMock from 'fetch-mock';
import { stillingssøkProxy } from './api';
import { resultat } from './mock-data';

const adsUrl = `${stillingssøkProxy}/_search`;

fetchMock.config.fallbackToNetwork = true;
fetchMock.post(adsUrl, resultat);
