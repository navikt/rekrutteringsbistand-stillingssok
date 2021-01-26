import React, { FunctionComponent, useState } from 'react';

import { useSøk } from './api/api';
import { alleStillingerQuery, generellQuery } from './api/queries';
import { Query } from './elasticSearchTyper';
import Søkefelt from './søkefelt/Søkefelt';
import './App.less';
import { Link } from 'react-router-dom';

export type AppProps = {
    navKontor: string | null;
};

const App: FunctionComponent<AppProps> = ({ navKontor }) => {
    const [query, setQuery] = useState<Query>(alleStillingerQuery);
    const { data, error } = useSøk(query);

    const stillinger = data?.hits.hits;

    const onSøk = (tekst: string) => {
        setQuery(generellQuery(tekst));
    };

    return (
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
    );
};

export default App;
