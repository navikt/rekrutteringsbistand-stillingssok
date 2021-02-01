import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import Navspa from '@navikt/navspa';
import * as Sentry from '@sentry/react';

import App from './App';
import Utviklingsapp from './utviklingsapp/Utviklingsapp';
import { fjernPersonopplysninger, getMiljø } from './sentryUtils';
import './index.less';
import { Router } from 'react-router-dom';

Sentry.init({
    dsn: 'https://34e485d3fd9945e29d5f66f11a29f84e@sentry.gc.nav.no/43',
    environment: getMiljø(),
    release: process.env.REACT_APP_SENTRY_RELEASE || 'unknown',
    enabled: getMiljø() === 'dev-fss' || getMiljø() === 'prod-fss',
    beforeSend: fjernPersonopplysninger,
});

const skalEksporteres = process.env.REACT_APP_EXPORT || process.env.NODE_ENV === 'production';

// Alle klassenavn blir prefikset med ".stillingssok" i craco-configen, så også koden
// som brukes under utvikling må wrappes i et element med dette klassenavnet.
export const cssScopeForApp = 'rekbis-stillingssok';

const AppMedCssScope: FunctionComponent = (props: any) => (
    <div className={cssScopeForApp}>
        <Sentry.ErrorBoundary>
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
