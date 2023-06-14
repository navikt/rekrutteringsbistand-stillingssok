import React, { FunctionComponent } from 'react';
import { Chips } from '@navikt/ds-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../../utils/urlUtils';
import { Status, statusTilVisningsnavn } from '../om-annonsen/Annonsestatus';
import { Publisert, publisertTilVisningsnavn } from '../om-annonsen/HvorErAnnonsenPublisert';
import {
    Stillingskategori,
    stillingskategoriTilVisningsnavn,
} from '../om-annonsen/VelgStillingskategori';
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

    const handleStatusClick = (status: Status) => {
        const oppdaterteStatuser = new Set<Status>(statuser);
        oppdaterteStatuser.delete(status);

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Statuser,
            verdi: Array.from(oppdaterteStatuser),
        });
    };

    const handlePublisertClick = (valgtPubliseringssted: Publisert) => {
        const oppdatertePubliseringssteder = new Set<Publisert>(publisert);
        oppdatertePubliseringssteder.delete(valgtPubliseringssted);

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Publisert,
            verdi: Array.from(oppdatertePubliseringssteder),
        });
    };

    const handleStillingskategoriClick = (kategori: Stillingskategori) => {
        const oppdaterteStillingskategorier = new Set<Stillingskategori>(stillingskategorier);
        oppdaterteStillingskategorier.delete(kategori);

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Stillingskategorier,
            verdi: Array.from(oppdaterteStillingskategorier),
        });
    };

    const handleFylkeClick = (fylke: string) => {
        const oppdaterteFylker = new Set<string>(fylker);
        oppdaterteFylker.delete(fylke);

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Fylker,
            verdi: Array.from(oppdaterteFylker),
        });
    };

    const handleKommuneClick = (kommune: string) => {
        const oppdaterteKommuner = new Set<string>(kommuner);
        oppdaterteKommuner.delete(kommune);

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Kommuner,
            verdi: Array.from(oppdaterteKommuner),
        });
    };

    const handleHovedinkluderingstagsClick = (hovedinkluderingstag: string) => {
        const oppdaterteHovedinkluderingstags = new Set<string>(hovedinkluderingstags);
        oppdaterteHovedinkluderingstags.delete(hovedinkluderingstag);

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.HovedInkluderingTags,
            verdi: Array.from(oppdaterteHovedinkluderingstags),
        });
    };

    const handleSubinkluderingstagsClick = (subinkluderingstag: string) => {
        const oppdaterteSubinkluderingstags = new Set<string>(subinkluderingstags);
        oppdaterteSubinkluderingstags.delete(subinkluderingstag);

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.SubInkluderingTags,
            verdi: Array.from(oppdaterteSubinkluderingstags),
        });
    };

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
                        handleStatusClick(status);
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
                        handlePublisertClick(derAnnonsenErpublisert);
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
                        handleStillingskategoriClick(kategori);
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
                        handleFylkeClick(fylke);
                    }}
                >
                    {fylke}
                </Chips.Removable>
            ))}

            {valgteKommuner.map((kommune) => (
                <Chips.Removable
                    key={kommune}
                    variant={'neutral'}
                    onDelete={() => {
                        handleKommuneClick(kommune);
                    }}
                >
                    {kommune.split('.')[1]}
                </Chips.Removable>
            ))}

            {hovedInkluderingstagsUtenValgteSubinkluderingtags.map((hovedinkluderingtag) => (
                <Chips.Removable
                    key={hovedinkluderingtag}
                    variant={'neutral'}
                    onDelete={() => {
                        handleHovedinkluderingstagsClick(hovedinkluderingtag);
                    }}
                >
                    {visningsnavnForFilter[hovedinkluderingtag as Hovedtag]}
                </Chips.Removable>
            ))}

            {valgteSubinkluderingstags.map((subinkluderingtag) => (
                <Chips.Removable
                    key={subinkluderingtag}
                    variant={'neutral'}
                    onDelete={() => {
                        handleSubinkluderingstagsClick(subinkluderingtag);
                    }}
                >
                    {visningsnavnForFilter[subinkluderingtag as Subtag]}
                </Chips.Removable>
            ))}
        </Chips>
    );
};

export default ValgteKrierier;
