import { Stillingskategori } from '../../søk/om-annonsen/VisAlleStillingskategorier';
import { erIkkeProd } from '../../utils/featureToggleUtils';

export const stillingskategori = (stillingskategori: Set<Stillingskategori>) => {
    if (erIkkeProd) {
        const visAlleStillinger = stillingskategori.has(Stillingskategori.Alle);
        if (visAlleStillinger) {
            return [];
        } else {
            return kunStillingskategoriStilling;
        }
    } else {
        return [];
    }
};

const kunStillingskategoriStilling = [
    {
        bool: {
            must: [
                {
                    term: {
                        'stillingsinfo.stillingskategori': 'STILLING',
                    },
                },
            ],
        },
    },
];
