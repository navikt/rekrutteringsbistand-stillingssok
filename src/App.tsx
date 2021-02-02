import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { History } from 'history';
import { Respons } from './elasticSearchTyper';
import { byggUrlMedParam, hentSøkekriterier, QueryParam } from './søk/søkefelt/urlUtils';
import { lagQuery } from './api/queries';
import { søk } from './api/api';
import Søk from './søk/Søk';
import Stillingsliste from './stillingsliste/Stillingsliste';
import './App.less';
import { Publisert } from './søk/HvorErAnnonsenPublisert';
import Paginering from './paginering/Paginering';
import Introduksjon from './introduksjon/Introduksjon';

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

    const søkBasertPåUrl = useCallback(
        async (beholdSidetall?: boolean) => {
            if (!beholdSidetall) {
                const url = byggUrlMedParam(QueryParam.Side, null);
                history.replace({ search: url.search });
            }

            const søkekriterier = hentSøkekriterier(history.location.search);
            const query = lagQuery(søkekriterier);
            setRespons(await søk(query));
        },
        [history]
    );

    useEffect(() => {
        søkBasertPåUrl(true);
    }, [søkBasertPåUrl]);

    return (
        <div className="app">
            <Søk søkBasertPåUrl={søkBasertPåUrl} />

            <main className="app__søkeresultat">
                <Introduksjon />
                {respons && (
                    <>
                        <Stillingsliste esRespons={respons} />
                        <Paginering
                            søkBasertPåUrl={søkBasertPåUrl}
                            totaltAntallTreff={respons.hits.total.value}
                        />
                    </>
                )}
            </main>
        </div>
    );
};

export default App;
