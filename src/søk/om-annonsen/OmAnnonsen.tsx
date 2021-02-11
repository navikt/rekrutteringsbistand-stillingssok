import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import Annonsestatus from './Annonsestatus';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';

const OmAnnonsen: FunctionComponent = () => {
    return (
        <Ekspanderbartpanel
            apen={enhetstype === Enhetstype.Desktop}
            tittel="Om annonsen"
            className="søk__ekspanderbart-panel"
        >
            <Annonsestatus />
            <HvorErAnnonsenPublisert />
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

export default OmAnnonsen;
