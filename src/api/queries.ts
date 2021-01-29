import { Query } from '../elasticSearchTyper';
import { Søkekriterier } from '../App';
import { Publisert } from '../søk/HvorErAnnonsenPublisert';
import { Privacy } from '../Stilling';

export const lagQuery = (søkekriterier: Søkekriterier): Query => {
    return {
        query: {
            bool: {
                must_not: slettetStilling,
                must: [
                    ikkeHaMedUpublisertStilling,
                    søkekriterier.tekst && søkITittelOgStillingstekst(søkekriterier.tekst),
                ],
                ...filtrerPåPublisert(søkekriterier.publisert),
            },
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

const filtrerPåPublisert = (publisert: Publisert) => {
    if (publisert === Publisert.Alle) return {};

    const privacy = Publisert.Intern ? Privacy.Intern : Privacy.Arbeidsplassen;
    return {
        filter: {
            term: {
                'stilling.privacy': privacy,
            },
        },
    };
};

const søkITittelOgStillingstekst = (tekst: string) => ({
    multi_match: {
        query: tekst,
        fields: ['stilling.adtext_no', 'stilling.title', 'stilling.annonsenr'],
    },
});
