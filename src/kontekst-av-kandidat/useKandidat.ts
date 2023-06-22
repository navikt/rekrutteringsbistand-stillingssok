import { useEffect, useState } from 'react';
import { QueryParam } from '../utils/urlUtils';
import { brukNyttFylkesnummer } from '../filter/geografi/regionsreformen';
import useNavigering from '../useNavigering';
import fylkerOgKommuner from '../filter/geografi/fylkerOgKommuner.json';
import { Status } from '../filter/om-annonsen/Annonsestatus';
import { Publisert } from '../filter/om-annonsen/HvorErAnnonsenPublisert';
import { Stillingskategori } from '../filter/om-annonsen/VelgStillingskategori';
import {
    EsRespons,
    Geografijobbønske,
    Kandidatrespons,
    Yrkejobbønske,
    byggKandidatQuery,
    kandidatProxyUrl,
} from './kandidatQuery';

const useKandidat = (fnr: string) => {
    const { searchParams, navigate } = useNavigering();
    const brukKandidatkriterier = searchParams.get(QueryParam.Kandidatkriterier) !== null;

    const [kandidat, setKandidat] = useState<Kandidatrespons>();
    const [feilmelding, setFeilmelding] = useState<string | undefined>();

    useEffect(() => {
        const brukKriterier = (kandidat: Kandidatrespons) => {
            const fylker = hentFylkerFraJobbønsker(kandidat.geografiJobbonsker);
            const kommuner = hentKommunerFraJobbønsker(kandidat.geografiJobbonsker);
            const yrkesønsker = hentYrkerFraJobbønsker(kandidat.yrkeJobbonskerObj);

            const søk = new URLSearchParams();

            søk.set(QueryParam.Fylker, String(fylker));
            søk.set(QueryParam.Kommuner, String(kommuner));
            søk.set(QueryParam.Statuser, Status.Publisert);
            søk.set(QueryParam.Publisert, Publisert.Intern);
            søk.set(QueryParam.Stillingskategorier, Stillingskategori.Stilling);
            søk.set(QueryParam.Tekst, String(yrkesønsker));

            navigate({ search: søk.toString() }, { replace: true });
        };

        const hentKandidat = async (fnr: string) => {
            try {
                const respons = await fetch(kandidatProxyUrl, {
                    method: 'POST',
                    body: JSON.stringify(byggKandidatQuery(fnr)),
                    headers: { 'Content-Type': 'application/json' },
                });

                const esRespons = (await respons.json()) as EsRespons;
                const kandidat = esRespons.hits.hits.at(0)?._source;

                if (kandidat) {
                    setKandidat(kandidat);

                    if (brukKandidatkriterier) {
                        brukKriterier(kandidat);
                    }
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

const hentFylkestekstFraGeografiKode = (geografiKode: string) => {
    return fylkerOgKommuner.find((fylke) => {
        const fylkesnummerFraKandidat = geografiKode.split('.')[0].substring(2);
        return fylke.fylkesnummer === brukNyttFylkesnummer(fylkesnummerFraKandidat);
    })?.fylkesnavn;
};

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

const hentYrkerFraJobbønsker = (yrkesønsker: Yrkejobbønske[]): string[] => {
    return [...new Set(yrkesønsker.flatMap((yrkesønske) => yrkesønske.sokeTitler))];
};

export default useKandidat;
