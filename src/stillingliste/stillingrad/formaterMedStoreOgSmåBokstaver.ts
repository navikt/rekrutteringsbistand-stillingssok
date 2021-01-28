const skalVæreMedSmåBokstaver = ['i', 'og', 'for', 'på', 'avd', 'av'];
const skalVæreMedStoreBokstaver = ['as', 'ab', 'asa', 'ba', 'sa'];

export default function formatterMedStoreOgSmåBokstaver(tekst: string): string {
    let formattert = tekst.toLowerCase();

    formattert = gjørFørsteBokstavEtterSeparatorStor(formattert, ' ');
    formattert = gjørFørsteBokstavEtterSeparatorStor(formattert, '-');
    formattert = gjørFørsteBokstavEtterSeparatorStor(formattert, '(');
    formattert = gjørFørsteBokstavEtterSeparatorStor(formattert, '/');

    return formattert;
}

const gjørFørsteBokstavEtterSeparatorStor = (setning: string, separator: string): string => {
    const splittet = setning.split(separator);
    return splittet.map(formatterOrd).join(separator);
};

const formatterOrd = (ord: string): string => {
    if (skalVæreMedStoreBokstaver.includes(ord)) return ord.toUpperCase();
    else if (!skalVæreMedSmåBokstaver.includes(ord)) return ord[0].toUpperCase() + ord.substring(1);
    else return ord;
};
