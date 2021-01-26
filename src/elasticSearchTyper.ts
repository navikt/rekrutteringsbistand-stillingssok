import { Rekrutteringsbistandstilling } from './Stilling';

export type Query = {
    query: {
        match?: Record<string, MatchQuery>;
        bool?: object;
        match_all?: object;
        multi_match?: {
            query: string;
            fields: string[];
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
        max_score: number;
        hits: Array<Hit>;
    };
};

export type Hit = {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: Rekrutteringsbistandstilling;
};
