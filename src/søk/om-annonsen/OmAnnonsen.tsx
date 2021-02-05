import React, { FunctionComponent } from 'react';
import { SøkProps } from '../Søk';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import Annonsestatus from './Annonsestatus';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';
import { erIkkeProd } from '../../utils/featureToggleUtils';

const OmAnnonsen: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    return (
        <Ekspanderbartpanel
            apen={enhetstype === Enhetstype.Desktop}
            tittel="Om annonsen"
            className="søk__ekspanderbart-panel"
        >
            {erIkkeProd && <Annonsestatus oppdaterSøk={oppdaterSøk} />}
            <HvorErAnnonsenPublisert oppdaterSøk={oppdaterSøk} />
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

export default OmAnnonsen;
