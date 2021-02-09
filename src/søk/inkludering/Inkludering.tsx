import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';

const Inkludering: FunctionComponent = () => {
    return (
        <Ekspanderbartpanel
            apen={enhetstype === Enhetstype.Desktop}
            tittel="Inkludering"
            className="søk__ekspanderbart-panel"
        >
            <div>Hei</div>
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

export default Inkludering;
