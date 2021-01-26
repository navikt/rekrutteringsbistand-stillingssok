import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import Navspa from '@navikt/navspa';

import App from './App';
import Utviklingsapp from './utviklingsapp/Utviklingsapp';
import './index.less';

const skalEksporteres = process.env.REACT_APP_EXPORT || process.env.NODE_ENV === 'production';

// Alle klassenavn blir prefikset med ".stillingssok" i craco-configen, så også koden
// som brukes under utvikling må wrappes i et element med dette klassenavnet.
export const cssScopeForApp = 'rekbis-stillingssok';

const AppMedCssScope: FunctionComponent = (props: any) => (
    <div className={cssScopeForApp}>
        <App {...props} />
    </div>
);

if (skalEksporteres) {
    Navspa.eksporter('rekrutteringsbistand-stillingssok', AppMedCssScope);
} else {
    ReactDOM.render(<Utviklingsapp />, document.getElementById('utviklingsapp'));
}
