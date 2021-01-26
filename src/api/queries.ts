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
        multi_match: {
            query: tekst,
            fields: ['stilling.adtext_no', 'stilling.title'],
        },
    },
});
