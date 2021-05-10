import React, { FunctionComponent } from 'react';
import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Navspa from '@navikt/navspa';
import * as Sentry from '@sentry/react';

import App from './App';
import Utviklingsapp from './utviklingsapp/Utviklingsapp';
import { fjernPersonopplysninger, getMiljø } from './utils/sentryUtils';
import './index.less';
import FeilMedApp from './FeilMedApp';

Sentry.init({
    dsn: 'https://766bf43f7bd849e4aadc3528a9e94c60@sentry.gc.nav.no/64',
    environment: getMiljø(),
    release: process.env.REACT_APP_SENTRY_RELEASE || 'unknown',
    enabled: getMiljø() === 'dev-fss' || getMiljø() === 'prod-fss',
    beforeSend: fjernPersonopplysninger,
    autoSessionTracking: false,
});

const skalEksporteres = process.env.REACT_APP_EXPORT || process.env.NODE_ENV === 'production';

// Alle klassenavn blir prefikset med ".stillingssok" i craco-configen, så også koden
// som brukes under utvikling må wrappes i et element med dette klassenavnet.
export const cssScopeForApp = 'rekbis-stillingssok';

const AppMedCssScope: FunctionComponent = (props: any) => (
    <div className={cssScopeForApp}>
        <Sentry.ErrorBoundary fallback={(error) => <FeilMedApp {...error} />}>
            <Router history={props.history}>
                <App {...props} />
            </Router>
        </Sentry.ErrorBoundary>
    </div>
);

if (skalEksporteres) {
    Navspa.eksporter('rekrutteringsbistand-stillingssok', AppMedCssScope);
} else {
    ReactDOM.render(<Utviklingsapp />, document.getElementById('utviklingsapp'));
}
