import React, { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';
import { SaveFile } from '@navikt/ds-icons';
import { Button, Detail } from '@navikt/ds-react';
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
            <Button
                disabled
                aria-describedby="lagre-standardsok-beskrivelse"
                className="lagre-standardsøk lagre-standardsøk__har-lagret"
            >
                Lagret som standardsøk
            </Button>
            <Detail size="small" id="lagre-standardsok-beskrivelse" className="blokk-xs">
                Hver gang du benytter søket vil det være ferdig utfylt med kriteriene du har valgt å
                lagre som standardsøk.
            </Detail>
        </>
    ) : (
        <Button
            aria-describedby="lagre-standardsok-beskrivelse"
            disabled={standardsøk.harHentetStandardsøk && standardsøk.lagrerSomStandardsøk}
            onClick={onLagreSomStandardsøkClick}
            className="lagre-standardsøk lagre-standardsøk__knapp"
        >
            <SaveFile className="lagre-standardsøk__lagre-ikon" />
            Lagre som standardsøk
        </Button>
    );
};

export default LagreStandardsøk;
