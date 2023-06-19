import { Sortering } from '../../sorter/Sorter';

const sorteringPåUtløpsdato = {
    sort: {
        'stilling.expires': { order: 'asc' },
    },
};

const sorteringPåPubliseringsdato = {
    sort: {
        'stilling.published': { order: 'desc' },
    },
};

const sorterTreff = (sortering: Sortering, fritekst: Set<string>) => {
    const girMeningÅSorterePåMestRelevant = fritekst.size > 0;

    if (!girMeningÅSorterePåMestRelevant && sortering === Sortering.MestRelevant) {
        return sorteringPåPubliseringsdato;
    }

    switch (sortering) {
        case Sortering.MestRelevant:
            return [];
        case Sortering.Publiseringsdato:
            return sorteringPåPubliseringsdato;
        case Sortering.Utløpsdato:
            return sorteringPåUtløpsdato;
    }
};

export default sorterTreff;
