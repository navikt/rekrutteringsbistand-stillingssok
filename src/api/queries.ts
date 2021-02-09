import { Query } from '../elasticSearchTyper';
import { Søkekriterier } from '../App';
import { Publisert } from '../søk/om-annonsen/HvorErAnnonsenPublisert';
import { Privacy } from '../Stilling';
import { Status } from '../søk/om-annonsen/Annonsestatus';
import { erIkkeProd } from '../utils/featureToggleUtils';

export const maksAntallTreffPerSøk = 40;

export const lagQuery = (søkekriterier: Søkekriterier): Query => {
    const filtrerteFylker = beholdFylkerUtenValgteKommuner(
        søkekriterier.fylker,
        søkekriterier.kommuner
    );

    return {
        size: maksAntallTreffPerSøk,
        from: regnUtFørsteTreffFra(søkekriterier.side, maksAntallTreffPerSøk),
        ...sorterPåPublisertDatoHvisTekstErTom(søkekriterier.tekst),
        query: {
            bool: {
                must: [...søkITittelOgStillingstekst(søkekriterier.tekst)],
                filter: [
                    ...publisert(søkekriterier.publisert),
                    ...fylkerOgKommuner(filtrerteFylker, søkekriterier.kommuner),
                    ...(erIkkeProd ? status(søkekriterier.statuser) : [aktivStilling]),
                ],
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
    if (publisert === Publisert.Alle) return [];

    const privacy = publisert === Publisert.Intern ? Privacy.Intern : Privacy.Arbeidsplassen;

    return [
        {
            term: {
                'stilling.privacy': privacy,
            },
        },
    ];
};

const fylkerOgKommuner = (fylker: Set<string>, kommuner: Set<string>) => {
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

/*
    Når alle eller ingen filtre er valgt
        Skal være true
            administration.status ======= done
            publishedByAdmin er satt
            status != rejected
            status != deleted
            publiseringsdato <= i dag

    Sjekkboks "publisert": For å se stillinger som er publiserte i dag
        Skal være true
            status ==== active

    Sjekkboks "stoppet":
        Skal være true:
            status === stopped
            admininstratipn.status === done
            publishedByAdmin er satt
            publiseringsdato <= i dag

    Sjekboks "utløpt": For å se stillinger som har vært publisert men ikke er det i dag
        Skal være true
            administration.status ======= done
            publishedByAdmin er satt
            expiry < i dag
            status === inactive

---

Joar Aurdal  12:40
Her er kriteriene fra gammel løsning:
Alle: administrationStatus=DONE&status=!REJECTED,DELETED
Publisert: administrationStatus=DONE&deactivatedByExpiry=false&status=ACTIVE
Stoppet: administrationStatus=DONE&deactivatedByExpiry=false&status=STOPPED
Utløpt: administrationStatus=DONE&deactivatedByExpiry=true&status=!REJECTED,DELETED
 */
const status = (statuser: Set<Status>) => {
    const ingenFiltreValgt = statuser.size === 0;
    const alleFiltreValgt = statuser.size === Object.keys(Status).length;

    if (ingenFiltreValgt || alleFiltreValgt) {
        return [
            {
                bool: {
                    must_not: [
                        {
                            term: {
                                'stilling.status': 'REJECTED',
                            },
                        },
                        {
                            term: {
                                'stilling.status': 'DELETED',
                            },
                        },
                    ],
                    must: [
                        {
                            term: {
                                'stilling.administration.status': 'DONE',
                            },
                        },
                        {
                            exists: {
                                field: 'stilling.publishedByAdmin',
                            },
                        },
                        {
                            range: {
                                'stilling.published': {
                                    lte: 'now/d',
                                },
                            },
                        },
                    ],
                },
            },
        ];
    }

    let should: any[] = [];

    const publisert = {
        term: {
            'stilling.status': 'ACTIVE',
        },
    };
    if (statuser.has(Status.Publisert)) should.push(publisert);

    const stoppet = {
        bool: {
            must: [
                { term: { 'stilling.status': 'STOPPED' } },
                {
                    term: {
                        'stilling.administration.status': 'DONE',
                    },
                },
                {
                    exists: {
                        field: 'stilling.publishedByAdmin',
                    },
                },
                {
                    range: {
                        'stilling.published': {
                            lte: 'now/d',
                        },
                    },
                },
            ],
        },
    };
    if (statuser.has(Status.Stoppet)) should.push(stoppet);

    const utløpt = {
        bool: {
            must: [
                { term: { 'stilling.status': 'INACTIVE' } },
                {
                    term: {
                        'stilling.administration.status': 'DONE',
                    },
                },
                {
                    exists: {
                        field: 'stilling.publishedByAdmin',
                    },
                },
                {
                    range: {
                        'stilling.published': {
                            lte: 'now/d',
                        },
                    },
                },
                {
                    range: {
                        'stilling.expires': {
                            lt: 'now/d',
                        },
                    },
                },
            ],
        },
    };
    if (statuser.has(Status.Utløpt)) should.push(utløpt);

    return [
        {
            bool: {
                should,
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

const aktivStilling = {
    term: {
        'stilling.status': 'ACTIVE',
    },
};
