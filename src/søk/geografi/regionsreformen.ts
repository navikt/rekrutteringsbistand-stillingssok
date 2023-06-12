const mapFraGammeltTilNyttFylkesnummer: Record<string, string> = {
    '16': '50',
    '17': '50',
    '12': '46',
    '14': '46',
    '09': '42',
    '10': '42',
    '07': '38',
    '08': '38',
    '04': '34',
    '05': '34',
    '01': '30',
    '02': '30',
    '06': '30',
    '19': '54',
    '20': '54',
};

export const brukNyttFylkesnummer = (fylkesnummer: string) => {
    return mapFraGammeltTilNyttFylkesnummer[fylkesnummer] ?? fylkesnummer;
};

export default mapFraGammeltTilNyttFylkesnummer;
