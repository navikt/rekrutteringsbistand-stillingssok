import React, { ChangeEvent, FormEvent, FunctionComponent, useState } from 'react';
import { Søkeknapp } from 'nav-frontend-ikonknapper';
import { Input } from 'nav-frontend-skjema';
import './Søkefelt.less';

type Props = {
    onSøk: (tekst: string) => void;
};

const Søkefelt: FunctionComponent<Props> = ({ onSøk }) => {
    const [input, setInput] = useState<string>('');

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSøk(input);
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
