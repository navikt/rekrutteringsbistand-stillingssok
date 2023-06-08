import { EsRespons } from '../../kandidat/Kandidat';

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
