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
    Stilling = 'STILLING',
    Jobbmesse = 'JOBBMESSE',
    Formidling = 'FORMIDLING',
}

const VelgStillingskategori = () => {
    const history = useHistory();

    const { search } = useLocation<Navigeringsstate>();
    const [valgteKategorier, setValgteKategorier] = useState<Set<Stillingskategori>>(
        hentSøkekriterier(search).stillingskategorier
    );

    useEffect(() => {
        setValgteKategorier(hentSøkekriterier(search).stillingskategorier);
    }, [search]);

    const onToggle = (event: ChangeEvent<HTMLInputElement>) => {
        const kategori = event.target.value as Stillingskategori;
        const kategorier = new Set<Stillingskategori>(valgteKategorier);

        if (event.target.checked) {
            kategorier.add(kategori);
        } else {
            kategorier.delete(kategori);
        }

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Stillingskategorier,
            verdi: Array.from(kategorier),
        });
    };

    return (
        <CheckboxGroup legend="Stillingskategori" value={Array.from(valgteKategorier)}>
            <Checkbox value={Stillingskategori.Stilling} onChange={onToggle}>
                Stilling
            </Checkbox>
            <Checkbox value={Stillingskategori.Jobbmesse} onChange={onToggle}>
                Jobbmesse/jobbtreff
            </Checkbox>
            <Checkbox value={Stillingskategori.Formidling} onChange={onToggle}>
                Formidlingsstilling
            </Checkbox>
        </CheckboxGroup>
    );
};

export default VelgStillingskategori;
