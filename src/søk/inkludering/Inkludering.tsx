import React, { FunctionComponent, ChangeEvent, Fragment } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import { hierarkiAvTagsForFilter, visningsnavnForFilter } from './tags';

const Inkludering: FunctionComponent = () => {
    const onHovedtagChange = (event: ChangeEvent<HTMLInputElement>) => {};
    const onSubtagChange = (event: ChangeEvent<HTMLInputElement>) => {};

    return (
        <Ekspanderbartpanel
            apen={enhetstype === Enhetstype.Desktop}
            tittel="Inkludering"
            className="søk__ekspanderbart-panel"
        >
            <>
                {hierarkiAvTagsForFilter.map((gruppeMedTags) => (
                    <Fragment key={gruppeMedTags.hovedtag}>
                        <Checkbox
                            className="søk__checkbox"
                            label={visningsnavnForFilter[gruppeMedTags.hovedtag]}
                            value={gruppeMedTags.hovedtag}
                            checked={false}
                            onChange={onHovedtagChange}
                        />
                        {gruppeMedTags.subtags.map((subtag) => (
                            <Checkbox
                                className="søk__checkbox søk__checkbox--indentert"
                                key={subtag}
                                label={visningsnavnForFilter[subtag]}
                                value={subtag}
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
