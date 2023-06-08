import { useEffect, useState } from 'react';

type Props = {
    fnr: string;
};

type EsRespons = {
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
                const respons = await fetch('/kandidatsok-proxy', {
                    method: 'POST',
                    body: JSON.stringify(byggQuery(fnr)),
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

    return null;
};

export default Kandidat;
