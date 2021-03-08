import React, { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';
import { QueryParam } from '../søkefelt/urlUtils';
import useLocalStorage from '../../utils/useLocalStorage';
import { standardsøkLocalstorageKey } from './LagreStandardsøk';
import './BrukStandardsøk.less';

const BrukStandardsøk: FunctionComponent = () => {
    const { search } = useLocation();
    const { verdi: standardsøk } = useLocalStorage(standardsøkLocalstorageKey);

    return standardsøk !== search && standardsøk !== null ? (
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
    ) : (
        <div />
    );
};

export default BrukStandardsøk;
