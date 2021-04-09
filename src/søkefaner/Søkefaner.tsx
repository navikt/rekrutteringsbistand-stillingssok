import React, { FunctionComponent, useEffect, useState } from 'react';
import { Tabs, TabList } from '@reach/tabs';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../utils/urlUtils';
import { useHistory, useLocation } from 'react-router';
import '@reach/tabs/styles.css';
import './Søkefaner.less';
import Søkefane from './Søkefane';

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
            </TabList>
        </Tabs>
    );
};

const hentAktivFaneIndex = (search: string): number => {
    const aktivFaneIndex = Object.values(Fane).indexOf(hentSøkekriterier(search).fane);
    return aktivFaneIndex !== -1 ? aktivFaneIndex : 0;
};

export default Søkefaner;
