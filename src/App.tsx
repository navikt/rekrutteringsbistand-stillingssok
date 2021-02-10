import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { History } from 'history';
import { Respons } from './elasticSearchTyper';
import {
    byggUrlMedParam,
    hentSøkekriterier,
    QueryParam,
    QueryParamValue,
} from './søk/søkefelt/urlUtils';
import { lagQuery } from './api/queries/queries';
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
import { sendEvent } from './amplitude';

export type Søkekriterier = {
    side: number;
    tekst: string;
    publisert: Publisert;
    fylker: Set<string>;
    kommuner: Set<string>;
    statuser: Set<Status>;
    inkludering: boolean;
};

export type AppProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent<AppProps> = ({ navKontor, history }) => {
    const [respons, setRespons] = useState<Respons | null>(null);
    const [førsteSøkErGjort, setFørsteSøkErGjort] = useState<boolean>(false);

    useEffect(() => {
        const side = history.location.pathname;
        sendEvent('app', 'sidevisning', { side });
    }, [history.location.pathname]);

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

    const slettKriterier = () => {
        oppdaterSearchParams('');
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
                <Søk oppdaterSøk={oppdaterSøk} slettKriterier={slettKriterier} />
            </aside>

            <main className="app__søkeresultat">
                {respons ? (
                    <>
                        <Systemtittel className="app__antall-stillinger" tag="output">
                            {formaterAntallAnnonser(respons.hits.total.value)}
                        </Systemtittel>
                        <Stillingsliste esRespons={respons} />
                        <Paginering
                            oppdaterSøk={oppdaterSøk}
                            totaltAntallTreff={respons.hits.total.value}
                        />
                    </>
                ) : (
                    <div className="app__spinner">
                        <NavFrontendSpinner type="L" />
                    </div>
                )}
            </main>
        </div>
    );
};

const formaterAntallAnnonser = (antallAnnonser: number) => {
    const prefiks = antallAnnonser === 10000 ? 'Mer enn ' : '';
    const suffiks = antallAnnonser === 1 ? ' annonse' : ' annonser';

    return prefiks + antallAnnonser + suffiks;
};

export default App;
