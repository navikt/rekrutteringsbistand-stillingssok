import React, { FunctionComponent } from 'react';
import { SaveFile, Success } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import useStandardsøk from '../../StandardsøkContext';
import useNavigering from '../../useNavigering';
import css from './LagreStandardsøk.module.css';

const LagreStandardsøk: FunctionComponent = () => {
    const { searchParams } = useNavigering();
    const { standardsøk, oppdaterStandardsøk } = useStandardsøk();

    const onLagreSomStandardsøkClick = () => {
        oppdaterStandardsøk(searchParams);
    };

    const aktivtSøkErStandardsøk =
        standardsøk.harHentetStandardsøk && standardsøk.standardsøk === searchParams.toString();

    return aktivtSøkErStandardsøk ? (
        <Button
            disabled
            variant="secondary"
            className={css.knapp}
            aria-describedby="lagre-standardsok-beskrivelse"
        >
            <Success />
            Lagret som standardsøk
        </Button>
    ) : (
        <Button
            variant="secondary"
            loading={standardsøk.harHentetStandardsøk && standardsøk.lagrerSomStandardsøk}
            disabled={standardsøk.harHentetStandardsøk && standardsøk.lagrerSomStandardsøk}
            onClick={onLagreSomStandardsøkClick}
            className={css.knapp}
            aria-describedby="lagre-standardsok-beskrivelse"
        >
            <SaveFile />
            Lagre som standardsøk
        </Button>
    );
};

export default LagreStandardsøk;
