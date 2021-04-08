import React, { FunctionComponent, useEffect, useState } from 'react';
import { Tabs, TabList, Tab } from '@reach/tabs';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../utils/urlUtils';
import { useHistory, useLocation } from 'react-router';
import '@reach/tabs/styles.css';
import './Søkefaner.less';

export enum Fane {
    Alle = 'alle',
    Arbeidsgiver = 'arbeidsgiver',
    Annonsetittel = 'annonsetittel',
    Annonsetekst = 'annonsetekst',
}

type Props = {
    aggregeringer?: Record<Fane, { doc_count: number }>;
};

const Søkefaner: FunctionComponent<Props> = ({ aggregeringer }) => {
    const history = useHistory();
    const { search } = useLocation<Navigeringsstate>();

    const [aktivFaneIndex, setAktivFaneIndex] = useState<number>(hentAktivFaneIndex(search));

    useEffect(() => {
        setAktivFaneIndex(hentAktivFaneIndex(search));
    }, [search]);

    const onChange = (index: number) => {
        setAktivFaneIndex(index);

        const valgtFane = Object.values(Fane)[index];

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Fane,
            verdi: valgtFane === Fane.Alle ? null : valgtFane,
        });
    };

    return (
        <Tabs className="søkefaner" index={aktivFaneIndex} onChange={onChange}>
            <TabList className="søkefaner__faner">
                {Object.entries(Fane).map(([key, value]) => {
                    const aggregering = aggregeringer && aggregeringer[value as Fane].doc_count;
                    return (
                        <Tab className="søkefaner__fane" key={value}>
                            {key} {aggregering ? `(${aggregering})` : ''}
                        </Tab>
                    );
                })}
            </TabList>
        </Tabs>
    );
};

const hentAktivFaneIndex = (search: string): number => {
    const aktivFaneIndex = Object.values(Fane).indexOf(hentSøkekriterier(search).fane);
    return aktivFaneIndex !== -1 ? aktivFaneIndex : 0;
};

export default Søkefaner;
