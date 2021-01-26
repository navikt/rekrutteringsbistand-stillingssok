export const konverterTilPresenterbarDato = (datoString: string): string => {
    const dato = new Date(datoString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return dato.toLocaleDateString('nb-NO', options);
};
