import React, { FunctionComponent, ChangeEvent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';

const Inkludering: FunctionComponent = () => {
    const onInkluderingChange = (event: ChangeEvent<HTMLInputElement>) => {};
    return (
        <Ekspanderbartpanel
            apen={enhetstype === Enhetstype.Desktop}
            tittel="Inkludering"
            className="søk__ekspanderbart-panel"
        >
            <>
                <Checkbox
                    className="søk__checkbox"
                    label="Inkludering"
                    value="INKLUDERING"
                    checked={false}
                    onChange={onInkluderingChange}
                />
            </>
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

export default Inkludering;
