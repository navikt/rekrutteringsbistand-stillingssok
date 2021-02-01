import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import './Søk.less';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';

export type SøkProps = {
    søkBasertPåUrl: (beholdSidetall?: boolean) => void;
};

const Søk: FunctionComponent<SøkProps> = ({ søkBasertPåUrl }) => {
    return (
        <div className="søk">
            <Søkefelt søkBasertPåUrl={søkBasertPåUrl} />
            <HvorErAnnonsenPublisert søkBasertPåUrl={søkBasertPåUrl} />
        </div>
    );
};

export default Søk;
