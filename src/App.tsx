import React, { FunctionComponent, useEffect, useState } from 'react';
import { History } from 'history';
import { Respons } from './elasticSearchTyper';
import { useHistory, useLocation } from 'react-router-dom';
import { byggUrlMedParam, hentSøkekriterier, QueryParam } from './søk/søkefelt/urlUtils';
import { lagQuery } from './api/queries';
import { søk } from './api/api';
import Søk from './søk/Søk';
import Stillingsliste from './stillingsliste/Stillingsliste';
import './App.less';
import { Publisert } from './søk/HvorErAnnonsenPublisert';
import Paginering from './paginering/Paginering';

export type Søkekriterier = {
    side: number;
    tekst: string;
    publisert: Publisert;
};

export type AppProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent<AppProps> = ({ navKontor, history }) => {
    const [respons, setRespons] = useState<Respons | null>(null);
    const [side, setSide] = useState<number>(hentSøkekriterier(history.location.search).side); // Hent fra URL

    useEffect(() => {
        const blaTilValgtSide = async () => {
            const query = lagQuery(søkekriterier);
            setRespons(await søk(query));
        };

        const søkekriterier = hentSøkekriterier(history.location.search);

        const harEndretSide = søkekriterier.side !== side;
        if (harEndretSide) {
            blaTilValgtSide();
        } else {
            console.log('Jalla');
            const url = byggUrlMedParam(QueryParam.Side, null);
            history.replace({ search: url.search });
        }
    }, [history, side]);

    const onSideChange = (side: number) => {
        setSide(side);
    };

    return (
        <div className="app">
            <Søk />
            {respons && (
                <>
                    <Stillingsliste esRespons={respons} />
                    <Paginering
                        side={side}
                        totaltAntallTreff={respons.hits.total.value}
                        onSideChange={onSideChange}
                    />
                </>
            )}
        </div>
    );
};

export default App;
