import amplitudeJs, { AmplitudeClient } from 'amplitude-js';

const bucketIdDev = '55477baea93c5227d8c0f6b813653615';
const bucketIdProd = '3a6fe32c3457e77ce81c356bb14ca886';

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
