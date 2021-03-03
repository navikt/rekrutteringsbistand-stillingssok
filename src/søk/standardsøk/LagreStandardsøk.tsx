import React, { FunctionComponent } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { useLocation } from 'react-router-dom';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { SaveFile } from '@navikt/ds-icons';
import './LagreStandardsøk.less';
import { PopoverOrientering } from 'nav-frontend-popover';
import { standardsøkLocalstorageKey } from './useStandardsøk';

type Props = {
    standardsøkErAktivt: boolean;
    setStandardsøkTilAktivt: () => void;
};

const LagreStandardsøk: FunctionComponent<Props> = ({
    standardsøkErAktivt,
    setStandardsøkTilAktivt,
}) => {
    const { search } = useLocation();

    const onLagreSomStandardsøkClick = () => {
        localStorage.setItem(standardsøkLocalstorageKey, search);
        setStandardsøkTilAktivt();
    };

    return standardsøkErAktivt ? (
        <AlertStripeSuksess className="lagre-standardsøk lagre-standardsøk__alertstripe">
            Lagret som standardsøk
            <Hjelpetekst className="lagre-standardsøk__hjelpetekst" type={PopoverOrientering.Under}>
                Hver gang du benytter søket vil det være ferdig utfylt med kriteriene du har valgt å
                lagre som standardsøk.
            </Hjelpetekst>
        </AlertStripeSuksess>
    ) : (
        <Knapp
            onClick={onLagreSomStandardsøkClick}
            className=" lagre-standardsøk lagre-standardsøk__knapp"
        >
            <SaveFile className="lagre-standardsøk__lagre-ikon" />
            Lagre som standardsøk
        </Knapp>
    );
};

export default LagreStandardsøk;
