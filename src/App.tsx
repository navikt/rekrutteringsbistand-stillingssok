import React, { FunctionComponent, useEffect, useState } from 'react';
import { Router, useLocation } from 'react-router-dom';
import { History } from 'history';

import { alleStillingerQuery, generellQuery } from './api/queries';
import { hentSøkekriterier } from './søk/søkefelt/urlUtils';
import { Respons } from './elasticSearchTyper';
import { søk } from './api/api';
import Søk from './søk/Søk';
import Stillingsliste from './stillingliste/Stillingsliste';
import './App.less';

export type Søkekriterier = {
    tekst: string;
    kunInterne: boolean;
};

export type AppProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent<AppProps> = ({ navKontor, history }) => {
    const location = useLocation();
    const [respons, setRespons] = useState<Respons | null>(null);

    useEffect(() => {
        const brukQuery = async () => {
            const søkekriterier = hentSøkekriterier(location.search);
            const query = generellQuery(søkekriterier);

            if (query) {
                setRespons(await søk(query));
            } else {
                setRespons(await søk(alleStillingerQuery));
            }
        };

        brukQuery();
    }, [location.search]);

    return (
        <Router history={history}>
            <div className="app">
                <Søk />
                {respons && <Stillingsliste esRespons={respons} />}
            </div>
        </Router>
    );
};

export default App;
