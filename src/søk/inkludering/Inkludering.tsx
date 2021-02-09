import React, { FunctionComponent, ChangeEvent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import { hierarkiAvTagsForFilter } from './tags';

const Inkludering: FunctionComponent = () => {
    const onHovedtagChange = (event: ChangeEvent<HTMLInputElement>) => {};
    const tagger = hierarkiAvTagsForFilter;
    console.log('tadaa', tagger);
    return (
        <Ekspanderbartpanel
            apen={enhetstype === Enhetstype.Desktop}
            tittel="Inkludering"
            className="søk__ekspanderbart-panel"
        >
            <>
                {hierarkiAvTagsForFilter.map((t) => (
                    <Checkbox
                        className="søk__checkbox"
                        label={t.hovedtag}
                        value={t.hovedtag}
                        checked={false}
                        onChange={onHovedtagChange}
                    />
                ))}
                ,
            </>
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

export default Inkludering;
