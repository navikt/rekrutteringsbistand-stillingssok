import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link, Router } from 'react-router-dom';
import { History } from 'history';

import { søk } from './api/api';
import { alleStillingerQuery, generellQuery } from './api/queries';
import { Query, Respons } from './elasticSearchTyper';
import Søkefelt from './søkefelt/Søkefelt';
import './App.less';

export type AppProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent<AppProps> = ({ navKontor, history }) => {
    const [query, setQuery] = useState<Query>(alleStillingerQuery);
    const [respons, setRespons] = useState<Respons | null>(null);

    useEffect(() => {
        const brukQuery = async () => {
            setRespons(await søk(query));
        };

        brukQuery();
    }, [query]);

    const onSøk = (tekst: string) => {
        setQuery(generellQuery(tekst));
    };

    const stillinger = respons?.hits.hits;

    return (
        <Router history={history}>
            <div className="app">
                <Søkefelt onSøk={onSøk} />
                {stillinger ? (
                    <ul>
                        {stillinger.map((hit) => {
                            const stilling = hit._source.stilling;

                            return (
                                <li key={hit._id}>
                                    <Link to={`/stillinger/stilling/${stilling.uuid}`}>
                                        <code>{stilling.uuid}</code>
                                    </Link>
                                    <span> – {stilling.title}</span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    'Ingen stillinger å vise'
                )}
            </div>
        </Router>
    );
};

export default App;
