import React, { ErrorInfo, FunctionComponent } from 'react';
import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Navspa from '@navikt/navspa';

import App from './App';
import Utviklingsapp from './utviklingsapp/Utviklingsapp';
import { BrowserClient, Hub } from '@sentry/react';
import { getMiljø } from './utils/sentryUtils';
import './index.less';

const initSentryClient = () => {
    const client = new BrowserClient({
        dsn: 'https://766bf43f7bd849e4aadc3528a9e94c60@sentry.gc.nav.no/64',
        environment: getMiljø(),
        release: process.env.REACT_APP_SENTRY_RELEASE || 'unknown',
        enabled: getMiljø() === 'dev-fss' || getMiljø() === 'prod-fss',
        autoSessionTracking: false,
        debug: true,
    });

    return new Hub(client);
};

class SentryErrorBoundary extends React.Component<{ hub: Hub }> {
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.hub.run((currentHub: Hub) => {
            currentHub.withScope((scope) => {
                scope.setExtras(errorInfo as any);
                const eventId = currentHub.captureException(error);
                this.setState({ eventId });
            });
        });
    }

    render = () => this.props.children;
}

export const hub = initSentryClient();

const skalEksporteres = process.env.REACT_APP_EXPORT || process.env.NODE_ENV === 'production';

// Alle klassenavn blir prefikset med ".stillingssok" i craco-configen, så også koden
// som brukes under utvikling må wrappes i et element med dette klassenavnet.
export const cssScopeForApp = 'rekbis-stillingssok';

const AppMedCssScope: FunctionComponent = (props: any) => (
    <div className={cssScopeForApp}>
        <SentryErrorBoundary hub={hub}>
            <Router history={props.history}>
                <App {...props} />
            </Router>
        </SentryErrorBoundary>
    </div>
);

if (skalEksporteres) {
    Navspa.eksporter('rekrutteringsbistand-stillingssok', AppMedCssScope);
} else {
    ReactDOM.render(<Utviklingsapp />, document.getElementById('utviklingsapp'));
}
