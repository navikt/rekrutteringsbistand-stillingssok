import React, { FunctionComponent } from 'react';
import { Respons } from '../elasticSearchTyper';
import Stillingsrad from './stillingsrad/Stillingsrad';
import './Stillingsliste.less';

type Props = {
    esRespons: Respons;
};

const Stillingsliste: FunctionComponent<Props> = ({ esRespons }) => {
    const hits = esRespons.hits.hits;
    return (
        <ul className="stillingliste">
            {hits.map((hit) => (
                <Stillingsrad key={hit._id} rekrutteringsbistandstilling={hit._source} />
            ))}
        </ul>
    );
};

export default Stillingsliste;
