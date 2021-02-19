import { Select } from 'nav-frontend-skjema';
import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../søk/søkefelt/urlUtils';
import './Sorter.less';

export enum Sortering {
    MestRelevant = 'mest-relevant',
    Publiseringsdato = 'publiseringsdato',
    Utløpsdato = 'utlopsdato',
}

const Sorter: FunctionComponent = () => {
    const history = useHistory();
    const { search } = useLocation();
    const [valgt, setValgt] = useState<Sortering>(hentSøkekriterier(search).sortering);

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
        <Select className="sorter" label="Sorter" onChange={onOptionValgt}>
            <option selected={valgt === Sortering.MestRelevant} value={Sortering.MestRelevant}>
                Mest relevant
            </option>
            <option
                selected={valgt === Sortering.Publiseringsdato}
                value={Sortering.Publiseringsdato}
            >
                Publiseringsdato
            </option>
            <option selected={valgt === Sortering.Utløpsdato} value={Sortering.Utløpsdato}>
                Utløpsdato
            </option>
        </Select>
    );
};

export default Sorter;
