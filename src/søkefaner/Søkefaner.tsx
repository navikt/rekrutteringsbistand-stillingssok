import React, { FunctionComponent, useState } from 'react';
import Tabs from 'nav-frontend-tabs';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../søk/søkefelt/urlUtils';
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

    const [aktivFane, setAktivFane] = useState<number>(
        Object.values(Fane).indexOf(hentSøkekriterier(search).fane) || 0
    );

    const onChange = (_: any, index: number) => {
        setAktivFane(index);

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
                aktiv: aktivFane === index,
            }))}
            onChange={onChange}
        />
    );
};

export default Søkefaner;
