import { Søkekriterier } from '../Stillingssøk';
import { Status } from '../filter/om-annonsen/Annonsestatus';
import { Sortering } from '../sorter/Sorter';
import { Publisert } from '../filter/om-annonsen/HvorErAnnonsenPublisert';
import { Stillingskategori } from '../filter/om-annonsen/VelgStillingskategori';
import { NavigateFunction } from 'react-router-dom';
import { Søkefelt } from '../søkefelter/Søkefelter';

export enum QueryParam {
    Tekst = 'q',
    Publisert = 'publisert',
    Side = 'side',
    Fylker = 'fylker',
    Kommuner = 'kommuner',
    Statuser = 'statuser',
    Stillingskategorier = 'stillingskategori',
    HovedInkluderingTags = 'hovedinkluderingstags',
    SubInkluderingTags = 'subinkluderingstags',
    Felter = 'felter',
    Sortering = 'sortering',
    Standardsøk = 'standardsok',
    Kandidatkriterier = 'kandidatkriterier',
}

export type Navigeringsstate =
    | {
          harByttetSide?: boolean;
          harSlettetKriterier?: boolean;
          brukStandardsøk?: boolean;
      }
    | undefined;

export type QueryParamValue = string | boolean | null | number | string[];

const parseQueryParamSomSet = (searchParams: URLSearchParams) => (queryParam: QueryParam) => {
    const verdiFraUrl = searchParams.get(queryParam);
    return verdiFraUrl ? new Set<string>(verdiFraUrl.split(',')) : new Set<string>();
};

export const hentSøkekriterier = (searchParams: URLSearchParams): Søkekriterier => {
    const hentSøkekriterie = parseQueryParamSomSet(searchParams);

    return {
        side: parseInt(searchParams.get(QueryParam.Side) ?? '1'),
        tekst: hentSøkekriterie(QueryParam.Tekst),
        publisert: hentSøkekriterie(QueryParam.Publisert) as Set<Publisert>,
        fylker: hentSøkekriterie(QueryParam.Fylker),
        kommuner: hentSøkekriterie(QueryParam.Kommuner),
        hovedinkluderingstags: hentSøkekriterie(QueryParam.HovedInkluderingTags),
        subinkluderingstags: hentSøkekriterie(QueryParam.SubInkluderingTags),
        statuser: hentSøkekriterie(QueryParam.Statuser) as Set<Status>,
        stillingskategorier: hentSøkekriterie(
            QueryParam.Stillingskategorier
        ) as Set<Stillingskategori>,
        sortering: (searchParams.get(QueryParam.Sortering) as Sortering) ?? Sortering.MestRelevant,
        felter: hentSøkekriterie(QueryParam.Felter) as Set<Søkefelt>,
    };
};

const oppdaterQueryParametere = (
    searchParams: URLSearchParams,
    param: QueryParam,
    value: QueryParamValue
): string => {
    if (
        value === null ||
        (typeof value === 'string' && value.length === 0) ||
        (typeof value === 'boolean' && value === false) ||
        (value instanceof Array && value.length === 0)
    ) {
        searchParams.delete(param);
    } else {
        searchParams.set(param, String(value));
    }

    return searchParams.toString();
};

export const oppdaterUrlMedParam = ({
    navigate,
    searchParams,
    parameter,
    verdi,
    state,
}: {
    navigate: NavigateFunction;
    searchParams: URLSearchParams;
    parameter: QueryParam;
    verdi: QueryParamValue;
    state?: Navigeringsstate;
}) => {
    let oppdaterteParams = oppdaterQueryParametere(searchParams, parameter, verdi);
    navigate({ search: oppdaterteParams }, { replace: true, state });
};

export const oppdaterUrlMedToParams = ({
    navigate,
    searchParams,
    parameter,
    verdi,
    parameter2,
    verdi2,
    state,
}: {
    navigate: NavigateFunction;
    searchParams: URLSearchParams;
    parameter: QueryParam;
    verdi: QueryParamValue;
    parameter2: QueryParam;
    verdi2: QueryParamValue;
    state?: Navigeringsstate;
}) => {
    let search = oppdaterQueryParametere(searchParams, parameter, verdi);
    search = oppdaterQueryParametere(searchParams, parameter2, verdi2);
    navigate({ search }, { replace: true, state });
};
