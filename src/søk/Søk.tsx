import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import { QueryParam, QueryParamValue } from './søkefelt/urlUtils';
import FylkerOgKommuner from './geografi/FylkerOgKommuner';
import OmAnnonsen from './om-annonsen/OmAnnonsen';
import { erIkkeProd } from '../utils/featureToggleUtils';
import Inkludering from './inkludering/Inkludering';
import './Søk.less';
import SlettKriterier from './slett-kriterier/SlettKriterier';

export type SøkProps = {
    oppdaterSøk: (queryParam: QueryParam, verdi: QueryParamValue) => void;
};

type Props = SøkProps & {
    slettKriterier: () => void;
};

const Søk: FunctionComponent<Props> = ({ oppdaterSøk, slettKriterier }) => {
    return (
        <div className="søk">
            <SlettKriterier slettKriterier={slettKriterier} />
            <Søkefelt oppdaterSøk={oppdaterSøk} />
            <OmAnnonsen oppdaterSøk={oppdaterSøk} />
            <FylkerOgKommuner oppdaterSøk={oppdaterSøk} />
            {erIkkeProd && <Inkludering oppdaterSøk={oppdaterSøk} />}
        </div>
    );
};

export default Søk;
