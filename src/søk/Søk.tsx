import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';
import { QueryParam, QueryParamValue } from './søkefelt/urlUtils';
import Geografi from './Geografi';
import './Søk.less';

export type SøkProps = {
    oppdaterSøk: (queryParam: QueryParam, verdi: QueryParamValue) => void;
};

export const skalViseGeografi = !window.location.href.includes('nais.adeo.no');

const Søk: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    return (
        <div className="søk">
            <Søkefelt oppdaterSøk={oppdaterSøk} />
            <HvorErAnnonsenPublisert oppdaterSøk={oppdaterSøk} />
            {skalViseGeografi && <Geografi oppdaterSøk={oppdaterSøk} />}
        </div>
    );
};

export default Søk;
