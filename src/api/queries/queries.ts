import { Query } from '../../elasticSearchTyper';
import { Søkekriterier } from '../../App';
import { alleStillinger as defaultStatusFilter, status } from './status';
import { Fane } from '../../søkefaner/Søkefaner';
import sorterTreff from './sortering';
import publisert from './publisert';
import geografi from './geografi';
import inkludering from './inkludering';
import søkefelt from './søkefelt';

export const maksAntallTreffPerSøk = 40;

export const lagQuery = (søkekriterier: Søkekriterier): Query => {
    return {
        size: maksAntallTreffPerSøk,
        from: regnUtFørsteTreffFra(søkekriterier.side, maksAntallTreffPerSøk),
        track_total_hits: false,
        query: query(søkekriterier),
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

const query = (søkekriterier: Søkekriterier, alternativFane?: Fane) => {
    return {
        bool: {
            must: [...søkefelt(søkekriterier.tekst, alternativFane || søkekriterier.fane)],
            filter: [
                ...publisert(søkekriterier.publisert),
                ...geografi(søkekriterier.fylker, søkekriterier.kommuner),
                ...status(søkekriterier.statuser),
                ...inkludering(
                    søkekriterier.hovedinkluderingstags,
                    søkekriterier.subinkluderingstags
                ),
            ],
        },
    };
};

const aggregeringer = (søkekriterier: Søkekriterier) => {
    return {
        aggs: {
            globalAggregering: {
                global: {},
                aggs: {
                    faner: {
                        filters: {
                            filters: {
                                alle: query(søkekriterier, Fane.Alle),
                                arbeidsgiver: query(søkekriterier, Fane.Arbeidsgiver),
                                annonsetittel: query(søkekriterier, Fane.Annonsetittel),
                                annonsetekst: query(søkekriterier, Fane.Annonsetekst),
                            },
                        },
                    },
                },
            },
        },
    };
};

const regnUtFørsteTreffFra = (side: number, antallTreffPerSide: number) =>
    side * antallTreffPerSide - antallTreffPerSide;
