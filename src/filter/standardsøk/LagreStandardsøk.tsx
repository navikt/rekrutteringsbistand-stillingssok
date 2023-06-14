import React, { FunctionComponent } from 'react';
import { Button } from '@navikt/ds-react';
import { FloppydiskIcon } from '@navikt/aksel-icons';

import { inneholderSammeKriterier } from './BrukStandardsøk';
import useStandardsøk from '../../standardsøk/StandardsøkContext';
import useNavigering from '../../useNavigering';

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

    if (aktivtSøkErStandardsøk) {
        return null;
    }

    return (
        <Button
            variant="tertiary"
            loading={standardsøk.harHentetStandardsøk && standardsøk.lagrerSomStandardsøk}
            disabled={standardsøk.harHentetStandardsøk && standardsøk.lagrerSomStandardsøk}
            onClick={onLagreSomStandardsøkClick}
            aria-describedby="lagre-standardsok-beskrivelse"
            icon={<FloppydiskIcon />}
            size="small"
        >
            Lagre nytt standardsøk
        </Button>
    );
};

export default LagreStandardsøk;
