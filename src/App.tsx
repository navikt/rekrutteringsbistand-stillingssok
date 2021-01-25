import React, { FunctionComponent, useEffect, useState } from 'react';
import { Respons } from './elasticSearchTyper';
import { hentAlleStillinger } from './api';
import './App.less';

export type AppProps = {
    navKontor: string | null;
};

const App: FunctionComponent<AppProps> = ({ navKontor }) => {
    const [respons, setRespons] = useState<Respons | null>(null);

    useEffect(() => {
        const hent = async () => {
            setRespons(await hentAlleStillinger());
        };

        hent();
    }, []);

    const stillinger = respons?.hits.hits;

    return (
        <div className="app">
            rekbis-stillingssok
            {stillinger ? (
                <ul>
                    {stillinger.map((stilling) => (
                        <li>{stilling._source.title}</li>
                    ))}
                </ul>
            ) : (
                'Ingen stillinger å vise'
            )}
        </div>
    );
};

export default App;
