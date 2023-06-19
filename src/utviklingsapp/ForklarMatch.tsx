import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { lagIndreQuery } from '../api/queries/queries';
import { hentSøkekriterier } from '../utils/urlUtils';
import { søk } from '../api/api';
import css from './Utviklingsapp.module.css';
import { Accordion, Heading } from '@navikt/ds-react';
import { Hit } from '../domene/elasticSearchTyper';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

const ForklarMatch = () => {
    const { stillingsId } = useParams();
    const [searchParams] = useSearchParams();
    const søkekriterier = hentSøkekriterier(searchParams);

    const [stilling, setStilling] = useState<Hit>();

    useEffect(() => {
        const hentForklaringMedStillingsId = async (stillingsId: string) => {
            const query = {
                query: lagIndreQuery(søkekriterier),
            };

            const respons = await søk(query, true);
            const stilling = respons.hits.hits.find((hit) => hit._id === stillingsId);

            setStilling(stilling);
        };

        if (stillingsId) hentForklaringMedStillingsId(stillingsId);
    }, [stillingsId]);

    return (
        <div className={css.forklarMatch}>
            <Link className="navds-link" to={`/stillingssok?${searchParams.toString()}`}>
                <ArrowLeftIcon />
                Tilbake til søket
            </Link>
            <Heading level="2" size="large" className={css.tittel}>
                Stillingsside
            </Heading>
            <Accordion>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Stilling</Accordion.Header>
                    <Accordion.Content>
                        {stilling && (
                            <code className={css.json}>
                                {JSON.stringify(stilling._source, undefined, 2)}
                            </code>
                        )}
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item defaultOpen>
                    <Accordion.Header>Matchforklaring</Accordion.Header>
                    <Accordion.Content>
                        {stilling && (
                            <code className={css.json}>
                                {JSON.stringify(stilling._explanation, undefined, 2)}
                            </code>
                        )}
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default ForklarMatch;
