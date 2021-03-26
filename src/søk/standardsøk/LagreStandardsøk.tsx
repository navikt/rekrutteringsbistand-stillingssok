import React, { FunctionComponent } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { useLocation } from 'react-router-dom';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { SaveFile } from '@navikt/ds-icons';
import { PopoverOrientering } from 'nav-frontend-popover';
import './LagreStandardsøk.less';
import useStandardsøk from '../../StandardsøkContext';

const LagreStandardsøk: FunctionComponent = () => {
    const { search } = useLocation();
    const { standardsøk, oppdaterStandardsøk } = useStandardsøk();

    const onLagreSomStandardsøkClick = () => {
        oppdaterStandardsøk(search);
    };

    const aktivtSøkErStandardsøk =
        standardsøk.harHentetStandardsøk && standardsøk.standardsøk === search;

    return aktivtSøkErStandardsøk ? (
        <AlertStripeSuksess className="lagre-standardsøk lagre-standardsøk__alertstripe">
            Lagret som standardsøk
            <Hjelpetekst className="lagre-standardsøk__hjelpetekst" type={PopoverOrientering.Under}>
                Hver gang du benytter søket vil det være ferdig utfylt med kriteriene du har valgt å
                lagre som standardsøk.
            </Hjelpetekst>
        </AlertStripeSuksess>
    ) : (
        <Knapp
            spinner={standardsøk.harHentetStandardsøk && standardsøk.lagrerSomStandardsøk}
            onClick={onLagreSomStandardsøkClick}
            className=" lagre-standardsøk lagre-standardsøk__knapp"
        >
            <SaveFile className="lagre-standardsøk__lagre-ikon" />
            Lagre som standardsøk
        </Knapp>
    );
};

export const standardsøkLocalstorageKey = 'standardsok';

export default LagreStandardsøk;
