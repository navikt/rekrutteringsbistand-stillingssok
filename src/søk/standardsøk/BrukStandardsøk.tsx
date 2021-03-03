import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';
import { QueryParam } from '../søkefelt/urlUtils';
import './BrukStandardsøk.less';

const BrukStandardsøk: FunctionComponent = () => {
    return (
        <Link
            to={{
                search: `?${QueryParam.Standardsøk}`,
                state: {
                    brukStandardsøk: true,
                },
            }}
            className="bruk-standardsøk lenke"
        >
            <Element>Bruk standardsøk</Element>
        </Link>
    );
};

export default BrukStandardsøk;
