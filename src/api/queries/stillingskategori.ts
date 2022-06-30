import { Stillingskategori } from '../../søk/om-annonsen/VelgStillingskategori';

export const stillingskategori = (stillingskategori: Set<Stillingskategori>) => {
    const visAlleStillinger = stillingskategori.size === Object.keys(Stillingskategori).length;

    if (visAlleStillinger) {
        return [];
    } else {
        return kunValgteKategorier(stillingskategori);
    }
};

const kunValgteKategorier = (stillingskategori: Set<Stillingskategori>) => {
    if (stillingskategori.size === 0 || stillingskategori.has(Stillingskategori.Stilling)) {
        const mustNot = [];

        if (!stillingskategori.has(Stillingskategori.Formidling)) {
            mustNot.push(Stillingskategori.Formidling);
        }

        if (!stillingskategori.has(Stillingskategori.Jobbmesse)) {
            mustNot.push(Stillingskategori.Jobbmesse);
        }

        const skalEkskluderes = mustNot.map((kategori) => ({
            term: {
                'stillingsinfo.stillingskategori': kategori,
            },
        }));

        return [
            {
                bool: {
                    must_not: skalEkskluderes,
                },
            },
        ];
    } else {
        const skalInkluderes = Array.from(stillingskategori).map((kategori) => ({
            term: {
                'stillingsinfo.stillingskategori': kategori,
            },
        }));

        return [
            {
                bool: {
                    should: skalInkluderes,
                },
            },
        ];
    }
};
