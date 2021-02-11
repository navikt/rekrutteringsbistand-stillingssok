import React, { FunctionComponent, ChangeEvent, Fragment, useState, useEffect } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import { hierarkiAvTagsForFilter, visningsnavnForFilter, GruppeMedTags } from './tags';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../søkefelt/urlUtils';
import { useHistory, useLocation } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';
import { Aggregeringer } from '../../elasticSearchTyper';

type Props = {
    aggregeringer?: Aggregeringer;
};

const Inkludering: FunctionComponent<Props> = ({ aggregeringer }) => {
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
            subtags.add(subtag);
        } else {
            subtags.delete(subtag);
        }

        setValgteSubtags(subtags);
        oppdaterSøk(QueryParam.SubInkluderingTags, Array.from(subtags));
    };

    const hentAggregeringForTag = (tag: string) => {
        return (
            aggregeringer?.inkludering.buckets.find((bucket) => bucket.key === tag)?.doc_count || 0
        );
    };

    return (
        <Ekspanderbartpanel
            apen={enhetstype === Enhetstype.Desktop}
            tittel="Inkludering"
            className="søk__ekspanderbart-panel"
        >
            <SkjemaGruppe legend={<Element>Velg kategori</Element>}>
                {hierarkiAvTagsForFilter.map((gruppeMedTags: GruppeMedTags) => {
                    const aggregering = hentAggregeringForTag(gruppeMedTags.hovedtag);
                    const label =
                        visningsnavnForFilter[gruppeMedTags.hovedtag] +
                        (aggregering === undefined ? '' : ` (${aggregering})`);

                    return (
                        <Fragment key={gruppeMedTags.hovedtag}>
                            <Checkbox
                                className="søk__checkbox"
                                label={label}
                                value={gruppeMedTags.hovedtag}
                                checked={valgteHovedtags.has(gruppeMedTags.hovedtag)}
                                onChange={onHovedtagChange}
                            />

                            {valgteHovedtags.has(gruppeMedTags.hovedtag) &&
                                gruppeMedTags.subtags.length > 0 && (
                                    <fieldset>
                                        <legend className="kun-skjermlesere">
                                            Velg kategorier under {gruppeMedTags.hovedtag}
                                        </legend>

                                        {gruppeMedTags.subtags.map((subtag) => {
                                            const aggregering = hentAggregeringForTag(subtag);
                                            const label =
                                                visningsnavnForFilter[subtag] +
                                                (aggregering === undefined
                                                    ? ''
                                                    : ` (${aggregering})`);

                                            return (
                                                <Checkbox
                                                    className="søk__checkbox søk__checkbox--indentert"
                                                    key={subtag}
                                                    label={label}
                                                    value={subtag}
                                                    checked={valgteSubtags.has(subtag)}
                                                    onChange={onSubtagChange}
                                                />
                                            );
                                        })}
                                    </fieldset>
                                )}
                        </Fragment>
                    );
                })}
            </SkjemaGruppe>
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

const deaktiverSubtagsUnderHovedtag = (subtags: string[], hovedtag: string): string[] => {
    return subtags.filter((subtag) => subtag.split('__')[0] !== hovedtag);
};

export default Inkludering;
