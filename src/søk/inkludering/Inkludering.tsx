import React, { FunctionComponent, ChangeEvent, Fragment } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import { hierarkiAvTagsForFilter } from './tags';

const Inkludering: FunctionComponent = () => {
    const onHovedtagChange = (event: ChangeEvent<HTMLInputElement>) => {};
    const onSubtagChange = (event: ChangeEvent<HTMLInputElement>) => {};
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
                    <Fragment key={t.hovedtag}>
                        <Checkbox
                            className="søk__checkbox"
                            //label={visningsnavnForFilter[t.hovedtag]}
                            label={t.hovedtag.toLowerCase().replaceAll('_', ' ')}
                            value={t.hovedtag}
                            checked={false}
                            onChange={onHovedtagChange}
                        />
                        {t.subtags.map((s) => (
                            <Checkbox
                                className="søk__checkbox søk__checkbox--indentert"
                                key={s}
                                label={s.split('__')[1].toLowerCase().replaceAll('_', ' ')}
                                value={s}
                                checked={false}
                                onChange={onSubtagChange}
                            />
                        ))}
                    </Fragment>
                ))}
            </>
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

export default Inkludering;
