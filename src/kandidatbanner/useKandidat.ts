import { useEffect, useState } from 'react';
import { QueryParam, oppdaterUrlMedParam } from '../utils/urlUtils';
import useNavigering from '../useNavigering';
import fylkerOgKommuner from '../søk/geografi/fylkerOgKommuner.json';

export const kandidatProxyUrl = '/kandidatsok-proxy';

export type EsRespons = {
    hits: {
        hits: Array<{
            _source: Kandidatrespons;
        }>;
    };
};

type Geografijobbønske = {
    geografiKode: string;
    geografiKodeTekst: string;
};

export type Kandidatrespons = {
    fornavn: string;
    etternavn: string;
    geografiJobbonsker: Geografijobbønske[];
};

const byggQuery = (fodselsnummer: string) => ({
    query: {
        term: {
            fodselsnummer,
        },
    },
    size: 1,
    _source: ['geografiJobbonsker', 'fornavn', 'etternavn'],
});

function hentFylkestekstFraGeografiKode(geografiKode: string) {
    return fylkerOgKommuner.find(
        (fylke) => fylke.fylkesnummer === geografiKode.split('.')[0].substring(2)
    )?.fylkesnavn;
}

const hentFylkerFraJobbønsker = (geografijobbønsker: Geografijobbønske[]): string[] => {
    return geografijobbønsker
        .map((jobbønske) => hentFylkestekstFraGeografiKode(jobbønske.geografiKode))
        .filter<string>((fylke): fylke is string => fylke !== undefined);
};

const hentKommunerFraJobbønsker = (geografijobbønsker: Geografijobbønske[]): string[] => {
    return geografijobbønsker
        .filter((jobbønske) => jobbønske.geografiKode.includes('.'))
        .map((jobbønske) => {
            const kommunetekst = jobbønske.geografiKodeTekst;
            const fylkestekst = hentFylkestekstFraGeografiKode(jobbønske.geografiKode);

            return `${fylkestekst}.${kommunetekst}`;
        });
};

const useKandidat = (fnr: string) => {
    const { searchParams, navigate } = useNavigering();

    const [kandidat, setKandidat] = useState<Kandidatrespons>();
    const [feilmelding, setFeilmelding] = useState<string | undefined>();

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
                    setKandidat(kandidat);

                    const fylkerFraKandidat = hentFylkerFraJobbønsker(kandidat.geografiJobbonsker);
                    const kommunerFraKandidat = hentKommunerFraJobbønsker(
                        kandidat.geografiJobbonsker
                    );

                    oppdaterUrlMedParam({
                        navigate,
                        searchParams,
                        parameter: QueryParam.Fylker,
                        verdi: fylkerFraKandidat,
                    });
                    //TODO: Unngå duplikatkall mot es
                    oppdaterUrlMedParam({
                        navigate,
                        searchParams,
                        parameter: QueryParam.Kommuner,
                        verdi: kommunerFraKandidat,
                    });
                } else {
                    setFeilmelding('Fant ikke kandidat med fødselsnummer ' + fnr);
                }
            } catch (e) {
                setFeilmelding('Klarte ikke å hente kandidat');
            }
        };

        hentKandidat(fnr);
    }, [fnr]);

    return {
        kandidat,
        feilmelding,
    };
};

export default useKandidat;
