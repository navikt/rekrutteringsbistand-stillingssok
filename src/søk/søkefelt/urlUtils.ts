import { Søkekriterier } from '../../App';
import { Publisert } from '../HvorErAnnonsenPublisert';

export enum QueryParam {
    Tekst = 'q',
    Publisert = 'publisert',
    Side = 'side',
    Fylker = 'fylker',
}

export type QueryParamValue = string | boolean | null | number | string[];

export const hentSøkekriterier = (search: string): Søkekriterier => {
    const searchParams = new URLSearchParams(search);

    const fylkerQueryParam = searchParams.get(QueryParam.Fylker);
    const fylker = fylkerQueryParam
        ? new Set<string>(fylkerQueryParam.split(','))
        : new Set<string>();

    return {
        side: parseInt(searchParams.get(QueryParam.Side) ?? '1'),
        tekst: searchParams.get(QueryParam.Tekst) ?? '',
        publisert: (searchParams.get(QueryParam.Publisert) as Publisert) ?? Publisert.Alle,
        fylker,
    };
};

export const byggUrlMedParam = (param: QueryParam, value: QueryParamValue) => {
    const url = new URL(window.location.href);

    if (
        value === null ||
        (typeof value === 'string' && value.length === 0) ||
        (typeof value === 'boolean' && value === false) ||
        (value instanceof Array && value.length === 0)
    ) {
        url.searchParams.delete(param);
    } else {
        url.searchParams.set(param, String(value));
    }

    return url;
};
