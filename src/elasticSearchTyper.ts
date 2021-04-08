import { Rekrutteringsbistandstilling } from './Stilling';
import { Fane } from './søkefaner/Søkefaner';

export type Query = {
    size?: number;
    from?: number;
    query: {
        term?: Record<string, object>;
        match?: Record<string, MatchQuery>;
        bool?: object;
        match_all?: object;
        multi_match?: {
            query: string;
            fields: string[];
        };
        filter?: any;
    };
    aggs?: {
        globalAggregering: {
            global: object;
            aggs: {
                faner: {
                    filters: {
                        filters: Record<Fane, object>;
                    };
                };
            };
        };
    };
};

type MatchQuery = {
    query: string;
};

export type Respons = {
    took: number;
    timed_out: boolean;
    _shards: {
        total: number;
        successful: number;
        skipped: number;
        failed: number;
    };
    hits: {
        total: {
            value: number;
            relation: string;
        };
        max_score: number | null;
        hits: Array<Hit>;
    };
    aggregations?: {
        globalAggregering: {
            faner: {
                buckets: Record<Fane, { doc_count: number }>;
            };
        };
    };
};

export type Hit = {
    _index: string;
    _type: string;
    _id: string;
    _score: number | null;
    _source: Rekrutteringsbistandstilling;
    sort?: number[];
};
