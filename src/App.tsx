import React, { FunctionComponent, useCallback, useEffect, useState, useContext } from 'react';
import { History } from 'history';
import { GlobalAggregering, Respons } from './elasticSearchTyper';
import {
    hentSøkekriterier,
    QueryParam,
    Navigeringsstate,
    oppdaterUrlMedParam,
} from './utils/urlUtils';
import { lagQuery, lagQueryPåAnnonsenummer } from './api/queries/queries';
import { søk } from './api/api';
import Søk from './søk/Søk';
import Stillingsliste from './stillingsliste/Stillingsliste';
import Paginering from './paginering/Paginering';
import { useLocation } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Systemtittel } from 'nav-frontend-typografi';
import { Status } from './søk/om-annonsen/Annonsestatus';
import { sendEvent } from './amplitude';
import Sorter, { Sortering } from './sorter/Sorter';
import { Publisert } from './søk/om-annonsen/HvorErAnnonsenPublisert';
import { StandardsøkProvider } from './StandardsøkContext';
import useStandardsøk from './StandardsøkContext';
import Søkefaner, { Fane } from './søkefaner/Søkefaner';
import './App.less';

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
    const { standardsøk } = useStandardsøk();

    const globalAggregering = respons?.aggregations.globalAggregering;
    const antallTreff = useAntallTreff(globalAggregering);

    const [scrolletFraToppen, setScrolletFraToppen] = useState(0);
    const [lagretScrollFraToppen, setLagretScrollFraToppen] = useState(0);

    const håndterScroll = useCallback(() => {
        setScrolletFraToppen(window.pageYOffset);
    }, [setScrolletFraToppen]);

    const håndterEndreScroll = (nyVerdi: number) => {
        console.log('håndter verdi', nyVerdi);
        setLagretScrollFraToppen(nyVerdi);
        // console.log('etter', lagretScrollFraToppen);
    };
    window.history.scrollRestoration = 'auto';
    if ('scrollRestoration' in window.history) {
        console.log('window.history.scrollRestoration', window.history.scrollRestoration);
    } else {
        console.log('window.history.scrollRestoration not in history');
    }

    useEffect(
        function () {
            window.addEventListener('scroll', håndterScroll);
            return function () {
                window.removeEventListener('scroll', håndterScroll);
            };
        },
        [håndterScroll]
    );

    useEffect(() => {
        console.log('lagret', lagretScrollFraToppen, scrolletFraToppen);
        //window.scrollTo(0, lagretScrollFraToppen);

        /*return () => {
            console.log('lagret etter', lagretScrollFraToppen, scrolletFraToppen);
        };*/
    }, [lagretScrollFraToppen]);

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

            const fikkIngenTreff =
                hentAntallTreff(search, respons.aggregations?.globalAggregering) === 0;
            if (fikkIngenTreff) {
                respons = await søk(lagQueryPåAnnonsenummer(søkekriterier));
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

    useEffect(() => {
        const searchParams = new URLSearchParams(search);
        const skalBrukeStandardsøk = searchParams.has(QueryParam.Standardsøk);

        if (skalBrukeStandardsøk && standardsøk.harHentetStandardsøk) {
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
    }, [search, history, standardsøk]);

    return (
        <div className="app">
            <aside className="app__sidepanel">
                <Søk />
            </aside>

            <main className="app__søkeresultat">
                {respons ? (
                    <>
                        <Systemtittel className="app__antall-stillinger" tag="output">
                            {formaterAntallAnnonser(antallTreff)}
                        </Systemtittel>
                        <div className="app__antall-og-sortering">
                            <Søkefaner aggregeringer={globalAggregering?.faner.buckets} />
                            <Sorter />
                        </div>
                        <Stillingsliste
                            esRespons={respons}
                            scrolletFraToppen={scrolletFraToppen}
                            håndterEndreScroll={håndterEndreScroll}
                        />
                        <Paginering totaltAntallTreff={antallTreff} />
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

const hentAntallTreff = (search: string, globalAggregering?: GlobalAggregering): number => {
    const aktivFane = hentSøkekriterier(search).fane;
    return globalAggregering?.faner.buckets[aktivFane]?.doc_count ?? 0;
};

const useAntallTreff = (globalAggregering?: GlobalAggregering): number => {
    const { search } = useLocation();
    return hentAntallTreff(search, globalAggregering);
};

const formaterAntallAnnonser = (antallAnnonser: number) => {
    const suffiks = antallAnnonser === 1 ? ' annonse' : ' annonser';
    return antallAnnonser.toLocaleString('nb-NO') + suffiks;
};

export const defaultValgteKriterier = '?publisert=intern&statuser=publisert';

const AppContainer = (props: any) => (
    <StandardsøkProvider>
        <App {...props} />
    </StandardsøkProvider>
);

export default AppContainer;
