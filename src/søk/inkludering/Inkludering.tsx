import React, { FunctionComponent, ChangeEvent, Fragment, useState, useEffect } from 'react';
import { hierarkiAvTagsForFilter, visningsnavnForFilter } from './tags';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../../utils/urlUtils';
import { useHistory, useLocation } from 'react-router-dom';
import { sendEvent } from '../../amplitude';
import Filtergruppe from '../Filtergruppe';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

const Inkludering: FunctionComponent = () => {
    const history = useHistory();
    const { search } = useLocation();

    const [valgteHovedtags, setValgteHovedtags] = useState<Set<string>>(
        hentSøkekriterier(search).hovedinkluderingstags
    );

    const [valgteSubtags, setValgteSubtags] = useState<Set<string>>(
        hentSøkekriterier(search).hovedinkluderingstags
    );

    useEffect(() => {
        setValgteHovedtags(hentSøkekriterier(search).hovedinkluderingstags);
        setValgteSubtags(hentSøkekriterier(search).subinkluderingstags);
    }, [search]);

    const oppdaterSøk = (parameter: QueryParam, verdi: string[]) => {
        oppdaterUrlMedParam({
            history,
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
                                    className="søk__indentert-checkboxgruppe"
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
