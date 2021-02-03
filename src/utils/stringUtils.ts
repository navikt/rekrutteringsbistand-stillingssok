const skalVæreMedSmåBokstaver = ['i', 'og', 'for', 'på', 'avd', 'av'];
const skalVæreMedStoreBokstaver = ['as', 'ab', 'asa', 'ba', 'sa'];

export default function formaterMedStoreOgSmåBokstaver(tekst?: string | null): string | undefined {
    if (!tekst) return undefined;

    let formatert = tekst.toLowerCase();

    formatert = gjørFørsteBokstavEtterSeparatorStor(formatert, ' ');
    formatert = gjørFørsteBokstavEtterSeparatorStor(formatert, '-');
    formatert = gjørFørsteBokstavEtterSeparatorStor(formatert, '(');
    formatert = gjørFørsteBokstavEtterSeparatorStor(formatert, '/');

    return formatert;
}

const gjørFørsteBokstavEtterSeparatorStor = (setning: string, separator: string): string => {
    const splittet = setning.split(separator);

    return splittet.map(formaterOrd).join(separator);
};

const formaterOrd = (ord: string): string => {
    if (skalVæreMedStoreBokstaver.includes(ord)) {
        return ord.toUpperCase();
    } else if (!skalVæreMedSmåBokstaver.includes(ord)) {
        const førsteBokstav: string | undefined = ord[0];
        return førsteBokstav === undefined ? ord : førsteBokstav.toUpperCase() + ord.substring(1);
    } else {
        return ord;
    }
};

export const sorterAlfabetiskPåNorsk = (ord1: string, ord2: string): number =>
    ord1.localeCompare(ord2, 'nb-NO');
