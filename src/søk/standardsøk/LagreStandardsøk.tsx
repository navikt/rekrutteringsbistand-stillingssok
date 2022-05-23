import React, { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';
import { SaveFile, Success } from '@navikt/ds-icons';
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

    return (
        <div className="lagre-standardsøk">
            {aktivtSøkErStandardsøk ? (
                <Button
                    disabled
                    variant="secondary"
                    className="lagre-standardsøk lagre-standardsøk__lagre"
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
                    className="lagre-standardsøk lagre-standardsøk__lagre"
                >
                    <SaveFile />
                    Lagre som standardsøk
                </Button>
            )}
            <Detail size="small">
                Når du har lagrer et standardsøk, vil søket alltid være ferdig utfylt med kriteriene
                du har valgt.
            </Detail>
        </div>
    );
};

export default LagreStandardsøk;
