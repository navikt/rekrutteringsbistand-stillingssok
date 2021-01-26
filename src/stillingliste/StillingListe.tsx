import React, { FunctionComponent } from 'react';
import { Respons } from '../elasticSearchTyper';
import StillingRad from './stillingrad/StillingRad';
import './StillingListe.less';

type Props = {
    esRespons: Respons;
};

const StillingListe: FunctionComponent<Props> = ({ esRespons }) => {
    const hits = esRespons.hits.hits;
    return (
        <ul className="stillingliste">
            {hits.map((hit) => (
                <StillingRad rekrutteringsbistandstilling={hit._source} />
            ))}
        </ul>
    );
};

export default StillingListe;
