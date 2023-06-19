import { Søkefelt } from '../../søkefelter/Søkefelter';
import { Query } from '../../domene/elasticSearchTyper';
import { Søkekriterier } from '../../Stillingssøk';
import { status } from './status';
import { stillingskategori } from './stillingskategori';
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
        track_total_hits: true,
        query: lagIndreQuery(søkekriterier),
        ...sorterTreff(søkekriterier.sortering, søkekriterier.tekst),
        ...aggregeringer(søkekriterier),
    };
};

export const lagIndreQuery = (søkekriterier: Søkekriterier, alternativtFelt?: Søkefelt) => {
    return {
        bool: {
            should: [
                ...søkefelt(
                    søkekriterier.tekst,
                    alternativtFelt ? new Set<Søkefelt>([alternativtFelt]) : søkekriterier.felter
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
    let queriesForFeltaggregering: Partial<Record<Søkefelt, object>> = {};

    if (søkekriterier.tekst.size > 0) {
        queriesForFeltaggregering = {
            ...queriesForFeltaggregering,
            arbeidsgiver: lagIndreQuery(søkekriterier, Søkefelt.Arbeidsgiver),
            annonsetittel: lagIndreQuery(søkekriterier, Søkefelt.Annonsetittel),
            annonsetekst: lagIndreQuery(søkekriterier, Søkefelt.Annonsetekst),
            annonsenummer: lagIndreQuery(søkekriterier, Søkefelt.Annonsenummer),
        };
    } else {
        return {};
    }

    return {
        aggs: {
            globalAggregering: {
                global: {},
                aggs: {
                    felter: {
                        filters: {
                            filters: queriesForFeltaggregering,
                        },
                    },
                },
            },
        },
    };
};

const regnUtFørsteTreffFra = (side: number, antallTreffPerSide: number) =>
    side * antallTreffPerSide - antallTreffPerSide;
