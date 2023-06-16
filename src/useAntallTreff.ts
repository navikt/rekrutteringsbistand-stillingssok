import { useSearchParams } from 'react-router-dom';
import { GlobalAggregering, Respons } from './domene/elasticSearchTyper';
import { hentSøkekriterier } from './utils/urlUtils';

const useAntallTreff = (respons: Respons | null): number => {
    const [searchParams] = useSearchParams();

    if (respons === null) {
        return 0;
    }

    return hentAntallTreff(
        searchParams,
        respons.hits.total.value,
        respons.aggregations?.globalAggregering
    );
};

export const hentAntallTreff = (
    searchParams: URLSearchParams,
    totaltAntallTreff: number,
    globalAggregering?: GlobalAggregering
): number => {
    const alleDelsøk = hentSøkekriterier(searchParams).delsøk;

    if (alleDelsøk.size === 0) {
        return totaltAntallTreff;
    }

    return Array.from(alleDelsøk).reduce((antall, delsøk) => {
        return antall + (globalAggregering?.delsok.buckets[delsøk]?.doc_count ?? 0);
    }, 0);
};

export default useAntallTreff;
