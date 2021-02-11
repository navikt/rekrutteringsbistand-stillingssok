import { Rekrutteringsbistandstilling } from './Stilling';

export type Query = {
    size: number;
    from: number;
    query: {
        match?: Record<string, MatchQuery>;
        bool?: object;
        match_all?: object;
        multi_match?: {
            query: string;
            fields: string[];
        };
    };
    aggs: {
        [A in Aggregering]: {
            terms?: {
                field: string;
            };
            avg?: {
                field: string;
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
    aggregations: Aggregeringer;
};

type Aggregering = 'inkludering';
export type Aggregeringer = {
    [A in Aggregering]: {
        sum_other_doc_count: number;
        buckets: Array<{
            key: string;
            doc_count: number;
        }>;
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
