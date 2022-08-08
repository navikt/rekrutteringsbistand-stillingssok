import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import useNavigering from '../../useNavigering';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../../utils/urlUtils';

export enum Stillingskategori {
    Stilling = 'STILLING',
    Jobbmesse = 'JOBBMESSE',
    Formidling = 'FORMIDLING',
}

const VelgStillingskategori = () => {
    const { searchParams, navigate } = useNavigering();

    const [valgteKategorier, setValgteKategorier] = useState<Set<Stillingskategori>>(
        hentSøkekriterier(searchParams).stillingskategorier
    );

    useEffect(() => {
        setValgteKategorier(hentSøkekriterier(searchParams).stillingskategorier);
    }, [searchParams]);

    const onToggle = (event: ChangeEvent<HTMLInputElement>) => {
        const kategori = event.target.value as Stillingskategori;
        const kategorier = new Set<Stillingskategori>(valgteKategorier);

        if (event.target.checked) {
            kategorier.add(kategori);
        } else {
            kategorier.delete(kategori);
        }

        oppdaterUrlMedParam({
            searchParams,
            navigate,
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
                Formidling
            </Checkbox>
        </CheckboxGroup>
    );
};

export default VelgStillingskategori;
