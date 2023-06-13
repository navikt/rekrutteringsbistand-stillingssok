import React, { FunctionComponent, ChangeEvent, Fragment, useState, useEffect } from 'react';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../../utils/urlUtils';
import { hierarkiAvTagsForFilter, visningsnavnForFilter } from './tags';
import { sendEvent } from '../../amplitude';
import Filtergruppe from '../Filtergruppe';
import useNavigering from '../../useNavigering';
import css from '../Filter.module.css';

const Inkludering: FunctionComponent = () => {
    const { searchParams, navigate } = useNavigering();

    const [valgteHovedtags, setValgteHovedtags] = useState<Set<string>>(
        hentSøkekriterier(searchParams).hovedinkluderingstags
    );

    const [valgteSubtags, setValgteSubtags] = useState<Set<string>>(
        hentSøkekriterier(searchParams).hovedinkluderingstags
    );

    useEffect(() => {
        setValgteHovedtags(hentSøkekriterier(searchParams).hovedinkluderingstags);
        setValgteSubtags(hentSøkekriterier(searchParams).subinkluderingstags);
    }, [searchParams]);

    const oppdaterSøk = (parameter: QueryParam, verdi: string[]) => {
        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter,
            verdi,
        });
    };

    const onHovedtagChange = (event: ChangeEvent<HTMLInputElement>) => {
        const hovedtag = event.target.value;
        const hovedtags = new Set<string>(valgteHovedtags);

        if (event.target.checked) {
            sendEvent('stillingssøk', 'aktiver_filter', { inkluderingHovedtag: hovedtag });
            hovedtags.add(hovedtag);
        } else {
            hovedtags.delete(hovedtag);

            const subtags = deaktiverSubtagsUnderHovedtag(Array.from(valgteSubtags), hovedtag);
            oppdaterSøk(QueryParam.SubInkluderingTags, subtags);
        }

        setValgteHovedtags(hovedtags);
        oppdaterSøk(QueryParam.HovedInkluderingTags, Array.from(hovedtags));
    };

    const onSubtagChange = (event: ChangeEvent<HTMLInputElement>) => {
        const subtag = event.target.value;
        const subtags = new Set<string>(valgteSubtags);

        if (event.target.checked) {
            sendEvent('stillingssøk', 'aktiver_filter', { inkluderingSubtag: subtag });
            subtags.add(subtag);
        } else {
            subtags.delete(subtag);
        }

        setValgteSubtags(subtags);
        oppdaterSøk(QueryParam.SubInkluderingTags, Array.from(subtags));
    };

    return (
        <Filtergruppe tittel="Inkludering">
            <CheckboxGroup legend="Velg kategori" value={Array.from(valgteHovedtags)}>
                {hierarkiAvTagsForFilter.map((gruppeMedTags) => (
                    <Fragment key={gruppeMedTags.hovedtag}>
                        <Checkbox value={gruppeMedTags.hovedtag} onChange={onHovedtagChange}>
                            {visningsnavnForFilter[gruppeMedTags.hovedtag]}
                        </Checkbox>

                        {valgteHovedtags.has(gruppeMedTags.hovedtag) &&
                            gruppeMedTags.subtags.length > 0 && (
                                <CheckboxGroup
                                    hideLegend
                                    className={css.indentertCheckboxgruppe}
                                    legend={`Velg kategorier under ${gruppeMedTags.hovedtag}`}
                                    value={Array.from(valgteSubtags)}
                                >
                                    {gruppeMedTags.subtags.map((subtag) => (
                                        <Checkbox
                                            key={subtag}
                                            value={subtag}
                                            onChange={onSubtagChange}
                                        >
                                            {visningsnavnForFilter[subtag]}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                            )}
                    </Fragment>
                ))}
            </CheckboxGroup>
        </Filtergruppe>
    );
};

const deaktiverSubtagsUnderHovedtag = (subtags: string[], hovedtag: string): string[] => {
    return subtags.filter((subtag) => subtag.split('__')[0] !== hovedtag);
};

export default Inkludering;
