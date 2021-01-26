import React, { FunctionComponent, useState } from 'react';
import { Link, Router } from 'react-router-dom';
import { History } from 'history';

import { useSøk } from './api/api';
import { alleStillingerQuery, generellQuery } from './api/queries';
import { Query } from './elasticSearchTyper';
import Søkefelt from './søkefelt/Søkefelt';
import './App.less';

export type AppProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent<AppProps> = ({ navKontor, history }) => {
    const [query, setQuery] = useState<Query>(alleStillingerQuery);
    const { data, error } = useSøk(query);

    const stillinger = data?.hits.hits;

    const onSøk = (tekst: string) => {
        setQuery(generellQuery(tekst));
    };

    return (
        <Router history={history}>
            <div className="app">
                <Søkefelt onSøk={onSøk} />
                {error && <span>Det skjedde en feil</span>}
                {!data && !error && <span>Laster inn stillinger...</span>}
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
