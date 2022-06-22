import React, { FunctionComponent } from 'react';
import Filtergruppe from '../Filtergruppe';
import Annonsestatus from './Annonsestatus';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';
import VisAlleStillingskategorier from './VisAlleStillingskategorier';

const OmAnnonsen: FunctionComponent = () => {
    return (
        <Filtergruppe tittel="Om annonsen">
            <Annonsestatus />
            <HvorErAnnonsenPublisert />
            <VisAlleStillingskategorier />
        </Filtergruppe>
    );
};

export default OmAnnonsen;
