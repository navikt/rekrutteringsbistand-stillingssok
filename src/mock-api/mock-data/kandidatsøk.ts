import { EsRespons } from '../../kandidatbanner/Kandidatbanner';

const kandidatsøk: EsRespons = {
    hits: {
        hits: [
            {
                _source: { etternavn: 'Klippfisk', fornavn: 'Uklar' },
            },
        ],
    },
};

export default kandidatsøk;
