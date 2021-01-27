import { Query } from '../elasticSearchTyper';

export const generellQuery = (tekst: string): Query => {
    if (tekst.length > 0) {
        return søkITekstfelterQuery(tekst);
    }

    return alleStillingerQuery;
};

export const alleStillingerQuery: Query = {
    query: {
        match_all: {},
    },
};

const søkITekstfelterQuery = (tekst: string): Query => ({
    query: {
        bool: {
            must_not: slettetStilling,
            must: [ikkeHaMedUpublisertStilling, søkITittelOgStillingstekst(tekst)],
        },
    },
});

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

const søkITittelOgStillingstekst = (tekst: string) => ({
    multi_match: {
        query: tekst,
        fields: ['stilling.adtext_no', 'stilling.title'],
    },
});
