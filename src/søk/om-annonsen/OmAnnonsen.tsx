import React, { FunctionComponent } from 'react';
import Filtergruppe from '../Filtergruppe';
import Annonsestatus from './Annonsestatus';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';

const OmAnnonsen: FunctionComponent = () => {
    return (
        <Filtergruppe tittel="Om annonsen">
            <Annonsestatus />
            <HvorErAnnonsenPublisert />
        </Filtergruppe>
    );
};

export default OmAnnonsen;
