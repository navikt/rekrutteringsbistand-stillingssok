import React, { FunctionComponent, useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { History } from 'history';

import { søk } from './api/api';
import { alleStillingerQuery, generellQuery } from './api/queries';
import { Query, Respons } from './elasticSearchTyper';
import Søkefelt from './søkefelt/Søkefelt';
import './App.less';
import StillingListe from './stillingliste/StillingListe';
import { hentInputFraUrl } from './søkefelt/urlUtils';

export type AppProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent<AppProps> = ({ navKontor, history }) => {
    const [query, setQuery] = useState<Query>(alleStillingerQuery);
    const [respons, setRespons] = useState<Respons | null>(null);

    useEffect(() => {
        const brukQuery = async () => {
            const inputFraUrl = hentInputFraUrl();
            if (inputFraUrl) {
                const queryForInputFraUrl = generellQuery(inputFraUrl);
                setRespons(await søk(queryForInputFraUrl));
            } else {
                setRespons(await søk(query));
            }
        };

        brukQuery();
    }, [query]);

    const onSøk = (tekst: string) => {
        setQuery(generellQuery(tekst));
    };

    return (
        <Router history={history}>
            <div className="app">
                <Søkefelt onSøk={onSøk} />
                {respons && <StillingListe esRespons={respons} />}
            </div>
        </Router>
    );
};

export default App;
