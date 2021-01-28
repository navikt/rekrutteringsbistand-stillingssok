import React, { ChangeEvent, FormEvent, FunctionComponent, useState } from 'react';
import { Søkeknapp } from 'nav-frontend-ikonknapper';
import { Input } from 'nav-frontend-skjema';
import { useHistory, useLocation } from 'react-router-dom';
import { byggUrlMedParam, hentSøkekriterier, QueryParam } from './urlUtils';
import './Søkefelt.less';

const Søkefelt: FunctionComponent = () => {
    const { search } = useLocation();
    const [input, setInput] = useState<string>(hentSøkekriterier(search).tekst);

    const history = useHistory();

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();

        const url = byggUrlMedParam(QueryParam.Tekst, input);
        history.replace({ search: url.search });
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
