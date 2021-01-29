import { Query } from '../elasticSearchTyper';
import { Søkekriterier } from '../App';
import { Publisert } from '../søk/HvorErAnnonsenPublisert';
import { Privacy } from '../Stilling';

export const maksAntallTreffPerSøk = 40;

export const lagQuery = (søkekriterier: Søkekriterier): Query => {
    return {
        size: maksAntallTreffPerSøk,
        from: regnUtFørsteTreffFra(søkekriterier.side, maksAntallTreffPerSøk),
        ...sorterPåPublisertDatoHvisTekstErTom(søkekriterier.tekst),
        query: {
            bool: {
                must_not: slettetStilling,
                must: [
                    ikkeHaMedUpublisertStilling,
                    ...søkITittelOgStillingstekst(søkekriterier.tekst),
                ],
                ...filtrerPåPublisert(søkekriterier.publisert),
            },
        },
    };
};

const sorterPåPublisertDatoHvisTekstErTom = (tekst: string) => {
    if (tekst) return [];

    return {
        sort: {
            'stilling.published': { order: 'desc' },
        },
    };
};

const slettetStilling = {
    term: {
        'stilling.status': 'DELETED',
    },
};

const ikkeHaMedUpublisertStilling = {
    bool: {
        should: [
            {
                bool: {
                    must_not: {
                        term: {
                            'stilling.status': 'INACTIVE',
                        },
                    },
                },
            },
            {
                range: {
                    'stilling.expires': {
                        lt: 'now',
                    },
                },
            },
        ],
    },
};

const regnUtFørsteTreffFra = (side: number, antallTreffPerSide: number) =>
    side * antallTreffPerSide - antallTreffPerSide;

const filtrerPåPublisert = (publisert: Publisert) => {
    if (publisert === Publisert.Alle) return {};

    const privacy = publisert === Publisert.Intern ? Privacy.Intern : Privacy.Arbeidsplassen;

    return {
        filter: {
            term: {
                'stilling.privacy': privacy,
            },
        },
    };
};

const søkITittelOgStillingstekst = (tekst: string) => {
    if (!tekst) return [];

    return [
        {
            multi_match: {
                query: tekst,
                fields: ['stilling.adtext_no', 'stilling.title', 'stilling.annonsenr'],
            },
        },
    ];
};
