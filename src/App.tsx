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
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';

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
            <nav className="app__tilbakelenke">
                <Link className="lenke" to="/stillinger">
                    <NavFrontendChevron type="venstre" />
                    Tilbake til gammelt søk
                </Link>
            </nav>

            <Introduksjon />

            <aside className="app__sidepanel">
                <Søk søkBasertPåUrl={søkBasertPåUrl} />
            </aside>

            <main className="app__søkeresultat">
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
