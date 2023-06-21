import { EsRespons } from '../../kontekst-av-kandidat/useKandidat';

const kandidatsøk: EsRespons = {
    hits: {
        hits: [
            {
                _source: {
                    etternavn: 'Klippfisk',
                    fornavn: 'Uklar',
                    fodselsdato: '1977-10-06T23:00:00.000+00:00',
                    adresselinje1: 'Langerudsvingen 18D',
                    postnummer: '1187',
                    poststed: 'Oslo',
                    epostadresse: 'mock111@Mock111.com',
                    telefon: '+47 40491880',
                    veileder: 'a100000',
                    arenaKandidatnr: 'AA100100',
                    geografiJobbonsker: [
                        {
                            geografiKodeTekst: 'Lindesnes',
                            geografiKode: 'NO42.4205',
                        },
                        {
                            geografiKodeTekst: 'Råde',
                            geografiKode: 'NO01.3017',
                        },
                        {
                            geografiKodeTekst: 'Vestby',
                            geografiKode: 'NO01.1234',
                        },
                        {
                            geografiKodeTekst: 'Oslo',
                            geografiKode: 'NO03',
                        },
                        {
                            geografiKodeTekst: 'Bodø',
                            geografiKode: 'NO18.1804',
                        },
                    ],
                    yrkeJobbonskerObj: [
                        {
                            sokeTitler: ['Rektor'],
                        },
                        {
                            sokeTitler: ['Lærer', 'Adjunkt', 'Lektor'],
                        },
                    ],
                },
            },
        ],
    },
};

export default kandidatsøk;
