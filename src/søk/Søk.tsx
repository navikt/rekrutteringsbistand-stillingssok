import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import { QueryParam, QueryParamValue } from './søkefelt/urlUtils';
import FylkerOgKommuner from './geografi/FylkerOgKommuner';
import OmAnnonsen from './om-annonsen/OmAnnonsen';
import Inkludering from './inkludering/Inkludering';
import { erIkkeProd } from '../utils/featureToggleUtils';
import './Søk.less';

export type SøkProps = {
    oppdaterSøk: (queryParam: QueryParam, verdi: QueryParamValue) => void;
};

const Søk: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    return (
        <div className="søk">
            <Søkefelt oppdaterSøk={oppdaterSøk} />
            <OmAnnonsen oppdaterSøk={oppdaterSøk} />
            <FylkerOgKommuner oppdaterSøk={oppdaterSøk} />
            {erIkkeProd && <Inkludering />}
        </div>
    );
};

export default Søk;
