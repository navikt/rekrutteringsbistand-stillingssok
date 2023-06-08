import React, { useEffect, useState } from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';

export const kandidatProxyUrl = '/kandidatsok-proxy';

type Props = {
    fnr: string;
};

export type EsRespons = {
    hits: {
        hits: Array<{
            _source: Kandidatrespons;
        }>;
    };
};

type Kandidatrespons = {
    fornavn: string;
    etternavn: string;
};

const byggQuery = (fodselsnummer: string) => ({
    query: {
        term: {
            fodselsnummer,
        },
    },
    size: 1,
    _source: ['fornavn', 'etternavn'],
});

const Kandidat = ({ fnr }: Props) => {
    const [kandidat, setKandidat] = useState<Kandidatrespons>();
    const [feilmelding, setFeilmelding] = useState<string | undefined>();

    console.log('Fødselsnummer', fnr);

    useEffect(() => {
        const hentKandidat = async (fnr: string) => {
            try {
                const respons = await fetch(kandidatProxyUrl, {
                    method: 'POST',
                    body: JSON.stringify(byggQuery(fnr)),
                    headers: { 'Content-Type': 'application/json' },
                });

                const esRespons = (await respons.json()) as EsRespons;
                const kandidat = esRespons.hits.hits.at(0)?._source;

                if (kandidat) {
                    console.log('Kandidat:', kandidat);
                    setKandidat(kandidat);
                } else {
                    setFeilmelding('Fant ikke kandidat med fødselsnummer ' + fnr);
                }
            } catch (e) {
                setFeilmelding('Klarte ikke å hente kandidat');
            }
        };

        hentKandidat(fnr);
    }, [fnr]);

    return (
        <div>
            <h2>
                <BodyShort>Finn stillinger til kandidat:</BodyShort>
                <Heading size="medium">
                    {kandidat?.fornavn} {kandidat?.etternavn}
                </Heading>
            </h2>
        </div>
    );
};

export default Kandidat;
