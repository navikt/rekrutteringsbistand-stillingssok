import React, { FunctionComponent, useEffect, useState } from 'react';
import { History } from 'history';
import { Respons } from './elasticSearchTyper';
import { useLocation } from 'react-router-dom';
import { hentSøkekriterier } from './søk/søkefelt/urlUtils';
import { lagQuery } from './api/queries';
import { søk } from './api/api';
import Søk from './søk/Søk';
import Stillingsliste from './stillingsliste/Stillingsliste';
import './App.less';
import { Publisert } from './søk/HvorErAnnonsenPublisert';

export type Søkekriterier = {
    tekst: string;
    publisert: Publisert;
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
            const query = lagQuery(søkekriterier);
            setRespons(await søk(query));
        };

        brukQuery();
    }, [location.search]);

    return (
        <div className="app">
            <Søk />
            {respons && <Stillingsliste esRespons={respons} />}
        </div>
    );
};

export default App;
