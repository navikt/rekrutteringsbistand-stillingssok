import { Query } from '../../domene/elasticSearchTyper';
import { Søkekriterier } from '../../Stillingssøk';
import { alleStillinger as defaultStatusFilter, status } from './status';
import { Fane } from '../../søkefaner/Søkefaner';
import sorterTreff from './sortering';
import publisert from './publisert';
import geografi from './geografi';
import inkludering from './inkludering';
import søkefelt from './søkefelt';
import { stillingskategori } from './stillingskategori';

export const maksAntallTreffPerSøk = 40;

export const lagQuery = (søkekriterier: Søkekriterier): Query => {
    return {
        size: maksAntallTreffPerSøk,
        from: regnUtFørsteTreffFra(søkekriterier.side, maksAntallTreffPerSøk),
        track_total_hits: false,
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

export const lagIndreQuery = (søkekriterier: Søkekriterier, alternativFane?: Fane) => {
    return {
        bool: {
            should: [...søkefelt(søkekriterier.tekst, alternativFane || søkekriterier.fane)],
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
    let queriesForFaneaggregering: Partial<Record<Fane, object>> = {
        alle: lagIndreQuery(søkekriterier, Fane.Alle),
    };

    if (søkekriterier.tekst.size > 0) {
        queriesForFaneaggregering = {
            ...queriesForFaneaggregering,
            arbeidsgiver: lagIndreQuery(søkekriterier, Fane.Arbeidsgiver),
            annonsetittel: lagIndreQuery(søkekriterier, Fane.Annonsetittel),
            annonsetekst: lagIndreQuery(søkekriterier, Fane.Annonsetekst),
        };
    }

    return {
        aggs: {
            globalAggregering: {
                global: {},
                aggs: {
                    faner: {
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
