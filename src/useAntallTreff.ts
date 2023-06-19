import { Respons } from './domene/elasticSearchTyper';

const useAntallTreff = (respons: Respons | null): number => {
    if (respons === null) {
        return 0;
    }

    return respons.hits.total.value;
};

export default useAntallTreff;
