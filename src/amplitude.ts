import amplitudeJs, { AmplitudeClient } from 'amplitude-js';

const bucketIdDev = '6ed1f00aabc6ced4fd6fcb7fcdc01b30';
const bucketIdProd = 'a8243d37808422b4c768d31c88a22ef4';

const getApiKey = () => {
    return window.location.href.includes('dev.intern.nav.no') ? bucketIdDev : bucketIdProd;
};

const client: AmplitudeClient = amplitudeJs.getInstance();

client.init(getApiKey(), '', {
    apiEndpoint: 'amplitude.nav.no/collect',
    saveEvents: false,
    includeUtm: true,
    batchEvents: false,
    includeReferrer: false,
});

export const sendEvent = (område: string, hendelse: string, data?: Object): void => {
    client.logEvent(['#rekrutteringsbistand', område, hendelse].join('-'), data);
};
