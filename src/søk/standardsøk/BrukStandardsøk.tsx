import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { QueryParam } from '../søkefelt/urlUtils';

const BrukStandardsøk: FunctionComponent = () => {
    return (
        <Link to={`?${QueryParam.Standardsøk}`} className="lenke">
            Bruk standardsøk
        </Link>
    );
};

export default BrukStandardsøk;
