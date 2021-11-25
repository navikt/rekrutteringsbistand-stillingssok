import React, { FunctionComponent } from 'react';
import { Respons } from '../elasticSearchTyper';
import Stillingsrad from './stillingsrad/Stillingsrad';
import './Stillingsliste.less';

type Props = {
    esRespons: Respons;
    scrolletFraToppen: Number;
    håndterEndreScroll: any;
};

const Stillingsliste: FunctionComponent<Props> = ({
    esRespons,
    scrolletFraToppen,
    håndterEndreScroll,
}) => {
    const hits = esRespons.hits.hits;
    return (
        <ul className="stillingliste">
            {hits.map((hit) => (
                <Stillingsrad
                    key={hit._id}
                    rekrutteringsbistandstilling={hit._source}
                    scrolletFraToppen={scrolletFraToppen}
                    håndterEndreScroll={håndterEndreScroll}
                />
            ))}
        </ul>
    );
};

export default Stillingsliste;
