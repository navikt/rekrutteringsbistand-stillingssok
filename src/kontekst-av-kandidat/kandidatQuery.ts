export const kandidatProxyUrl = '/kandidatsok-proxy';

export type EsRespons = {
    hits: {
        hits: Array<{
            _source: Kandidatrespons;
        }>;
    };
};

export type Geografijobbønske = {
    geografiKode: string;
    geografiKodeTekst: string;
};

export type Yrkejobbønske = {
    sokeTitler: string[];
};

export type Kandidatrespons = {
    fornavn: string;
    etternavn: string;
    arenaKandidatnr: string;
    fodselsdato: string | null;
    adresselinje1: string | null;
    postnummer: string | null;
    poststed: string | null;
    epostadresse: string | null;
    telefon: string | null;
    veileder: string | null;
    geografiJobbonsker: Geografijobbønske[];
    yrkeJobbonskerObj: Yrkejobbønske[];
};

export const byggKandidatQuery = (fodselsnummer: string) => ({
    query: {
        term: {
            fodselsnummer,
        },
    },
    size: 1,
    _source: [
        'fornavn',
        'etternavn',
        'fodselsdato',
        'adresselinje1',
        'postnummer',
        'poststed',
        'epostadresse',
        'telefon',
        'veileder',
        'arenaKandidatnr',
        'geografiJobbonsker',
        'yrkeJobbonskerObj',
    ],
});
