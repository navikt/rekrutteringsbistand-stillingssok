import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import './Søk.less';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';
import { Enhetstype, hentEnhetstype } from '../skjermUtils';
import { QueryParam, QueryParamValue } from './søkefelt/urlUtils';
import Geografi from './Geografi';

export type SøkProps = {
    oppdaterSøk: (queryParam: QueryParam, verdi: QueryParamValue) => void;
};

const enhetstype = hentEnhetstype();

const skalViseGeografi = !window.location.href.includes('nais.adeo.no');

const Søk: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    return (
        <div className="søk">
            <Søkefelt oppdaterSøk={oppdaterSøk} />
            <Ekspanderbartpanel
                apen={enhetstype === Enhetstype.Desktop}
                tittel="Om annonsen"
                className="søk__filtre"
            >
                <HvorErAnnonsenPublisert oppdaterSøk={oppdaterSøk} />
            </Ekspanderbartpanel>
            {skalViseGeografi && <Geografi oppdaterSøk={oppdaterSøk} />}
        </div>
    );
};

export default Søk;
