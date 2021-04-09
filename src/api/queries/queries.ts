import { Query } from '../../elasticSearchTyper';
import { Søkekriterier } from '../../App';
import { Publisert } from '../../søk/om-annonsen/HvorErAnnonsenPublisert';
import { alleStillinger as defaultStatusFilter, status } from './status';
import { sorterTreff } from './sortering';
import { Fane } from '../../søkefaner/Søkefaner';

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
                ...fylkerOgKommuner(søkekriterier.fylker, søkekriterier.kommuner),
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

const beholdFylkerUtenValgteKommuner = (fylker: Set<string>, kommuner: Set<string>) => {
    const kommuneArray = Array.from(kommuner);
    const fylkerForKommuner = kommuneArray.map((kommune) => kommune.split('.')[0]);

    return new Set(Array.from(fylker).filter((fylke) => !fylkerForKommuner.includes(fylke)));
};

const regnUtFørsteTreffFra = (side: number, antallTreffPerSide: number) =>
    side * antallTreffPerSide - antallTreffPerSide;

const publisert = (publiseringssteder: Set<Publisert>) => {
    const ettValgtPubliseringssted = publiseringssteder.size === 1;

    if (ettValgtPubliseringssted) {
        if (publiseringssteder.has(Publisert.Intern)) {
            return [
                {
                    term: {
                        'stilling.source': 'DIR',
                    },
                },
            ];
        } else if (publiseringssteder.has(Publisert.Arbeidsplassen)) {
            return [
                {
                    term: {
                        'stilling.privacy': 'SHOW_ALL',
                    },
                },
            ];
        }
    }

    return [];
};

const fylkerOgKommuner = (alleFylker: Set<string>, kommuner: Set<string>) => {
    const fylker = beholdFylkerUtenValgteKommuner(alleFylker, kommuner);
    if (fylker.size === 0 && kommuner.size === 0) return [];

    const shouldFylker =
        fylker.size === 0
            ? []
            : [
                  {
                      terms: {
                          'stilling.locations.county.keyword': Array.from(fylker).map((fylke) =>
                              fylke.toUpperCase()
                          ),
                      },
                  },
              ];

    const shouldKommuner =
        kommuner.size === 0
            ? []
            : [
                  {
                      terms: {
                          'stilling.locations.municipal.keyword': Array.from(
                              kommuner
                          ).map((kommune) => kommune.split('.')[1].toUpperCase()),
                      },
                  },
              ];

    return [
        {
            nested: {
                path: 'stilling.locations',
                query: {
                    bool: {
                        should: [...shouldFylker, ...shouldKommuner],
                    },
                },
            },
        },
    ];
};

const beholdHovedtagsUtenValgteSubtags = (hovedtags: Set<string>, subtags: Set<string>) => {
    const subtagArray = Array.from(subtags);
    const hovedtagsForSubtags = subtagArray.map((subtag) => subtag.split('__')[0]);

    const hovedtagsSomIkkeHarValgteSubtags = Array.from(hovedtags).filter(
        (hovedtag) => !hovedtagsForSubtags.includes(hovedtag)
    );

    return new Set(hovedtagsSomIkkeHarValgteSubtags);
};

const inkludering = (alleHovedtags: Set<string>, subtags: Set<string>) => {
    const hovedtags = beholdHovedtagsUtenValgteSubtags(alleHovedtags, subtags);
    if (hovedtags.size === 0 && subtags.size === 0) return [];

    const samletliste = [...Array.from(hovedtags), ...Array.from(subtags)];

    return [
        {
            terms: {
                'stilling.properties.tags': samletliste,
            },
        },
    ];
};

const søkefelt = (tekst: string, fane: Fane) => {
    if (!tekst) return [];

    let feltManSkalSøkeI;

    if (fane === Fane.Arbeidsgiver) {
        feltManSkalSøkeI = ['stilling.employer.name', 'stilling.employer.orgnr'];
    } else if (fane === Fane.Annonsetittel) {
        feltManSkalSøkeI = ['stilling.title'];
    } else if (fane === Fane.Annonsetekst) {
        feltManSkalSøkeI = ['stilling.adtext_no'];
    } else {
        feltManSkalSøkeI = [
            'stilling.adtext_no',
            'stilling.title',
            'stilling.annonsenr',
            'stilling.employer.name',
            'stilling.employer.orgnr',
        ];
    }

    return [
        {
            multi_match: {
                query: tekst,
                fields: feltManSkalSøkeI,
                operator: fane === Fane.Alle ? 'or' : 'and',
            },
        },
    ];
};
