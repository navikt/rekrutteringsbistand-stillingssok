import { Stillingskategori } from '../../søk/om-annonsen/VelgStillingskategori';

export const stillingskategori = (stillingskategori: Set<Stillingskategori>) => {
    const visAlleStillinger = stillingskategori.size === 0;

    if (visAlleStillinger) {
        return [];
    } else {
        return kunValgteKategorier(stillingskategori);
    }
};

const kunValgteKategorier = (stillingskategori: Set<Stillingskategori>) => {
    const should = Array.from(stillingskategori).map((kategori) => ({
        term: {
            'stillingsinfo.stillingskategori': kategori,
        },
    }));

    return [
        {
            bool: {
                should,
            },
        },
    ];
};
