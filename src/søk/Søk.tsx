import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import './Søk.less';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';

export type SøkProps = {
    triggSøkBasertPåUrl: (skalResetteSidetall: boolean) => void;
};

const Søk: FunctionComponent<SøkProps> = ({ triggSøkBasertPåUrl }) => {
    return (
        <div className="søk">
            <Søkefelt triggSøkBasertPåUrl={triggSøkBasertPåUrl} />
            <HvorErAnnonsenPublisert triggSøkBasertPåUrl={triggSøkBasertPåUrl} />
        </div>
    );
};

export default Søk;
