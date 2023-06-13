import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@navikt/ds-react';
import { QueryParam } from '../../utils/urlUtils';
import useStandardsøk from '../../standardsøk/StandardsøkContext';
import useNavigering from '../../useNavigering';

const BrukStandardsøk: FunctionComponent = () => {
    const navigate = useNavigate();
    const { searchParams } = useNavigering();
    const { standardsøk } = useStandardsøk();

    const kanAktivereStandardsøk =
        standardsøk.harHentetStandardsøk &&
        standardsøk.standardsøk !== searchParams.toString() &&
        standardsøk !== null;

    console.log({
        standardsøk: standardsøk.harHentetStandardsøk ? standardsøk.standardsøk : '',
        søk: searchParams.toString(),
    });

    const handleClick = () => {
        navigate(
            {
                search: `?${QueryParam.Standardsøk}`,
            },
            {
                state: {
                    brukStandardsøk: true,
                },
            }
        );
    };

    return (
        <Button variant="secondary" disabled={!kanAktivereStandardsøk} onClick={handleClick}>
            Bruk standardsøk
        </Button>
    );
};

export default BrukStandardsøk;
