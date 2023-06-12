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
                            geografiKodeTekst: 'Østfold',
                            geografiKode: 'NO01',
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
