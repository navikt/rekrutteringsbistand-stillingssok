import { Delsøk } from '../søkefaner/SøkeChips';
import { Rekrutteringsbistandstilling } from './Stilling';

export type Query = {
    size?: number;
    from?: number;
    track_total_hits?: boolean;
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
                delsok: {
                    filters: {
                        filters: Partial<Record<Delsøk, object>>;
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
        max_score: number | null;
        hits: Array<Hit>;
        total: {
            value: number;
        };
    };
    aggregations: {
        globalAggregering: GlobalAggregering;
    };
};

export type GlobalAggregering = {
    delsok: {
        buckets: Partial<Record<Delsøk, { doc_count: number }>>;
    };
};

export type Hit = {
    sort?: number[];
    _index: string;
    _type: string;
    _id: string;
    _score: number | null;
    _source: Rekrutteringsbistandstilling;
    _explanation?: any;
};
