import { Søknadsfrist } from '../../Stilling';

export const konverterTilPresenterbarDato = (datoString: string | undefined): string => {
    if (!datoString) return '';
    if (datoString === Søknadsfrist.Snarest) return datoString;

    return new Date(datoString as string).toLocaleDateString('nb-NO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};
