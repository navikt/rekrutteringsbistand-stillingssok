import React, { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QueryParam } from '../../utils/urlUtils';
import useStandardsøk from '../../StandardsøkContext';
import { Label } from '@navikt/ds-react';
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
        >
            <Label>Bruk standardsøk</Label>
        </Link>
    ) : (
        <div />
    );
};

export default BrukStandardsøk;
