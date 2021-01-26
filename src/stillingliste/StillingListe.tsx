import React from 'react';
import { FunctionComponent } from 'react';
import { Respons } from '../elasticSearchTyper';
import StillingRad from './stillingrad/StillingRad';

type Props = {
    esRespons: Respons;
};

const StillingListe: FunctionComponent<Props> = ({ esRespons }) => {
    const hits = esRespons.hits.hits;
    return (
        <ul>
            {hits.map((hit) => (
                <StillingRad stilling={hit._source.stilling} />
            ))}
        </ul>
    );
};

export default StillingListe;
