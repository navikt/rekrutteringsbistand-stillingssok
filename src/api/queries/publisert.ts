import { Publisert } from '../../filter/om-annonsen/HvorErAnnonsenPublisert';

const publisert = (publiseringssteder: Set<Publisert>) => {
    const ettValgtPubliseringssted = publiseringssteder.size === 1;

    if (ettValgtPubliseringssted) {
        if (publiseringssteder.has(Publisert.Intern)) {
            return [
                {
                    term: {
                        'stilling.source': 'DIR',
                    },
                },
            ];
        } else if (publiseringssteder.has(Publisert.Arbeidsplassen)) {
            return [
                {
                    term: {
                        'stilling.privacy': 'SHOW_ALL',
                    },
                },
            ];
        }
    }

    return [];
};

export default publisert;
