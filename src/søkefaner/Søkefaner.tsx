import React, { FunctionComponent, useEffect, useState } from 'react';
import Tabs from 'nav-frontend-tabs';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../utils/urlUtils';
import { useHistory, useLocation } from 'react-router';

export enum Fane {
    Alle = 'alle',
    Arbeidsgiver = 'arbeidsgiver',
    Annonsetittel = 'annonsetittel',
    Annonsetekst = 'annonsetekst',
}

const Søkefaner: FunctionComponent = () => {
    const history = useHistory();
    const { search } = useLocation<Navigeringsstate>();

    const [aktivFaneIndex, setAktivFaneIndex] = useState<number>(hentAktivFaneIndex(search));

    useEffect(() => {
        setAktivFaneIndex(hentAktivFaneIndex(search));
    }, [search]);

    const onChange = (_: any, index: number) => {
        setAktivFaneIndex(index);

        const valgtFane = Object.values(Fane)[index];

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Fane,
            verdi: valgtFane === Fane.Alle ? null : valgtFane,
        });
    };

    return (
        <Tabs
            tabs={Object.keys(Fane).map((fane, index) => ({
                label: fane,
                aktiv: aktivFaneIndex === index,
            }))}
            onChange={onChange}
        />
    );
};

const hentAktivFaneIndex = (search: string): number => {
    const aktivFaneIndex = Object.values(Fane).indexOf(hentSøkekriterier(search).fane);
    return aktivFaneIndex !== -1 ? aktivFaneIndex : 0;
};

export default Søkefaner;
