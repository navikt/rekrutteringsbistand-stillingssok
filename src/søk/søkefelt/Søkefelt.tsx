import React, { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    oppdaterUrlMedToParams,
    QueryParam,
} from '../../utils/urlUtils';
import './Søkefelt.less';
import { Search } from '@navikt/ds-react';

const Søkefelt: FunctionComponent = () => {
    const history = useHistory();
    const { search, state } = useLocation<Navigeringsstate>();
    const [input, setInput] = useState<string>(hentSøkekriterier(search).tekst);

    useEffect(() => {
        if (state?.harSlettetKriterier || state?.brukStandardsøk) {
            setInput(hentSøkekriterier(search).tekst);
        }
    }, [search, state]);

    const onInputChange = (input: string) => {
        setInput(input);
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (input.length > 0) {
            oppdaterUrlMedParam({
                history,
                parameter: QueryParam.Tekst,
                verdi: input,
            });
        } else {
            oppdaterTekstOgResetFane();
        }
    };

    const oppdaterTekstOgResetFane = () => {
        oppdaterUrlMedToParams({
            history,
            parameter: QueryParam.Tekst,
            verdi: input,
            parameter2: QueryParam.Fane,
            verdi2: null,
        });
    };

    return (
        <Search
            label="Søk etter stillinger"
            description="For eksempel arbeidsgiver, annonsenummer eller annonsetekst"
            value={input}
            hideLabel={false}
            onChange={onInputChange}
            onSubmit={onSubmit}
            onClear={() => onInputChange('')}
        />
    );
};

export default Søkefelt;
