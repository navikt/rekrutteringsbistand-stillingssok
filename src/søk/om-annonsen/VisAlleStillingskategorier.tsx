import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../../utils/urlUtils';

export enum Stillingskategori {
    Alle = 'alle',
}

const VisAlleStillingskategorier = () => {
    const history = useHistory();

    const { search } = useLocation<Navigeringsstate>();
    const [stillingskategorier, setStillingskategorier] = useState<Set<Stillingskategori>>(
        hentSøkekriterier(search).stillingskategorier
    );

    useEffect(() => {
        setStillingskategorier(hentSøkekriterier(search).stillingskategorier);
    }, [search]);

    const onToggle = (event: ChangeEvent<HTMLInputElement>) => {
        const stillingskategorier = event.target.checked ? [Stillingskategori.Alle] : [];

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Stillingskategorier,
            verdi: stillingskategorier,
        });
    };

    return (
        <CheckboxGroup legend="Stillingskategori" value={Array.from(stillingskategorier)}>
            <Checkbox value={Stillingskategori.Alle} onChange={onToggle}>
                Vis formidlingsstillinger og jobbmesser/jobbtreff
            </Checkbox>
        </CheckboxGroup>
    );
};

export default VisAlleStillingskategorier;
