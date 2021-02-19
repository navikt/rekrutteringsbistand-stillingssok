import { Sortering } from '../../sorter/Sorter';

const sorteringPåUtløpsdato = {
    sort: {
        'stilling.expires': { order: 'desc' },
    },
};

const sorteringPåPubliseringsdato = {
    sort: {
        'stilling.published': { order: 'desc' },
    },
};

export const sorterTreff = (sortering: Sortering, tekst: string) => {
    if (!tekst) {
        return sortering === Sortering.Utløpsdato
            ? sorteringPåUtløpsdato
            : sorteringPåPubliseringsdato;
    }

    if (sortering === Sortering.MestRelevant) return [];
    return sortering === Sortering.Publiseringsdato
        ? sorteringPåPubliseringsdato
        : sorteringPåUtløpsdato;
};
