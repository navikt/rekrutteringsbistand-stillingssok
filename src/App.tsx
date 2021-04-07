import React, { FunctionComponent, useEffect, useState } from 'react';
import { History } from 'history';
import { Respons } from './elasticSearchTyper';
import {
    hentSøkekriterier,
    QueryParam,
    Navigeringsstate,
    oppdaterUrlMedParam,
} from './søk/søkefelt/urlUtils';
import { lagQuery, lagQueryPåAnnonsenummer } from './api/queries/queries';
import { søk } from './api/api';
import Søk from './søk/Søk';
import Stillingsliste from './stillingsliste/Stillingsliste';
import Paginering from './paginering/Paginering';
import Introduksjon from './introduksjon/Introduksjon';
import { Link, useLocation } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Systemtittel } from 'nav-frontend-typografi';
import { Status } from './søk/om-annonsen/Annonsestatus';
import { sendEvent } from './amplitude';
import Sorter, { Sortering } from './sorter/Sorter';
import { Publisert } from './søk/om-annonsen/HvorErAnnonsenPublisert';
import { StandardsøkProvider } from './StandardsøkContext';
import useStandardsøk from './StandardsøkContext';
import useLocalStorage from './utils/useLocalStorage';
import './App.less';
import { erIkkeProd } from './utils/featureToggleUtils';
import Søkefaner, { Fane } from './søkefaner/Søkefaner';

export type Søkekriterier = {
    side: number;
    tekst: string;
    publisert: Set<Publisert>;
    fylker: Set<string>;
    kommuner: Set<string>;
    statuser: Set<Status>;
    hovedinkluderingstags: Set<string>;
    subinkluderingstags: Set<string>;
    sortering: Sortering;
    fane: Fane;
};

export type AppProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent<AppProps> = ({ navKontor, history }) => {
    const { search, state: navigeringsstate } = useLocation<Navigeringsstate>();
    const [respons, setRespons] = useState<Respons | null>(null);
    const { standardsøk, oppdaterStandardsøk } = useStandardsøk();
    const {
        verdi: standardsøkFraLocalStorage,
        slettVerdi: slettStandardsøkFraLocalStorage,
    } = useLocalStorage('standardsok');

    useEffect(() => {
        const side = history.location.pathname;
        sendEvent('app', 'sidevisning', { side });
    }, [history.location.pathname]);

    useEffect(() => {
        const searchParams = new URLSearchParams(search);
        const skalBrukeStandardsøk = searchParams.has(QueryParam.Standardsøk);
        if (skalBrukeStandardsøk) return;

        const søkekriterier = hentSøkekriterier(search);
        const harByttetSide = navigeringsstate?.harByttetSide;
        const resetSidetall = !harByttetSide && søkekriterier.side > 1;

        const søkMedQuery = async () => {
            let respons = await søk(lagQuery(søkekriterier));

            const fikkIngenStillinger = respons.hits.total.value === 0;
            if (fikkIngenStillinger) {
                respons = await søk(lagQueryPåAnnonsenummer(søkekriterier.tekst));
            }

            setRespons(respons);
        };

        if (resetSidetall) {
            oppdaterUrlMedParam({
                history,
                parameter: QueryParam.Side,
                verdi: null,
            });
        } else {
            søkMedQuery();
        }
    }, [search, history, navigeringsstate]);

    // TODO: Fjern migreringsstrategi etterhvert
    useEffect(() => {
        const flyttStandardsøkTilBackend = async (fraLocalStorage: string) => {
            await oppdaterStandardsøk(fraLocalStorage);
            slettStandardsøkFraLocalStorage();
            sendEvent('stillingssøk', 'har_flyttet_standardsøk');
        };

        if (standardsøkFraLocalStorage !== null) {
            flyttStandardsøkTilBackend(standardsøkFraLocalStorage);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(search);
        const skalBrukeStandardsøk = searchParams.has(QueryParam.Standardsøk);

        if (
            skalBrukeStandardsøk &&
            standardsøk.harHentetStandardsøk &&
            standardsøkFraLocalStorage === null
        ) {
            if (standardsøk.standardsøk !== null) {
                history.replace({
                    search: standardsøk.standardsøk,
                    state: {
                        brukStandardsøk: true,
                    },
                });
            } else {
                history.replace({ search: defaultValgteKriterier });
            }

            sendEvent('stillingssøk', 'har_lagret_standardsøk', {
                harLagretStandardsøk: !!standardsøk,
            });
        }
    }, [search, history, standardsøk, standardsøkFraLocalStorage]);

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
                        {erIkkeProd && (
                            <Systemtittel className="app__antall-stillinger" tag="output">
                                {formaterAntallAnnonser(respons.hits.total.value)}
                            </Systemtittel>
                        )}
                        <div className="app__antall-og-sortering">
                            {!erIkkeProd && (
                                <Systemtittel
                                    className="app__antall-stillinger-gammel"
                                    tag="output"
                                >
                                    {formaterAntallAnnonser(respons.hits.total.value)}
                                </Systemtittel>
                            )}
                            {erIkkeProd && <Søkefaner />}
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

const AppContainer = (props: any) => (
    <StandardsøkProvider>
        <App {...props} />
    </StandardsøkProvider>
);

export default AppContainer;
