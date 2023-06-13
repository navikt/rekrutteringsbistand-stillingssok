import React, { FunctionComponent } from 'react';
import { Button } from '@navikt/ds-react';
import { FloppydiskIcon } from '@navikt/aksel-icons';

import useStandardsøk from '../../standardsøk/StandardsøkContext';
import useNavigering from '../../useNavigering';
import { inneholderSammeKriterier } from './BrukStandardsøk';

const LagreStandardsøk: FunctionComponent = () => {
    const { searchParams } = useNavigering();
    const { standardsøk, oppdaterStandardsøk } = useStandardsøk();

    const onLagreSomStandardsøkClick = () => {
        oppdaterStandardsøk(searchParams);
    };

    const aktivtSøkErStandardsøk =
        standardsøk.harHentetStandardsøk &&
        standardsøk.standardsøk !== null &&
        inneholderSammeKriterier(new URLSearchParams(standardsøk.standardsøk), searchParams);

    return aktivtSøkErStandardsøk ? (
        <Button
            disabled
            variant="secondary"
            aria-describedby="lagre-standardsok-beskrivelse"
            icon={<FloppydiskIcon />}
            size="small"
        >
            Lagret som standardsøk
        </Button>
    ) : (
        <Button
            variant="secondary"
            loading={standardsøk.harHentetStandardsøk && standardsøk.lagrerSomStandardsøk}
            disabled={standardsøk.harHentetStandardsøk && standardsøk.lagrerSomStandardsøk}
            onClick={onLagreSomStandardsøkClick}
            aria-describedby="lagre-standardsok-beskrivelse"
            icon={<FloppydiskIcon />}
            size="small"
        >
            Lagre som standardsøk
        </Button>
    );
};

export default LagreStandardsøk;
