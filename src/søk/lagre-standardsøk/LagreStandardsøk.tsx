import React, { FunctionComponent, useEffect, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { useLocation } from 'react-router-dom';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import Hjelpetekst from 'nav-frontend-hjelpetekst';

const LagreStandardsøk: FunctionComponent = () => {
    const { search } = useLocation();
    const [standardsøkErAktivt, setStandardsøkErAktivt] = useState<boolean>(
        erStandardsøkAktivt(search)
    );

    useEffect(() => {
        setStandardsøkErAktivt(erStandardsøkAktivt(search));
    }, [search]);

    const onLagreSomStandardsøkClick = () => {
        localStorage.setItem(standardsøkLocalstorageKey, search);
        setStandardsøkErAktivt(erStandardsøkAktivt(search));
    };

    return standardsøkErAktivt ? (
        <AlertStripeSuksess>
            Lagret som standardsøk
            <Hjelpetekst>
                Hver gang du benytter søket vil det være ferdig utfylt med kriteriene du har valgt å
                lagre som standardsøk.
            </Hjelpetekst>
        </AlertStripeSuksess>
    ) : (
        <Knapp onClick={onLagreSomStandardsøkClick}>Lagre som standardsøk</Knapp>
    );
};

export const standardsøkLocalstorageKey = 'standardsok';

const erStandardsøkAktivt = (search: string) => {
    const standardsøk = localStorage.getItem(standardsøkLocalstorageKey);
    return standardsøk === search;
};

export default LagreStandardsøk;
