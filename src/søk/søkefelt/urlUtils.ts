import { Søkekriterier } from '../../App';
import { Publisert } from '../om-annonsen/HvorErAnnonsenPublisert';
import { Status } from '../om-annonsen/Annonsestatus';
import { History } from 'history';

export enum QueryParam {
    Tekst = 'q',
    Publisert = 'publisert',
    Side = 'side',
    Fylker = 'fylker',
    Kommuner = 'kommuner',
    Statuser = 'statuser',
    Inkludering = 'inkludering',
}

export type Navigeringsstate =
    | {
          harByttetSide?: boolean;
          harSlettetKriterier?: boolean;
      }
    | undefined;

export type QueryParamValue = string | boolean | null | number | string[];

export const hentSøkekriterier = (search: string): Søkekriterier => {
    const searchParams = new URLSearchParams(search);

    const fylkerQueryParam = searchParams.get(QueryParam.Fylker);
    const fylker = fylkerQueryParam
        ? new Set<string>(fylkerQueryParam.split(','))
        : new Set<string>();

    const kommunerQueryParam = searchParams.get(QueryParam.Kommuner);
    const kommuner = kommunerQueryParam
        ? new Set<string>(kommunerQueryParam.split(','))
        : new Set<string>();

    const statusQueryParam = searchParams.get(QueryParam.Statuser);
    const statuser = statusQueryParam
        ? new Set<Status>(statusQueryParam.split(',') as Status[])
        : new Set<Status>();

    return {
        side: parseInt(searchParams.get(QueryParam.Side) ?? '1'),
        tekst: searchParams.get(QueryParam.Tekst) ?? '',
        publisert: (searchParams.get(QueryParam.Publisert) as Publisert) ?? Publisert.Alle,
        inkludering: searchParams.get(QueryParam.Inkludering) === 'true',
        fylker,
        kommuner,
        statuser,
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

export const oppdaterUrlMedParam = ({
    history,
    parameter,
    verdi,
    state,
}: {
    parameter: QueryParam;
    verdi: QueryParamValue;
    history: History;
    state?: Navigeringsstate;
}) => {
    const { search } = byggUrlMedParam(parameter, verdi);
    history.replace({ search, state });
};
