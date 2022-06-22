import { Stillingskategori } from '../../søk/om-annonsen/VisAlleStillingskategorier';

export const stillingskategori = (stillingskategori: Set<Stillingskategori>) => {
    const visAlleStillinger = stillingskategori.has(Stillingskategori.Alle);

    if (visAlleStillinger) {
        return [];
    } else {
        return ingenJobbmesserEllerFormidlingsstillinger;
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
