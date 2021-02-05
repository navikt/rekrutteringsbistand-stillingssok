import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { History } from 'history';
import { Respons } from './elasticSearchTyper';
import {
    byggUrlMedParam,
    hentSøkekriterier,
    QueryParam,
    QueryParamValue,
} from './søk/søkefelt/urlUtils';
import { lagQuery } from './api/queries';
import { søk } from './api/api';
import Søk from './søk/Søk';
import Stillingsliste from './stillingsliste/Stillingsliste';
import './App.less';
import { Publisert } from './søk/om-annonsen/HvorErAnnonsenPublisert';
import Paginering from './paginering/Paginering';
import Introduksjon from './introduksjon/Introduksjon';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Systemtittel } from 'nav-frontend-typografi';
import { Status } from './søk/om-annonsen/Annonsestatus';

export type Søkekriterier = {
    side: number;
    tekst: string;
    publisert: Publisert;
    fylker: Set<string>;
    kommuner: Set<string>;
    statuser: Set<Status>;
};

export type AppProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent<AppProps> = ({ navKontor, history }) => {
    const [respons, setRespons] = useState<Respons | null>(null);
    const [førsteSøkErGjort, setFørsteSøkErGjort] = useState<boolean>(false);

    const oppdaterSøk = async (queryParam: QueryParam, verdi: QueryParamValue) => {
        const resetSidetall = queryParam !== QueryParam.Side;

        if (resetSidetall) {
            const url = byggUrlMedParam(QueryParam.Side, null);
            oppdaterSearchParams(url.search);
        }

        const url = byggUrlMedParam(queryParam, verdi);
        oppdaterSearchParams(url.search);

        søkBasertPåUrl();
    };

    const oppdaterSearchParams = (search: string) => {
        history.replace({ search });
    };

    const søkBasertPåUrl = useCallback(async () => {
        const søkekriterier = hentSøkekriterier(history.location.search);
        const query = lagQuery(søkekriterier);

        setRespons(await søk(query));
    }, [history.location.search]);

    useEffect(() => {
        const hentFylker = async () => {
            const response = await fetch(
                'https://ws.geonorge.no/kommuneinfo/v1/fylkerkommuner?filtrer=fylkesnavn%2Ckommuner%2Ckommuner.kommunenavn'
            );
            const json = await response.json();
            console.log(json);
        };
        hentFylker();
    }, []);

    useEffect(() => {
        if (!førsteSøkErGjort) {
            setFørsteSøkErGjort(true);
            søkBasertPåUrl();
        }
    }, [søkBasertPåUrl, førsteSøkErGjort]);

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
                <Søk oppdaterSøk={oppdaterSøk} />
            </aside>

            <main className="app__søkeresultat">
                {respons ? (
                    <>
                        <Systemtittel className="app__antall-stillinger" tag="output">
                            {respons.hits.total.value} annonser
                        </Systemtittel>
                        <Stillingsliste esRespons={respons} />
                        <Paginering
                            oppdaterSøk={oppdaterSøk}
                            totaltAntallTreff={respons.hits.total.value}
                        />
                    </>
                ) : (
                    <NavFrontendSpinner type="L" />
                )}
            </main>
        </div>
    );
};

export default App;
