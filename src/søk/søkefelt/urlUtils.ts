import { Søkekriterier } from '../../App';
import { Status } from '../om-annonsen/Annonsestatus';
import { History } from 'history';
import { Sortering } from '../../sorter/Sorter';
import { Publisert } from '../om-annonsen/HvorErAnnonsenPublisert';

export enum QueryParam {
    Tekst = 'q',
    Publisert = 'publisert',
    Side = 'side',
    Fylker = 'fylker',
    Kommuner = 'kommuner',
    Statuser = 'statuser',
    HovedInkluderingTags = 'hovedinkluderingstags',
    SubInkluderingTags = 'subinkluderingstags',
    Sortering = 'sortering',
    Standardsøk = 'standardsok',
}

export type Navigeringsstate =
    | {
          harByttetSide?: boolean;
          harSlettetKriterier?: boolean;
      }
    | undefined;

export type QueryParamValue = string | boolean | null | number | string[];

const parseQueryParamSomSet = (searchParams: URLSearchParams) => (queryParam: QueryParam) => {
    const verdiFraUrl = searchParams.get(queryParam);
    return verdiFraUrl ? new Set<string>(verdiFraUrl.split(',')) : new Set<string>();
};

export const hentSøkekriterier = (search: string): Søkekriterier => {
    const searchParams = new URLSearchParams(search);
    const hentSøkekriterie = parseQueryParamSomSet(searchParams);

    return {
        side: parseInt(searchParams.get(QueryParam.Side) ?? '1'),
        tekst: searchParams.get(QueryParam.Tekst) ?? '',
        publisert: hentSøkekriterie(QueryParam.Publisert) as Set<Publisert>,
        fylker: hentSøkekriterie(QueryParam.Fylker),
        kommuner: hentSøkekriterie(QueryParam.Kommuner),
        hovedinkluderingstags: hentSøkekriterie(QueryParam.HovedInkluderingTags),
        subinkluderingstags: hentSøkekriterie(QueryParam.SubInkluderingTags),
        statuser: hentSøkekriterie(QueryParam.Statuser) as Set<Status>,
        sortering: (searchParams.get(QueryParam.Sortering) as Sortering) ?? Sortering.MestRelevant,
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
