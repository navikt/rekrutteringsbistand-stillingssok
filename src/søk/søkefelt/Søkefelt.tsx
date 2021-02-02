import React, { ChangeEvent, FormEvent, FunctionComponent, useState } from 'react';
import { Søkeknapp } from 'nav-frontend-ikonknapper';
import { Input } from 'nav-frontend-skjema';
import { useLocation } from 'react-router-dom';
import { hentSøkekriterier, QueryParam } from './urlUtils';
import { SøkProps } from '../Søk';
import './Søkefelt.less';

const Søkefelt: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    const { search } = useLocation();
    const [input, setInput] = useState<string>(hentSøkekriterier(search).tekst);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        oppdaterSøk(QueryParam.Tekst, input);
    };

    return (
        <form className="søkefelt" onSubmit={onSubmit}>
            <Input
                label="Søk etter ledig stilling"
                value={input}
                onChange={onInputChange}
                className="søkefelt__input"
            />
            <Søkeknapp type="flat" className="søkefelt__søkeknapp" htmlType="submit" />
        </form>
    );
};

export default Søkefelt;
