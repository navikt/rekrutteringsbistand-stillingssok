import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import FylkerOgKommuner from './geografi/FylkerOgKommuner';
import OmAnnonsen from './om-annonsen/OmAnnonsen';
import Inkludering from './inkludering/Inkludering';
import SlettKriterier from './slett-kriterier/SlettKriterier';
import LagreStandardsøk from './standardsøk/LagreStandardsøk';
import { erIkkeProd } from '../utils/featureToggleUtils';
import BrukStandardsøk from './standardsøk/BrukStandardsøk';
import './Søk.less';

const Søk: FunctionComponent = () => {
    return (
        <div className="søk">
            <div className="søk__lenker-over-søk">
                {erIkkeProd && <BrukStandardsøk />}
                <SlettKriterier />
            </div>
            {erIkkeProd && <LagreStandardsøk />}
            <Søkefelt />
            <OmAnnonsen />
            <FylkerOgKommuner />
            <Inkludering />
        </div>
    );
};

export default Søk;
