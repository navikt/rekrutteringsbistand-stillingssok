import { Query } from '../elasticSearchTyper';
import { Kilde } from '../Stilling';

export const generellQuery = (tekst: string, kunInterne: boolean): Query => {
    if (tekst.length > 0) {
        return søkITekstfelterQuery(tekst, kunInterne);
    }

    return alleStillingerQuery;
};

export const alleStillingerQuery: Query = {
    query: {
        match_all: {},
    },
};

const søkITekstfelterQuery = (tekst: string, kunInterne?: boolean): Query => ({
    query: {
        bool: {
            must_not: slettetStilling,
            must: [ikkeHaMedUpublisertStilling, søkITittelOgStillingstekst(tekst)],
        },
        ...(kunInterne && kunInterneStillinger),
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

const kunInterneStillinger = {
    filter: {
        term: {
            'stilling.source': Kilde.Intern,
        },
    },
};

const søkITittelOgStillingstekst = (tekst: string) => ({
    multi_match: {
        query: tekst,
        fields: ['stilling.adtext_no', 'stilling.title', 'stilling.annonsenr'],
    },
});
