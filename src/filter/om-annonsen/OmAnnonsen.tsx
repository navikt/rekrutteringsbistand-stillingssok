import React, { FunctionComponent } from 'react';
import Filtergruppe from '../Filtergruppe';
import Annonsestatus from './Annonsestatus';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';
import VelgStillingskategori from './VelgStillingskategori';

const OmAnnonsen: FunctionComponent = () => {
    return (
        <Filtergruppe tittel="Om annonsen">
            <Annonsestatus />
            <HvorErAnnonsenPublisert />
            <VelgStillingskategori />
        </Filtergruppe>
    );
};

export default OmAnnonsen;
