import React, { FunctionComponent } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'react-router-dom';
import Navspa from '@navikt/navspa';
import * as Sentry from '@sentry/react';

import Utviklingsapp from './utviklingsapp/Utviklingsapp';
import FeilMedApp from './FeilMedApp';
import App from './App';
import { fjernPersonopplysninger, getMiljø } from './utils/sentryUtils';
import './index.css';

Sentry.init({
    dsn: 'https://766bf43f7bd849e4aadc3528a9e94c60@sentry.gc.nav.no/64',
    environment: getMiljø(),
    release: import.meta.env.VITE_SENTRY_RELEASE || 'unknown',
    enabled: getMiljø() === 'dev-gcp' || getMiljø() === 'prod-gcp',
    beforeSend: fjernPersonopplysninger,
    autoSessionTracking: false,
});

const skalEksporteres = import.meta.env.VITE_EXPORT || import.meta.env.MODE === 'production';

const AppMedRouter: FunctionComponent = (props: any) => (
    <Sentry.ErrorBoundary fallback={(error) => <FeilMedApp {...error} />}>
        <Router navigator={props.history} location={props.history.location}>
            <App {...props} />
        </Router>
    </Sentry.ErrorBoundary>
);

const setupMock = async () => {
    if (import.meta.env.VITE_MOCK) {
        await import('./mock-api/mock-api');
    }
};

if (skalEksporteres) {
    Navspa.eksporter('rekrutteringsbistand-stillingssok', AppMedRouter);
} else {
    await setupMock();

    const app = document.getElementById('utviklingsapp');
    const root = createRoot(app!);

    root.render(<Utviklingsapp />);
}
