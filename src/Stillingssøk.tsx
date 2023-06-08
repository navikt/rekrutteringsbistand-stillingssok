import React from 'react';
import { useParams } from 'react-router-dom';
import { Heading, Loader } from '@navikt/ds-react';

import { Publisert } from './søk/om-annonsen/HvorErAnnonsenPublisert';
import { Status } from './søk/om-annonsen/Annonsestatus';
import { Stillingskategori } from './søk/om-annonsen/VelgStillingskategori';
import Paginering from './paginering/Paginering';
import Søk from './søk/Søk';
import Søkefaner, { Fane } from './søkefaner/Søkefaner';
import Sorter, { Sortering } from './sorter/Sorter';
import Stillingsliste from './stillingsliste/Stillingsliste';
import useAntallTreff from './useAntallTreff';
import useSøkMedQuery from './useSøkMedQuery';
import css from './Stillingssøk.module.css';
import Kandidat from './kandidat/Kandidat';

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
    const respons = useSøkMedQuery();

    const globalAggregering = respons?.aggregations?.globalAggregering;
    const antallTreff = useAntallTreff(globalAggregering);

    return (
        <div className={css.wrapper}>

        {fnr &&  <Kandidat fnr={fnr} />}
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
        </div>
    );
};

const formaterAntallAnnonser = (antallAnnonser: number) => {
    const suffiks = antallAnnonser === 1 ? ' annonse' : ' annonser';
    return antallAnnonser.toLocaleString('nb-NO') + suffiks;
};

export default Stillingssøk;
