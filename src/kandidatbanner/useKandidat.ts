import { useEffect, useState } from 'react';
import { QueryParam } from '../utils/urlUtils';
import { brukNyttFylkesnummer } from '../søk/geografi/regionsreformen';
import useNavigering from '../useNavigering';
import fylkerOgKommuner from '../søk/geografi/fylkerOgKommuner.json';
import { Status } from '../søk/om-annonsen/Annonsestatus';
import { Publisert } from '../søk/om-annonsen/HvorErAnnonsenPublisert';
import { Stillingskategori } from '../søk/om-annonsen/VelgStillingskategori';

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
    fodselsdato: string;
    adresselinje1: string;
    postnummer: string;
    poststed: string;
    epostadresse: string;
    telefon: string;
    veileder: string;
    arenaKandidatnr: string;
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
    return fylkerOgKommuner.find((fylke) => {
        const fylkesnummerFraKandidat = geografiKode.split('.')[0].substring(2);
        return fylke.fylkesnummer === brukNyttFylkesnummer(fylkesnummerFraKandidat);
    })?.fylkesnavn;
}

const hentFylkerFraJobbønsker = (geografijobbønsker: Geografijobbønske[]): string[] => {
    return geografijobbønsker
        .map((jobbønske) => jobbønske.geografiKode)
        .map((geografiKode) => hentFylkestekstFraGeografiKode(geografiKode))
        .filter((fylke) => fylke !== undefined) as string[];
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

                    const søk = new URLSearchParams();
                    søk.set(QueryParam.Fylker, String(fylkerFraKandidat));
                    søk.set(QueryParam.Kommuner, String(kommunerFraKandidat));
                    søk.set(QueryParam.Statuser, Status.Publisert);
                    søk.set(QueryParam.Publisert, Publisert.Intern);
                    søk.set(QueryParam.Stillingskategorier, Stillingskategori.Stilling);
                    navigate({ search: søk.toString() }, { replace: true });
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
