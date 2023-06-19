import React, { FunctionComponent } from 'react';
import { Respons } from '../domene/elasticSearchTyper';
import Stillingsrad from './stillingsrad/Stillingsrad';
import css from './Stillingsliste.module.css';

type Props = {
    esRespons: Respons;
    fnr?: string;
};

const Stillingsliste: FunctionComponent<Props> = ({ esRespons, fnr }) => {
    const hits = esRespons.hits.hits;
    return (
        <ul className={css.stillingliste}>
            {hits.map((hit) => (
                <Stillingsrad
                    key={hit._id}
                    rekrutteringsbistandstilling={hit._source}
                    fnr={fnr}
                    score={hit._score}
                />
            ))}
        </ul>
    );
};

export default Stillingsliste;
