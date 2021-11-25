import React, { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';
import { QueryParam } from '../../utils/urlUtils';
import useStandardsøk from '../../StandardsøkContext';
import './BrukStandardsøk.less';

const BrukStandardsøk: FunctionComponent = () => {
    const { search } = useLocation();
    const { standardsøk } = useStandardsøk();

    const visBrukStandardsøk =
        standardsøk.harHentetStandardsøk &&
        standardsøk.standardsøk !== search &&
        standardsøk !== null;

    return visBrukStandardsøk ? (
        <Link
            to={{
                search: `?${QueryParam.Standardsøk}`,
                state: {
                    brukStandardsøk: true,
                },
            }}
            className="bruk-standardsøk lenke"
            onClick={() => window.scrollTo(0, 0)}
        >
            <Element>Bruk standardsøk</Element>
        </Link>
    ) : (
        <div />
    );
};

export default BrukStandardsøk;
