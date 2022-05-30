import React, { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QueryParam } from '../../utils/urlUtils';
import useStandardsøk from '../../StandardsøkContext';
import { Label } from '@navikt/ds-react';
import css from './BrukStandardsøk.module.css';
import classNames from 'classnames';

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
            className={classNames(css.brukStandardsøk, 'navds-link')}
        >
            <Label>Bruk standardsøk</Label>
        </Link>
    ) : (
        <div />
    );
};

export default BrukStandardsøk;
