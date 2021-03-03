import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import FylkerOgKommuner from './geografi/FylkerOgKommuner';
import OmAnnonsen from './om-annonsen/OmAnnonsen';
import Inkludering from './inkludering/Inkludering';
import SlettKriterier from './slett-kriterier/SlettKriterier';
import LagreStandardsøk from './lagre-standardsøk/LagreStandardsøk';
import { erIkkeProd } from '../utils/featureToggleUtils';
import './Søk.less';

const Søk: FunctionComponent = () => {
    return (
        <div className="søk">
            <SlettKriterier />
            {erIkkeProd && <LagreStandardsøk />}
            <Søkefelt />
            <OmAnnonsen />
            <FylkerOgKommuner />
            <Inkludering />
        </div>
    );
};

export default Søk;
