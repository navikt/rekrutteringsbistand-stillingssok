import Stilling, { EsStilling } from './Stilling';

export type Query = {
    query: {
        match?: object;
        bool?: object;
        match_all?: object;
    };
};

export type Respons = {
    took: number;
    timed_out: boolean;
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
    _source: EsStilling;
};
