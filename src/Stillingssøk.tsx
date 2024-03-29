import React from 'react';
import { useParams } from 'react-router-dom';
import { Heading, Loader } from '@navikt/ds-react';

import { Publisert } from './filter/om-annonsen/HvorErAnnonsenPublisert';
import { Status } from './filter/om-annonsen/Annonsestatus';
import { Stillingskategori } from './filter/om-annonsen/VelgStillingskategori';
import Filter from './filter/Filter';
import Filtermeny from './filter/filtermeny/Filtermeny';
import Paginering from './paginering/Paginering';
import Sorter, { Sortering } from './sorter/Sorter';
import Stillingsliste from './stillingsliste/Stillingsliste';
import useAntallTreff from './useAntallTreff';
import useSøkMedQuery from './useSøkMedQuery';
import Søkefelter, { Søkefelt } from './søkefelter/Søkefelter';
import KontekstAvKandidat from './kontekst-av-kandidat/KontekstAvKandidat';
import css from './Stillingssøk.module.css';

export type Søkekriterier = {
    side: number;
    tekst: Set<string>;
    publisert: Set<Publisert>;
    fylker: Set<string>;
    kommuner: Set<string>;
    statuser: Set<Status>;
    stillingskategorier: Set<Stillingskategori>;
    hovedinkluderingstags: Set<string>;
    subinkluderingstags: Set<string>;
    sortering: Sortering;
    felter: Set<Søkefelt>;
};

const Stillingssøk = () => {
    const { fnr } = useParams();
    const respons = useSøkMedQuery();

    const globalAggregering = respons?.aggregations?.globalAggregering;
    const antallTreff = useAntallTreff(respons);

    return (
        <div className={css.wrapper}>
            {fnr && <KontekstAvKandidat fnr={fnr} />}
            <div className={css.stillingssøk}>
                <aside className={css.sidepanel}>
                    <Filter fnr={fnr} />
                </aside>

                <main className={css.sokeresultat}>
                    {respons ? (
                        <>
                            <Filtermeny fnr={fnr} />
                            <div className={css.beskrivelseAvSøk}>
                                <Heading level="2" size="medium" className={css.antallStillinger}>
                                    {formaterAntallAnnonser(antallTreff)}
                                </Heading>
                                <Søkefelter aggregeringer={globalAggregering?.felter.buckets} />
                                <Sorter />
                            </div>
                            <Stillingsliste esRespons={respons} fnr={fnr} />
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
