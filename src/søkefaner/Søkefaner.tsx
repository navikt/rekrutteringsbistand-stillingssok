import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../utils/urlUtils';
import { useHistory, useLocation } from 'react-router';
import Søkefane from './Søkefane';
import { Tabs } from '@navikt/ds-react';

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
    const history = useHistory();
    const { search } = useLocation<Navigeringsstate>();

    const [aktivFane, setAktivFane] = useState<Fane>(hentAktivFane(search));

    useEffect(() => {
        setAktivFane(hentAktivFane(search));
    }, [search]);

    const onChange = (fane: string) => {
        setAktivFane(fane as Fane);

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Fane,
            verdi: fane === Fane.Alle ? null : fane,
        });
    };

    return (
        <Tabs value={aktivFane} onChange={onChange}>
            <Tabs.List>
                <Søkefane fane={Fane.Alle} antallTreff={aggregeringer?.alle?.doc_count ?? 0} />
                {hentSøkekriterier(search).tekst &&
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

const hentAktivFane = (search: string): Fane => {
    return hentSøkekriterier(search).fane;
};

export default Søkefaner;
