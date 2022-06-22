import { Stillingskategori } from '../../søk/om-annonsen/VisAlleStillingskategorier';
import { erIkkeProd } from '../../utils/featureToggleUtils';

export const stillingskategori = (stillingskategori: Set<Stillingskategori>) => {
    if (erIkkeProd) {
        const visAlleStillinger = stillingskategori.has(Stillingskategori.Alle);

        if (visAlleStillinger) {
            return [];
        } else {
            return ingenJobbmesserEllerFormidlingsstillinger;
        }
    } else {
        return [];
    }
};

const ingenJobbmesserEllerFormidlingsstillinger = [
    {
        bool: {
            must_not: [
                {
                    term: {
                        'stillingsinfo.stillingskategori': 'FORMIDLING',
                    },
                },
                {
                    term: {
                        'stillingsinfo.stillingskategori': 'JOBBMESSE',
                    },
                },
            ],
        },
    },
];
