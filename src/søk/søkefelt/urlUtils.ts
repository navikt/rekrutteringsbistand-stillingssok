import { Søkekriterier } from '../../App';

export enum QueryParam {
    Tekst = 'q',
    KunInterne = 'kunInterne',
}

export const hentSøkekriterier = (search: string): Søkekriterier => {
    const searchParams = new URLSearchParams(search);

    return {
        tekst: searchParams.get(QueryParam.Tekst) || '',
        kunInterne: searchParams.get(QueryParam.KunInterne) === 'true',
    };
};

export const byggUrlMedParam = (param: QueryParam, value: string | boolean) => {
    const url = new URL(window.location.href);

    if (
        (typeof value === 'string' && value.length === 0) ||
        (typeof value === 'boolean' && value === false)
    ) {
        url.searchParams.delete(param);
    } else {
        url.searchParams.set(param, String(value));
    }

    return url;
};
