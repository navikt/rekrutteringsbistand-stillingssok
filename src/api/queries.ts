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
                must: [...søkITittelOgStillingstekst(søkekriterier.tekst)],
                filter: [
                    ...publisert(søkekriterier.publisert),
                    aktivStilling,
                    ...fylker(['ROGALAND']),
                ],
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

const fylker = (fylker: string[]) => {
    if (fylker.length === 0) return [];

    const should = fylker.map((fylke) => ({
        match: {
            'stilling.locations.county': {
                query: fylke,
                operator: 'and',
            },
        },
    }));

    return [
        {
            nested: {
                path: 'stilling.locations',
                query: {
                    bool: {
                        should,
                    },
                },
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
