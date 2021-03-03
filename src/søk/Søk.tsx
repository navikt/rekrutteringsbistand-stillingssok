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
import { useStandardsøk } from './standardsøk/useStandardsøk';

const Søk: FunctionComponent = () => {
    const { standardsøkErAktivt, setStandardsøkTilAktivt } = useStandardsøk();

    return (
        <div className="søk">
            <div className="søk__lenker-over-søk">
                {erIkkeProd && <BrukStandardsøk standardsøkErAktivt={standardsøkErAktivt} />}
                <SlettKriterier />
            </div>
            {erIkkeProd && (
                <LagreStandardsøk
                    standardsøkErAktivt={standardsøkErAktivt}
                    setStandardsøkTilAktivt={setStandardsøkTilAktivt}
                />
            )}
            <Søkefelt />
            <OmAnnonsen />
            <FylkerOgKommuner />
            <Inkludering />
        </div>
    );
};

export default Søk;
