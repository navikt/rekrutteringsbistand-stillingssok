import React, { FunctionComponent } from 'react';
import { Chips } from '@navikt/ds-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../../utils/urlUtils';
import { statusTilVisningsnavn } from '../om-annonsen/Annonsestatus';
import { publisertTilVisningsnavn } from '../om-annonsen/HvorErAnnonsenPublisert';
import { stillingskategoriTilVisningsnavn } from '../om-annonsen/VelgStillingskategori';
import { Hovedtag, Subtag, visningsnavnForFilter } from '../inkludering/tags';

const ValgteKrierier: FunctionComponent = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { pathname } = useLocation();
    const {
        statuser,
        publisert,
        stillingskategorier,
        fylker,
        kommuner,
        hovedinkluderingstags,
        subinkluderingstags,
        tekst,
    } = hentSøkekriterier(searchParams);

    const handleTømFiltreClick = () => {
        const parametre = new URLSearchParams(searchParams);

        for (const key of Array.from(parametre.keys())) {
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
                replace: true,
                state: {
                    harSlettetKriterier: true,
                },
            }
        );
    };

    function handleClick<T>(skalFjernes: T, elementer: Set<T>, parameter: QueryParam) {
        const oppdaterteElementer = new Set<any>(elementer);
        oppdaterteElementer.delete(skalFjernes);

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: parameter,
            verdi: Array.from(oppdaterteElementer),
        });
    }

    const valgteKommuner = Array.from(kommuner);
    const fylkerUtenValgteKommuner = Array.from(fylker).filter(
        (fylke) => !valgteKommuner.some((kommune) => kommune.startsWith(`${fylke}.`))
    );

    const valgteSubinkluderingstags = Array.from(subinkluderingstags);
    const hovedInkluderingstagsUtenValgteSubinkluderingtags = Array.from(
        hovedinkluderingstags
    ).filter(
        (hovedinkluderingstag) =>
            !valgteSubinkluderingstags.some((subinkluderingstag) =>
                subinkluderingstag.startsWith(`${hovedinkluderingstag}__`)
            )
    );

    return (
        <Chips>
            <Chips.Removable onDelete={handleTømFiltreClick}>Tøm alle filtre</Chips.Removable>

            {Array.from(statuser).map((status) => (
                <Chips.Removable
                    key={status}
                    variant="neutral"
                    onDelete={() => {
                        handleClick(status, statuser, QueryParam.Statuser);
                    }}
                >
                    {statusTilVisningsnavn(status)}
                </Chips.Removable>
            ))}

            {Array.from(publisert).map((derAnnonsenErpublisert) => (
                <Chips.Removable
                    key={derAnnonsenErpublisert}
                    variant="neutral"
                    onDelete={() => {
                        handleClick(derAnnonsenErpublisert, publisert, QueryParam.Publisert);
                    }}
                >
                    {publisertTilVisningsnavn(derAnnonsenErpublisert)}
                </Chips.Removable>
            ))}

            {Array.from(stillingskategorier).map((kategori) => (
                <Chips.Removable
                    key={kategori}
                    variant="neutral"
                    onDelete={() => {
                        handleClick(kategori, stillingskategorier, QueryParam.Stillingskategorier);
                    }}
                >
                    {stillingskategoriTilVisningsnavn(kategori)}
                </Chips.Removable>
            ))}

            {fylkerUtenValgteKommuner.map((fylke) => (
                <Chips.Removable
                    key={fylke}
                    variant="neutral"
                    onDelete={() => {
                        handleClick(fylke, fylker, QueryParam.Fylker);
                    }}
                >
                    {fylke}
                </Chips.Removable>
            ))}

            {valgteKommuner.map((kommune) => (
                <Chips.Removable
                    key={kommune}
                    variant="neutral"
                    onDelete={() => {
                        handleClick(kommune, kommuner, QueryParam.Kommuner);
                    }}
                >
                    {kommune.split('.')[1]}
                </Chips.Removable>
            ))}

            {hovedInkluderingstagsUtenValgteSubinkluderingtags.map((hovedinkluderingtag) => (
                <Chips.Removable
                    key={hovedinkluderingtag}
                    variant="neutral"
                    onDelete={() => {
                        handleClick(
                            hovedinkluderingtag,
                            hovedinkluderingstags,
                            QueryParam.HovedInkluderingTags
                        );
                    }}
                >
                    {visningsnavnForFilter[hovedinkluderingtag as Hovedtag]}
                </Chips.Removable>
            ))}

            {valgteSubinkluderingstags.map((subinkluderingtag) => (
                <Chips.Removable
                    key={subinkluderingtag}
                    variant="neutral"
                    onDelete={() => {
                        handleClick(
                            subinkluderingtag,
                            subinkluderingstags,
                            QueryParam.SubInkluderingTags
                        );
                    }}
                >
                    {visningsnavnForFilter[subinkluderingtag as Subtag]}
                </Chips.Removable>
            ))}

            {Array.from(tekst).map((term) => (
                <Chips.Removable
                    key={term}
                    variant="neutral"
                    onDelete={() => {
                        handleClick(term, tekst, QueryParam.Tekst);
                    }}
                >
                    {term}
                </Chips.Removable>
            ))}
        </Chips>
    );
};

export default ValgteKrierier;
