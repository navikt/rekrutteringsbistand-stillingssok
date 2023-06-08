import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Heading, Loader } from '@navikt/ds-react';

import { GlobalAggregering, Respons } from './domene/elasticSearchTyper';
import { hentSøkekriterier, QueryParam, oppdaterUrlMedParam } from './utils/urlUtils';
import { lagQuery, lagQueryPåAnnonsenummer } from './api/queries/queries';
import { Publisert } from './søk/om-annonsen/HvorErAnnonsenPublisert';
import { sendEvent } from './amplitude';
import { søk } from './api/api';
import { Status } from './søk/om-annonsen/Annonsestatus';
import { Stillingskategori } from './søk/om-annonsen/VelgStillingskategori';
import Paginering from './paginering/Paginering';
import Søk from './søk/Søk';
import Søkefaner, { Fane } from './søkefaner/Søkefaner';
import Sorter, { Sortering } from './sorter/Sorter';
import Stillingsliste from './stillingsliste/Stillingsliste';
import useStandardsøk from './standardsøk/StandardsøkContext';
import useNavigering from './useNavigering';
import css from './Stillingssøk.module.css';

export type Søkekriterier = {
    side: number;
    tekst: string;
    publisert: Set<Publisert>;
    fylker: Set<string>;
    kommuner: Set<string>;
    statuser: Set<Status>;
    stillingskategorier: Set<Stillingskategori>;
    hovedinkluderingstags: Set<string>;
    subinkluderingstags: Set<string>;
    sortering: Sortering;
    fane: Fane;
};

const Stillingssøk = () => {
    const { fnr } = useParams();
    console.log('Fødselsnummer fra route:', fnr);

    const { navigate, searchParams, state } = useNavigering();

    const [respons, setRespons] = useState<Respons | null>(null);
    const { standardsøk } = useStandardsøk();

    const globalAggregering = respons?.aggregations?.globalAggregering;
    const antallTreff = useAntallTreff(globalAggregering);

    useEffect(() => {
        const skalBrukeStandardsøk = searchParams.has(QueryParam.Standardsøk);
        if (skalBrukeStandardsøk) return;

        const søkekriterier = hentSøkekriterier(searchParams);
        const harByttetSide = state?.harByttetSide;
        const resetSidetall = !harByttetSide && søkekriterier.side > 1;

        const søkMedQuery = async () => {
            let respons = await søk(lagQuery(søkekriterier));

            const fikkIngenTreff =
                hentAntallTreff(searchParams, respons.aggregations?.globalAggregering) === 0;
            if (fikkIngenTreff) {
                respons = await søk(lagQueryPåAnnonsenummer(søkekriterier));
            }

            setRespons(respons);
        };

        if (resetSidetall) {
            oppdaterUrlMedParam({
                navigate,
                searchParams,
                parameter: QueryParam.Side,
                verdi: null,
            });
        } else {
            søkMedQuery();
        }
    }, [searchParams, navigate, state]);

    useEffect(() => {
        const skalBrukeStandardsøk = searchParams.has(QueryParam.Standardsøk);

        if (skalBrukeStandardsøk && standardsøk.harHentetStandardsøk) {
            if (standardsøk.standardsøk !== null) {
                navigate(
                    { search: standardsøk.standardsøk },
                    {
                        replace: true,
                        state: {
                            brukStandardsøk: true,
                        },
                    }
                );
            } else {
                navigate({ search: defaultValgteKriterier }, { replace: true });
            }

            sendEvent('stillingssøk', 'har_lagret_standardsøk', {
                harLagretStandardsøk: !!standardsøk,
            });
        }
    }, [searchParams, navigate, standardsøk]);

    return (
        <div className={css.stillingssøk}>
            <aside className={css.sidepanel}>
                <Søk />
            </aside>

            <main className={css.sokeresultat}>
                {respons ? (
                    <>
                        <Heading level="2" size="medium" className={css.antallStillinger}>
                            {formaterAntallAnnonser(antallTreff)}
                        </Heading>
                        <div className={css.antallOgSortering}>
                            <Søkefaner aggregeringer={globalAggregering?.faner.buckets} />
                            <Sorter />
                        </div>
                        <Stillingsliste esRespons={respons} />
                        <Paginering totaltAntallTreff={antallTreff} />
                    </>
                ) : (
                    <div className={css.spinner}>
                        <Loader size="xlarge" />
                    </div>
                )}
            </main>
        </div>
    );
};

const hentAntallTreff = (
    searchParams: URLSearchParams,
    globalAggregering?: GlobalAggregering
): number => {
    const aktivFane = hentSøkekriterier(searchParams).fane;
    return globalAggregering?.faner.buckets[aktivFane]?.doc_count ?? 0;
};

const useAntallTreff = (globalAggregering?: GlobalAggregering): number => {
    const [searchParams] = useSearchParams();
    return hentAntallTreff(searchParams, globalAggregering);
};

const formaterAntallAnnonser = (antallAnnonser: number) => {
    const suffiks = antallAnnonser === 1 ? ' annonse' : ' annonser';
    return antallAnnonser.toLocaleString('nb-NO') + suffiks;
};

export const defaultValgteKriterier = '?publisert=intern&statuser=publisert';

export default Stillingssøk;
