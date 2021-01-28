import React, { FunctionComponent } from 'react';
import { Respons } from '../elasticSearchTyper';
import Stillingsrad from './stillingrad/Stillingsrad';
import './Stillingsliste.less';

type Props = {
    esRespons: Respons;
};

const Stillingsliste: FunctionComponent<Props> = ({ esRespons }) => {
    const hits = esRespons.hits.hits;
    return (
        <ul className="stillingliste">
            {hits.map((hit) => (
                <Stillingsrad rekrutteringsbistandstilling={hit._source} />
            ))}
        </ul>
    );
};

export default Stillingsliste;
