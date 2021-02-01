import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import './Søk.less';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';

export type SøkProps = {
    søkBasertPåUrl: (beholdSidetall?: boolean) => void;
};

const Søk: FunctionComponent<SøkProps> = ({ søkBasertPåUrl }) => {
    return (
        <div className="søk">
            <Søkefelt søkBasertPåUrl={søkBasertPåUrl} />
            <Ekspanderbartpanel tittel="Vis filter" className="søk__filtre">
                <HvorErAnnonsenPublisert søkBasertPåUrl={søkBasertPåUrl} />
            </Ekspanderbartpanel>
        </div>
    );
};

export default Søk;
