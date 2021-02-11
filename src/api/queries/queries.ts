import { Query } from '../../elasticSearchTyper';
import { Søkekriterier } from '../../App';
import { Publisert } from '../../søk/om-annonsen/HvorErAnnonsenPublisert';
import { status } from './status';

export const maksAntallTreffPerSøk = 40;

export const lagQuery = (søkekriterier: Søkekriterier): Query => {
    return {
        size: maksAntallTreffPerSøk,
        from: regnUtFørsteTreffFra(søkekriterier.side, maksAntallTreffPerSøk),
        ...sorterPåPublisertDatoHvisTekstErTom(søkekriterier.tekst),
        query: {
            bool: {
                must: [...søkITittelOgStillingstekst(søkekriterier.tekst)],
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
        },
        aggs: {
            inkludering: {
                terms: {
                    field: 'stilling.properties.tags',
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

const sorterPåPublisertDatoHvisTekstErTom = (tekst: string) => {
    if (tekst) return [];

    return {
        sort: {
            'stilling.published': { order: 'desc' },
        },
    };
};

const regnUtFørsteTreffFra = (side: number, antallTreffPerSide: number) =>
    side * antallTreffPerSide - antallTreffPerSide;

const publisert = (publisert: Publisert) => {
    if (publisert === Publisert.Intern) {
        return [
            {
                term: {
                    'stilling.source': 'DIR',
                },
            },
        ];
    } else if (publisert === Publisert.Arbeidsplassen) {
        return [
            {
                term: {
                    'stilling.privacy': 'SHOW_ALL',
                },
            },
        ];
    } else {
        return [];
    }
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

const søkITittelOgStillingstekst = (tekst: string) => {
    if (!tekst) return [];

    return [
        {
            multi_match: {
                query: tekst,
                fields: [
                    'stilling.adtext_no',
                    'stilling.title',
                    'stilling.annonsenr',
                    'stilling.employer.name',
                    'stilling.employer.orgnr',
                ],
            },
        },
    ];
};
