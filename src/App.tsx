import React, { FunctionComponent } from 'react';

import { alleStillingerQuery, useSøk } from './api/api';
import { Undertittel } from 'nav-frontend-typografi';
import './App.less';

export type AppProps = {
    navKontor: string | null;
};

const App: FunctionComponent<AppProps> = ({ navKontor }) => {
    const { data, error } = useSøk(alleStillingerQuery());

    const stillinger = data?.hits.hits;

    return (
        <div className="app">
            <Undertittel tag="h1">Nytt stillingssøk</Undertittel>
            {error && <span>Det skjedde en feil</span>}
            {!data && !error && <span>Laster inn stillinger...</span>}
            {stillinger ? (
                <ul>
                    {stillinger.map((hit) => (
                        <li key={hit._id}>{hit._source.stilling.title}</li>
                    ))}
                </ul>
            ) : (
                'Ingen stillinger å vise'
            )}
        </div>
    );
};

export default App;
