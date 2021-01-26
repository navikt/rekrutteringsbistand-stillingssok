import React, { ChangeEvent, FormEvent, FunctionComponent, useState } from 'react';
import { Søkeknapp } from 'nav-frontend-ikonknapper';
import { Input } from 'nav-frontend-skjema';
import { useHistory } from 'react-router-dom';
import './Søkefelt.less';
import { hentInputFraUrl, lagUrlMedInput } from './urlUtils';

type Props = {
    onSøk: (tekst: string) => void;
};

const Søkefelt: FunctionComponent<Props> = ({ onSøk }) => {
    const [input, setInput] = useState<string>(hentInputFraUrl());
    const history = useHistory();

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSøk(input);
        const url = lagUrlMedInput(input);
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
