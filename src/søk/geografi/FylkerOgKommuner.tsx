import React, { ChangeEvent, Fragment, FunctionComponent, useEffect, useState } from 'react';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../../utils/urlUtils';
import { useHistory, useLocation } from 'react-router-dom';
import fylkerOgKommuner from './fylkerOgKommuner.json';
import { sorterAlfabetiskPåNorsk } from '../../utils/stringUtils';
import Filtergruppe from '../Filtergruppe';
import css from '../Søk.module.css';

const FylkerOgKommuner: FunctionComponent = () => {
    const history = useHistory();
    const { search } = useLocation();

    const [valgteFylker, setValgteFylker] = useState<Set<string>>(hentSøkekriterier(search).fylker);
    const [valgteKommuner, setValgteKommuner] = useState<Set<string>>(
        hentSøkekriterier(search).kommuner
    );

    useEffect(() => {
        setValgteFylker(hentSøkekriterier(search).fylker);
        setValgteKommuner(hentSøkekriterier(search).kommuner);
    }, [search]);

    const oppdaterSøk = (parameter: QueryParam, verdi: string[]) => {
        oppdaterUrlMedParam({
            history,
            parameter,
            verdi,
        });
    };

    const onFylkeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fylke = event.target.value;
        const fylker = new Set<string>(valgteFylker);

        if (event.target.checked) {
            fylker.add(fylke);
        } else {
            fylker.delete(fylke);

            const kommuner = deaktiverKommunerIFylke(Array.from(valgteKommuner), fylke);
            oppdaterSøk(QueryParam.Kommuner, kommuner);
        }

        setValgteFylker(fylker);
        oppdaterSøk(QueryParam.Fylker, Array.from(fylker));
    };

    const onKommuneChange = (event: ChangeEvent<HTMLInputElement>) => {
        const kommuneMedFylke = event.target.value;
        const kommuner = new Set<string>(valgteKommuner);

        if (event.target.checked) {
            kommuner.add(kommuneMedFylke);
        } else {
            kommuner.delete(kommuneMedFylke);
        }

        oppdaterSøk(QueryParam.Kommuner, Array.from(kommuner));
    };

    return (
        <Filtergruppe tittel="Geografi">
            <CheckboxGroup legend="Velg fylke eller kommune" value={Array.from(valgteFylker)}>
                {alleFylkerOgKommuner.map(({ fylke, kommuner }) => (
                    <Fragment key={fylke}>
                        <Checkbox value={fylke} onChange={onFylkeChange}>
                            {fylke}
                        </Checkbox>
                        {valgteFylker.has(fylke) && kommuner.length > 0 && (
                            <CheckboxGroup
                                hideLegend
                                className={css.indentertCheckboxgruppe}
                                legend={`Velg kommuner i ${fylke}`}
                                value={Array.from(valgteKommuner)}
                            >
                                {kommuner.map((kommune) => (
                                    <Checkbox
                                        key={kommune.kommune}
                                        value={kommune.kommune}
                                        onChange={onKommuneChange}
                                    >
                                        {kommune.label}
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

type KommuneMedFylke = {
    kommune: string;
    label: string;
};

type FylkeMedKommuner = {
    fylke: string;
    kommuner: Array<KommuneMedFylke>;
};

const kommunerMedSamiskeNavnIStillinger: {
    [s: string]:
        | undefined
        | {
              samisk: string;
              søkeord: string;
          };
} = {
    Tana: {
        samisk: 'Deatnu',
        søkeord: 'Deatnu Tana',
    },
    Karasjok: {
        samisk: 'Karasjohka',
        søkeord: 'Karasjohka Karasjok',
    },
    Kautokeino: {
        samisk: 'Guovdageaidnu',
        søkeord: 'Guovdageaidnu Kautokeino',
    },
    Kåfjord: {
        samisk: 'Gáivuotna',
        søkeord: 'Gáivuotna Kåfjord',
    },
    Nesseby: {
        samisk: 'Unjargga',
        søkeord: 'Unjargga Nesseby',
    },
    Porsanger: {
        samisk: 'Porsángu Porsanki',
        søkeord: 'Porsanger Porsángu Porsanki',
    },
};

const hentSøkbartKommunenavn = (kommunenavn: string, fylkesnavn: string): string => {
    if (kommunenavn === 'Våler' || kommunenavn === 'Herøy') {
        return `${kommunenavn} (${fylkesnavn})`;
    } else {
        return kommunenavn;
    }
};

const hentKommunenavnMedFylke = (kommunenavnNorsk: string, fylkesnavn: string): KommuneMedFylke => {
    const kommunenavnSamisk = kommunerMedSamiskeNavnIStillinger[kommunenavnNorsk];

    return {
        kommune: `${fylkesnavn}.${hentSøkbartKommunenavn(
            kommunenavnSamisk ? kommunenavnSamisk.søkeord : kommunenavnNorsk,
            fylkesnavn
        )}`,
        label: kommunenavnSamisk
            ? `${kommunenavnNorsk} (${kommunenavnSamisk.samisk})`
            : kommunenavnNorsk,
    };
};

const deaktiverKommunerIFylke = (kommuner: string[], fylke: string): string[] => {
    return kommuner.filter((kommune) => kommune.split('.')[0] !== fylke);
};

const alleFylkerOgKommuner: Array<FylkeMedKommuner> = [
    ...fylkerOgKommuner.map(({ fylkesnavn, kommuner }) => ({
        fylke: fylkesnavn,
        kommuner:
            kommuner.length === 1
                ? []
                : kommuner
                      .sort((a, b) =>
                          sorterAlfabetiskPåNorsk(a.kommunenavnNorsk, b.kommunenavnNorsk)
                      )
                      .map((kommune) =>
                          hentKommunenavnMedFylke(kommune.kommunenavnNorsk, fylkesnavn)
                      ),
    })),
    {
        fylke: 'Svalbard',
        kommuner: [],
    },
].sort((a, b) => sorterAlfabetiskPåNorsk(a.fylke, b.fylke));

export default FylkerOgKommuner;
