import React, { FunctionComponent } from 'react';
import { Respons } from '../elasticSearchTyper';
import Stillingsrad from './stillingsrad/Stillingsrad';
import css from './Stillingsliste.module.css';

type Props = {
    esRespons: Respons;
};

const Stillingsliste: FunctionComponent<Props> = ({ esRespons }) => {
    const hits = esRespons.hits.hits;
    return (
        <ul className={css.stillingliste}>
            {hits.map((hit) => (
                <Stillingsrad key={hit._id} rekrutteringsbistandstilling={hit._source} />
            ))}
        </ul>
    );
};

export default Stillingsliste;
