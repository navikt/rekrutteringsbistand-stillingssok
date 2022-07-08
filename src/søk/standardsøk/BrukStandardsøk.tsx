import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { QueryParam } from '../../utils/urlUtils';
import useStandardsøk from '../../StandardsøkContext';
import { Label } from '@navikt/ds-react';
import classNames from 'classnames';
import useNavigering from '../../useNavigering';
import css from './BrukStandardsøk.module.css';

const BrukStandardsøk: FunctionComponent = () => {
    const { searchParams } = useNavigering();
    const { standardsøk } = useStandardsøk();

    const visBrukStandardsøk =
        standardsøk.harHentetStandardsøk &&
        standardsøk.standardsøk !== searchParams.toString() &&
        standardsøk !== null;

    return visBrukStandardsøk ? (
        <Link
            to={{
                search: `?${QueryParam.Standardsøk}`,
            }}
            state={{
                brukStandardsøk: true,
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
