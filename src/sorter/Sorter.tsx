import { Select } from 'nav-frontend-skjema';
import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../søk/søkefelt/urlUtils';
import './Sorter.less';

export enum Sortering {
    MestRelevant = 'mestRelevant',
    Publiseringsdato = 'publiseringsdato',
    Utløpsdato = 'utløpsdato',
}

const Sorter: FunctionComponent = () => {
    const history = useHistory();
    const { search, state } = useLocation<Navigeringsstate>();
    const [valgt, setValgt] = useState<Sortering>(hentSøkekriterier(search).sortering);

    useEffect(() => {
        if (state?.harSlettetKriterier) {
            setValgt(Sortering.MestRelevant);
        }
    }, [search, state]);

    const onOptionValgt = (event: ChangeEvent<HTMLSelectElement>) => {
        const valgt = event.target.value as Sortering;

        setValgt(valgt);
        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Sortering,
            verdi: valgt === Sortering.MestRelevant ? null : valgt,
        });
    };

    return (
        <Select className="sorter" label="Sorter" defaultValue={valgt} onChange={onOptionValgt}>
            {Object.values(Sortering).map((sortering) => (
                <option key={sortering} value={sortering}>
                    {labels[sortering]}
                </option>
            ))}
        </Select>
    );
};

const labels: Record<Sortering, string> = {
    [Sortering.MestRelevant]: 'Mest relevant',
    [Sortering.Publiseringsdato]: 'Publiseringsdato',
    [Sortering.Utløpsdato]: 'Utløpsdato',
};

export default Sorter;
