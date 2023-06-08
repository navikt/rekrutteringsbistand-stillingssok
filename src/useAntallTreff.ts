import { useSearchParams } from 'react-router-dom';
import { GlobalAggregering } from './domene/elasticSearchTyper';
import { hentSøkekriterier } from './utils/urlUtils';

const useAntallTreff = (globalAggregering?: GlobalAggregering): number => {
    const [searchParams] = useSearchParams();
    return hentAntallTreff(searchParams, globalAggregering);
};

export const hentAntallTreff = (
    searchParams: URLSearchParams,
    globalAggregering?: GlobalAggregering
): number => {
    const aktivFane = hentSøkekriterier(searchParams).fane;
    return globalAggregering?.faner.buckets[aktivFane]?.doc_count ?? 0;
};

export default useAntallTreff;
