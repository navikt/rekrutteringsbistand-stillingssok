import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';
import { QueryParam, QueryParamValue } from './søkefelt/urlUtils';
import Geografi from './geografi/Geografi';
import { erIkkeProd } from '../utils/featureToggleUtils';
import FylkerOgKommuner from './geografi/FylkerOgKommuner';
import './Søk.less';

export type SøkProps = {
    oppdaterSøk: (queryParam: QueryParam, verdi: QueryParamValue) => void;
};

const Søk: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    return (
        <div className="søk">
            <Søkefelt oppdaterSøk={oppdaterSøk} />
            <HvorErAnnonsenPublisert oppdaterSøk={oppdaterSøk} />
            {erIkkeProd ? (
                <FylkerOgKommuner oppdaterSøk={oppdaterSøk} />
            ) : (
                <Geografi oppdaterSøk={oppdaterSøk} />
            )}
        </div>
    );
};

export default Søk;
