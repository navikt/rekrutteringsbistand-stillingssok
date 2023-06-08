import { Søknadsfrist } from '../../domene/Stilling';

export const konverterTilPresenterbarDato = (datoString?: string | null): string => {
    if (!datoString) return '';
    if (datoString === Søknadsfrist.Snarest) return datoString;

    const presentarbarDatoString = new Date(datoString as string).toLocaleDateString('nb-NO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    return presentarbarDatoString === 'Invalid Date' ? datoString : presentarbarDatoString;
};
