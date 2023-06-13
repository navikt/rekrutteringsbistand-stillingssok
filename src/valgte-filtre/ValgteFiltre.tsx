import React, { FunctionComponent } from 'react';
import { Chips } from '@navikt/ds-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { QueryParam, hentSøkekriterier } from '../utils/urlUtils';
import { statusTilVisningsnavn } from '../søk/om-annonsen/Annonsestatus';

const ValgteFiltre: FunctionComponent = () => {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const søkekriterier = hentSøkekriterier(searchParams);

    console.log('Søkekriterier:', søkekriterier);

    const navigate = useNavigate();

    const handleTømFiltreClick = () => {
        const parametre = new URLSearchParams(searchParams);

        for (const key of parametre.keys()) {
            if (key !== QueryParam.Sortering) {
                parametre.delete(key);
            }
        }

        navigate(
            {
                pathname,
                search: parametre.toString(),
            },
            {
                state: {
                    harSlettetKriterier: true,
                },
            }
        );
    };

    const handleKriterieClick = (event) => {
        console.log('Hey ho:', event.target.value);
    };

    const keys = Array.from(searchParams.keys());
    const harIngenFiltre = keys.length === 0;
    const harKunSortering = keys.length === 1 && searchParams.has(QueryParam.Sortering);

    if (harIngenFiltre || harKunSortering) {
        return <div />;
    }

    return (
        <Chips>
            <Chips.Removable onClick={handleTømFiltreClick}>Tøm alle filtre</Chips.Removable>

            {Array.from(søkekriterier.statuser).map((status) => (
                <Chips.Removable variant="neutral" key={status} onClick={handleKriterieClick}>
                    {statusTilVisningsnavn(status)}
                </Chips.Removable>
            ))}
        </Chips>
    );
};

export default ValgteFiltre;
