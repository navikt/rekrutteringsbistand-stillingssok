import React, { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import {
    hentSøkekriterier,
    oppdaterUrlMedParam,
    oppdaterUrlMedToParams,
    QueryParam,
} from '../../utils/urlUtils';
import { Search } from '@navikt/ds-react';
import useNavigering from '../../useNavigering';
import css from './Søkefelt.module.css';

const Søkefelt: FunctionComponent = () => {
    const { searchParams, navigate, state } = useNavigering();
    const [input, setInput] = useState<string>('');
    const tekst = hentSøkekriterier(searchParams).tekst;

    useEffect(() => {
        const skalTømmeInputfelt = state?.harSlettetKriterier;
        const skalSetteInputfeltTilStandardsøk = state?.brukStandardsøk;

        if (skalTømmeInputfelt || skalSetteInputfeltTilStandardsøk) {
            setInput('');
        }
    }, [searchParams, state]);

    const onInputChange = (input: string) => {
        setInput(input);
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (input.length > 0) {
            const søketermer = new Set(tekst);
            søketermer.add(input);
            oppdaterUrlMedParam({
                searchParams,
                navigate,
                parameter: QueryParam.Tekst,
                verdi: Array.from(søketermer),
            });
            setInput('');
        }
    };

    return (
        <form className={css.form} onSubmit={onSubmit}>
            <Search
                label="Søk etter stillinger"
                description="For eksempel arbeidsgiver, annonsenummer eller annonsetekst"
                value={input}
                hideLabel={false}
                onChange={onInputChange}
                onClear={() => onInputChange('')}
            />
        </form>
    );
};

export default Søkefelt;
