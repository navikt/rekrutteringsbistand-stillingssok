import { CheckboksPanel } from 'nav-frontend-skjema';
import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import { byggUrlMedParam, hentSøkekriterier, QueryParam } from './søkefelt/urlUtils';
import { useHistory, useLocation } from 'react-router-dom';
import './Søk.less';

const Søk: FunctionComponent = () => {
    const history = useHistory();
    const location = useLocation();

    const [kunInterne, setKunInterne] = useState<boolean>(
        hentSøkekriterier(location.search).kunInterne
    );

    const onKunInterneChange = (event: ChangeEvent<HTMLInputElement>) => {
        const kunInterne = event.target.checked;
        setKunInterne(kunInterne);
        const url = byggUrlMedParam(QueryParam.KunInterne, kunInterne);
        history.replace({ search: url.search });
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
