import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import './Søk.less';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';

const Søk: FunctionComponent = () => {
    return (
        <div className="søk">
            <Søkefelt />
            <HvorErAnnonsenPublisert />
        </div>
    );
};

export default Søk;
