import { EsRespons } from '../../kandidatbanner/useKandidat';

const kandidatsøk: EsRespons = {
    hits: {
        hits: [
            {
                _source: {
                    etternavn: 'Klippfisk',
                    fornavn: 'Uklar',
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
                },
            },
        ],
    },
};

export default kandidatsøk;
