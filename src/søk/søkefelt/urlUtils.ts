import { Søkekriterier } from '../../App';
import { Publisert } from '../HvorErAnnonsenPublisert';

export enum QueryParam {
    Tekst = 'q',
    Publisert = 'publisert',
    Side = 'side',
}

export const hentSøkekriterier = (search: string): Søkekriterier => {
    const searchParams = new URLSearchParams(search);

    return {
        side: parseInt(searchParams.get(QueryParam.Side) || '1'),
        tekst: searchParams.get(QueryParam.Tekst) || '',
        publisert: (searchParams.get(QueryParam.Publisert) as Publisert) || Publisert.Alle,
    };
};

export const byggUrlMedParam = (param: QueryParam, value: string | boolean | null | number) => {
    const url = new URL(window.location.href);

    if (
        value === null ||
        (typeof value === 'string' && value.length === 0) ||
        (typeof value === 'boolean' && value === false)
    ) {
        url.searchParams.delete(param);
    } else {
        url.searchParams.set(param, String(value));
    }

    return url;
};
