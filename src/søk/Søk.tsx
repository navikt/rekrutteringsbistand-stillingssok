import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import FylkerOgKommuner from './geografi/FylkerOgKommuner';
import OmAnnonsen from './om-annonsen/OmAnnonsen';
import Inkludering from './inkludering/Inkludering';
import SlettKriterier from './slett-kriterier/SlettKriterier';
import './Søk.less';
import { Aggregeringer } from '../elasticSearchTyper';

type Props = {
    aggregeringer?: Aggregeringer;
};

const Søk: FunctionComponent<Props> = ({ aggregeringer }) => {
    return (
        <div className="søk">
            <SlettKriterier />
            <Søkefelt />
            <OmAnnonsen />
            <FylkerOgKommuner />
            <Inkludering aggregeringer={aggregeringer} />
        </div>
    );
};

export default Søk;
