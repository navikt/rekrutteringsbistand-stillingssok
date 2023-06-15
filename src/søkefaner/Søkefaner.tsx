import React, { FunctionComponent, useEffect, useState } from 'react';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../utils/urlUtils';
import Søkefane from './Søkefane';
import { Tabs } from '@navikt/ds-react';
import css from './Søkefaner.module.css';
import useNavigering from '../useNavigering';

export enum Fane {
    Alle = 'alle',
    Arbeidsgiver = 'arbeidsgiver',
    Annonsetittel = 'annonsetittel',
    Annonsetekst = 'annonsetekst',
}

type Props = {
    aggregeringer?: Partial<Record<Fane, { doc_count: number }>>;
};

const Søkefaner: FunctionComponent<Props> = ({ aggregeringer }) => {
    const { searchParams, navigate } = useNavigering();

    const [aktivFane, setAktivFane] = useState<Fane>(hentAktivFane(searchParams));

    useEffect(() => {
        setAktivFane(hentAktivFane(searchParams));
    }, [searchParams]);

    const onChange = (fane: string) => {
        setAktivFane(fane as Fane);

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Fane,
            verdi: fane === Fane.Alle ? null : fane,
        });
    };

    return (
        <Tabs className={css.søkefaner} value={aktivFane} onChange={onChange}>
            <Tabs.List>
                <Søkefane fane={Fane.Alle} antallTreff={aggregeringer?.alle?.doc_count ?? 0} />
                {hentSøkekriterier(searchParams).tekst.size > 0 &&
                    Object.values(Fane)
                        .filter((fane) => fane !== Fane.Alle)
                        .map((fane) => {
                            const aggregering = aggregeringer && aggregeringer[fane];
                            return (
                                <Søkefane
                                    key={fane}
                                    fane={fane}
                                    antallTreff={aggregering?.doc_count}
                                />
                            );
                        })}
            </Tabs.List>
        </Tabs>
    );
};

const hentAktivFane = (searchParams: URLSearchParams): Fane => {
    return hentSøkekriterier(searchParams).fane;
};

export default Søkefaner;
