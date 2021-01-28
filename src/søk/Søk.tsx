import { CheckboksPanel } from 'nav-frontend-skjema';
import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import './Søk.less';

const Søk: FunctionComponent = () => {
    const [kunInterne, setKunInterne] = useState<boolean>(false); // TODO: Hent fra URL

    const onKunInterneChange = (event: ChangeEvent<HTMLInputElement>) => {
        setKunInterne(event.target.checked);
    };

    return (
        <div className="søk">
            <Søkefelt />
            <CheckboksPanel
                label="Kun interne stillinger"
                checked={kunInterne}
                onChange={onKunInterneChange}
            />
        </div>
    );
};

export default Søk;
