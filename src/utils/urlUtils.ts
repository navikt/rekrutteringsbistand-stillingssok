import { Søkekriterier } from '../App';
import { Status } from '../søk/om-annonsen/Annonsestatus';
import { History } from 'history';
import { Sortering } from '../sorter/Sorter';
import { Publisert } from '../søk/om-annonsen/HvorErAnnonsenPublisert';
import { Fane } from '../søkefaner/Søkefaner';
import { Stillingskategori } from '../søk/om-annonsen/VelgStillingskategori';

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
    Sortering = 'sortering',
    Standardsøk = 'standardsok',
    Fane = 'fane',
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
        stillingskategorier: hentSøkekriterie(
            QueryParam.Stillingskategorier
        ) as Set<Stillingskategori>,
        sortering: (searchParams.get(QueryParam.Sortering) as Sortering) ?? Sortering.MestRelevant,
        fane: (searchParams.get(QueryParam.Fane) as Fane) ?? Fane.Alle,
    };
};

const oppdaterQueryParametere = (
    search: string,
    param: QueryParam,
    value: QueryParamValue
): string => {
    const searchParams = new URLSearchParams(search);

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
    let search = oppdaterQueryParametere(history.location.search, parameter, verdi);
    history.replace({ search, state });
};

export const oppdaterUrlMedToParams = ({
    history,
    parameter,
    verdi,
    parameter2,
    verdi2,
    state,
}: {
    parameter: QueryParam;
    verdi: QueryParamValue;
    parameter2: QueryParam;
    verdi2: QueryParamValue;
    history: History;
    state?: Navigeringsstate;
}) => {
    let search = oppdaterQueryParametere(history.location.search, parameter, verdi);
    search = oppdaterQueryParametere(search, parameter2, verdi2);
    history.replace({ search, state });
};
