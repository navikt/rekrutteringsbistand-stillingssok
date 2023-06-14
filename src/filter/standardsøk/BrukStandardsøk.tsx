import React, { FunctionComponent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@navikt/ds-react';

import { hentSøkekriterier } from '../../utils/urlUtils';
import useStandardsøk from '../../standardsøk/StandardsøkContext';

const BrukStandardsøk: FunctionComponent = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { standardsøk } = useStandardsøk();

    const kanBrukeStandardsøk =
        standardsøk.harHentetStandardsøk &&
        standardsøk.standardsøk &&
        !inneholderSammeKriterier(new URLSearchParams(standardsøk.standardsøk), searchParams);

    const handleClick = () => {
        if (standardsøk.harHentetStandardsøk && standardsøk.standardsøk) {
            navigate(
                {
                    search: standardsøk.standardsøk,
                },
                {
                    replace: true,
                    state: {
                        brukStandardsøk: true,
                    },
                }
            );
        }
    };

    return (
        <Button variant="secondary" disabled={!kanBrukeStandardsøk} onClick={handleClick}>
            Bruk standardsøk
        </Button>
    );
};

export const inneholderSammeKriterier = (
    params: URLSearchParams,
    otherParams: URLSearchParams
): boolean => {
    const kriterier = hentSøkekriterier(params);
    const otherKriterier = hentSøkekriterier(otherParams);

    for (const [kriterie, verdier] of Object.entries(kriterier)) {
        const sammenligning = (otherKriterier as any)[kriterie];

        if (verdier instanceof Set) {
            const arr1 = Array.from(verdier);
            const arr2 = Array.from(sammenligning);

            if (arr1.length !== arr2.length || arr1.some((v) => !arr2.includes(v))) {
                return false;
            }
        } else {
            if (verdier !== sammenligning) {
                return false;
            }
        }
    }

    return true;
};

export default BrukStandardsøk;
