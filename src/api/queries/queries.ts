import { Query } from '../../domene/elasticSearchTyper';
import { Søkekriterier } from '../../Stillingssøk';
import { alleStillinger as defaultStatusFilter, status } from './status';
import sorterTreff from './sortering';
import publisert from './publisert';
import geografi from './geografi';
import inkludering from './inkludering';
import søkefelt from './søkefelt';
import { stillingskategori } from './stillingskategori';
import { Delsøk } from '../../søkefaner/SøkeChips';

export const maksAntallTreffPerSøk = 40;

export const lagQuery = (søkekriterier: Søkekriterier): Query => {
    return {
        size: maksAntallTreffPerSøk,
        from: regnUtFørsteTreffFra(søkekriterier.side, maksAntallTreffPerSøk),
        track_total_hits: true,
        query: lagIndreQuery(søkekriterier),
        ...sorterTreff(søkekriterier.sortering, søkekriterier.tekst),
        ...aggregeringer(søkekriterier),
    };
};

export const lagQueryPåAnnonsenummer = (søkekriterier: Søkekriterier): Query => {
    return {
        query: {
            bool: {
                filter: [
                    {
                        term: {
                            // TODO: Hvordan fungerer søk på annonsenummer når vi har chips?
                            'stilling.annonsenr': søkekriterier.tekst,
                        },
                    },
                    ...defaultStatusFilter,
                ],
            },
        },
        ...aggregeringer(søkekriterier),
    };
};

export const lagIndreQuery = (søkekriterier: Søkekriterier, alternativeDelsøk?: Delsøk) => {
    console.log('Søkekriterier:', søkekriterier);

    return {
        bool: {
            should: [
                ...søkefelt(
                    søkekriterier.tekst,
                    alternativeDelsøk ? new Set<Delsøk>([alternativeDelsøk]) : søkekriterier.delsøk
                ),
            ],
            minimum_should_match: '1<50%',
            filter: [
                ...publisert(søkekriterier.publisert),
                ...geografi(søkekriterier.fylker, søkekriterier.kommuner),
                ...status(søkekriterier.statuser),
                ...stillingskategori(søkekriterier.stillingskategorier),
                ...inkludering(
                    søkekriterier.hovedinkluderingstags,
                    søkekriterier.subinkluderingstags
                ),
            ],
        },
    };
};

const aggregeringer = (søkekriterier: Søkekriterier) => {
    let queriesForFaneaggregering: Partial<Record<Delsøk, object>> = {};

    if (søkekriterier.tekst.size > 0) {
        queriesForFaneaggregering = {
            ...queriesForFaneaggregering,
            arbeidsgiver: lagIndreQuery(søkekriterier, Delsøk.Arbeidsgiver),
            annonsetittel: lagIndreQuery(søkekriterier, Delsøk.Annonsetittel),
            annonsetekst: lagIndreQuery(søkekriterier, Delsøk.Annonsetekst),
        };
    } else {
        return {};
    }

    return {
        aggs: {
            globalAggregering: {
                global: {},
                aggs: {
                    delsok: {
                        filters: {
                            filters: queriesForFaneaggregering,
                        },
                    },
                },
            },
        },
    };
};

const regnUtFørsteTreffFra = (side: number, antallTreffPerSide: number) =>
    side * antallTreffPerSide - antallTreffPerSide;
