import React, { FunctionComponent, useEffect, useState } from 'react';
import { History } from 'history';
import { Respons } from './elasticSearchTyper';
import {
    hentSøkekriterier,
    QueryParam,
    Navigeringsstate,
    oppdaterUrlMedParam,
} from './søk/søkefelt/urlUtils';
import { lagQuery } from './api/queries/queries';
import { søk } from './api/api';
import Søk from './søk/Søk';
import Stillingsliste from './stillingsliste/Stillingsliste';
import './App.less';
import { Publisert } from './søk/om-annonsen/HvorErAnnonsenPublisert';
import Paginering from './paginering/Paginering';
import Introduksjon from './introduksjon/Introduksjon';
import { Link, useLocation } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Systemtittel } from 'nav-frontend-typografi';
import { Status } from './søk/om-annonsen/Annonsestatus';
import { sendEvent } from './amplitude';
import Sorter, { Sortering } from './sorter/Sorter';
import { standardsøkLocalstorageKey } from './søk/lagre-standardsøk/LagreStandardsøk';

export type Søkekriterier = {
    side: number;
    tekst: string;
    publisert: Publisert;
    fylker: Set<string>;
    kommuner: Set<string>;
    statuser: Set<Status>;
    hovedinkluderingstags: Set<string>;
    subinkluderingstags: Set<string>;
    sortering: Sortering;
};

export type AppProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent<AppProps> = ({ navKontor, history }) => {
    const { search, state: navigeringsstate } = useLocation<Navigeringsstate>();
    const [respons, setRespons] = useState<Respons | null>(null);

    useEffect(() => {
        const side = history.location.pathname;
        sendEvent('app', 'sidevisning', { side });
    }, [history.location.pathname]);

    useEffect(() => {
        const søkekriterier = hentSøkekriterier(search);
        const harByttetSide = navigeringsstate?.harByttetSide;
        const resetSidetall = !harByttetSide && søkekriterier.side > 1;

        if (resetSidetall) {
            oppdaterUrlMedParam({
                history,
                parameter: QueryParam.Side,
                verdi: null,
            });
        } else {
            søk(lagQuery(søkekriterier)).then((respons) => {
                setRespons(respons);
            });
        }
    }, [search, history, navigeringsstate]);

    useEffect(() => {
        const searchParams = new URLSearchParams(search);
        const skalBrukeStandardsøk = searchParams.has(QueryParam.Standardsøk);

        if (skalBrukeStandardsøk) {
            const standardsøk = localStorage.getItem(standardsøkLocalstorageKey);
            if (standardsøk) {
                history.replace({ search: standardsøk });
            } else {
                history.replace({ search: defaultValgteKriterier });
            }
        }
    }, [search, history]);

    return (
        <div className="app">
            <nav className="app__tilbakelenke">
                <Link
                    className="lenke"
                    to="/stillinger?kommerfranyttsøk"
                    onClick={() => {
                        sendEvent('app', 'naviger_til_gammelt_søk');
                    }}
                >
                    <NavFrontendChevron type="venstre" />
                    Til gammelt søk
                </Link>
            </nav>

            <Introduksjon />

            <aside className="app__sidepanel">
                <Søk />
            </aside>

            <main className="app__søkeresultat">
                {respons ? (
                    <>
                        <div className="app__antall-og-sortering">
                            <Systemtittel className="app__antall-stillinger" tag="output">
                                {formaterAntallAnnonser(respons.hits.total.value)}
                            </Systemtittel>
                            <Sorter />
                        </div>
                        <Stillingsliste esRespons={respons} />
                        <Paginering totaltAntallTreff={respons.hits.total.value} />
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

export const defaultValgteKriterier = '?publisert=intern&statuser=publisert';

export default App;
