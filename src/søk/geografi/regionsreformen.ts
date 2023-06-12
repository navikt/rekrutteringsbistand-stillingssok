const regionsreformen = {
    '50': ['16', '17'],
    '46': ['12', '14'],
    '42': ['09', '10'],
    '38': ['07', '08'],
    '34': ['04', '05'],
    '30': ['01', '02', '06'],
    '54': ['19', '20'],
};

export const sikreNyttRegionformat = (geografiKode: string) => {
    for (const [key, values] of Object.entries(regionsreformen)) {
        if (values.includes(geografiKode)) {
            return key;
        }
    }
    return geografiKode;
};

export default regionsreformen;
