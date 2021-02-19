import React, { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { Søkeknapp } from 'nav-frontend-ikonknapper';
import { Input } from 'nav-frontend-skjema';
import { useHistory, useLocation } from 'react-router-dom';
import { hentSøkekriterier, Navigeringsstate, oppdaterUrlMedParam, QueryParam } from './urlUtils';
import './Søkefelt.less';

const Søkefelt: FunctionComponent = () => {
    const history = useHistory();
    const { search, state } = useLocation<Navigeringsstate>();
    const [input, setInput] = useState<string>(hentSøkekriterier(search).tekst);

    useEffect(() => {
        if (state?.harSlettetKriterier) {
            setInput('');
        }
    }, [search, state]);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Tekst,
            verdi: input,
        });
    };

    return (
        <form className="søkefelt" onSubmit={onSubmit}>
            <Input
                label="Søk etter stillinger"
                description="For eksempel arbeidsgiver, annonsenummer, tittel eller annonsetekst"
                value={input}
                onChange={onInputChange}
                className="søkefelt__input"
            />
            <Søkeknapp type="flat" className="søkefelt__søkeknapp" htmlType="submit" />
        </form>
    );
};

export default Søkefelt;
