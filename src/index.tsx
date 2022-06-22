import React, { FunctionComponent } from 'react';
import { createRoot } from 'react-dom/client';
import Navspa from '@navikt/navspa';
import * as Sentry from '@sentry/react';

import App from './App';
import Utviklingsapp from './utviklingsapp/Utviklingsapp';
import { fjernPersonopplysninger, getMiljø } from './utils/sentryUtils';
import FeilMedApp from './FeilMedApp';
import Router from './Router';
import '@navikt/ds-css';
import './index.css';

Sentry.init({
    dsn: 'https://766bf43f7bd849e4aadc3528a9e94c60@sentry.gc.nav.no/64',
    environment: getMiljø(),
    release: process.env.REACT_APP_SENTRY_RELEASE || 'unknown',
    enabled: getMiljø() === 'dev-gcp' || getMiljø() === 'prod-gcp',
    beforeSend: fjernPersonopplysninger,
    autoSessionTracking: false,
});

const skalEksporteres = process.env.REACT_APP_EXPORT || process.env.NODE_ENV === 'production';

const AppMedRouter: FunctionComponent = (props: any) => (
    <Sentry.ErrorBoundary fallback={(error) => <FeilMedApp {...error} />}>
        <Router history={props.history}>
            <App {...props} />
        </Router>
    </Sentry.ErrorBoundary>
);

if (skalEksporteres) {
    Navspa.eksporter('rekrutteringsbistand-stillingssok', AppMedRouter);
} else {
    const app = document.getElementById('utviklingsapp');
    const root = createRoot(app!);

    root.render(<Utviklingsapp />);
}
