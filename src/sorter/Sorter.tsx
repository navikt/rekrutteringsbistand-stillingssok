import { Select } from '@navikt/ds-react';
import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import useNavigering from '../useNavigering';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../utils/urlUtils';
import css from './Sorter.module.css';

export enum Sortering {
    MestRelevant = 'mestRelevant',
    Publiseringsdato = 'publiseringsdato',
    Utløpsdato = 'utløpsdato',
}

const Sorter: FunctionComponent = () => {
    const { searchParams, navigate, state } = useNavigering();
    const [valgt, setValgt] = useState<Sortering>(hentSøkekriterier(searchParams).sortering);

    useEffect(() => {
        if (state?.brukStandardsøk) {
            setValgt(Sortering.MestRelevant);
        }
    }, [searchParams, state]);

    const onOptionValgt = (event: ChangeEvent<HTMLSelectElement>) => {
        const valgt = event.target.value as Sortering;

        setValgt(valgt);
        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Sortering,
            verdi: valgt === Sortering.MestRelevant ? null : valgt,
        });
    };

    return (
        <Select className={css.sorter} label="Sorter" value={valgt} onChange={onOptionValgt}>
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
