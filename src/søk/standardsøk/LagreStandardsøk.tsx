import React, { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';
import { SaveFile } from '@navikt/ds-icons';
import { Alert, Button, Detail } from '@navikt/ds-react';
import useStandardsøk from '../../StandardsøkContext';
import './LagreStandardsøk.less';

const LagreStandardsøk: FunctionComponent = () => {
    const { search } = useLocation();
    const { standardsøk, oppdaterStandardsøk } = useStandardsøk();

    const onLagreSomStandardsøkClick = () => {
        oppdaterStandardsøk(search);
    };

    const aktivtSøkErStandardsøk =
        standardsøk.harHentetStandardsøk && standardsøk.standardsøk === search;

    return aktivtSøkErStandardsøk ? (
        <>
            <Alert variant="success" fullWidth className="lagre-standardsøk__er-lagret">
                Lagret som standardsøk
                <Detail size="small">
                    Hver gang du benytter søket vil det være ferdig utfylt med standardsøket.
                </Detail>
            </Alert>
        </>
    ) : (
        <Button
            variant="secondary"
            aria-describedby="lagre-standardsok-beskrivelse"
            disabled={standardsøk.harHentetStandardsøk && standardsøk.lagrerSomStandardsøk}
            onClick={onLagreSomStandardsøkClick}
            className="lagre-standardsøk lagre-standardsøk__knapp"
        >
            <SaveFile />
            Lagre som standardsøk
        </Button>
    );
};

export default LagreStandardsøk;
