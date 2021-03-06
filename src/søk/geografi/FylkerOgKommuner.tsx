import React, { ChangeEvent, Fragment, FunctionComponent, useEffect, useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../../utils/urlUtils';
import { useHistory, useLocation } from 'react-router-dom';
import fylkerOgKommuner from './fylkerOgKommuner.json';
import { sorterAlfabetiskPåNorsk } from '../../utils/stringUtils';

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
        <Ekspanderbartpanel
            apen={enhetstype === Enhetstype.Desktop}
            tittel="Geografi"
            className="søk__ekspanderbart-panel"
        >
            <SkjemaGruppe legend={<Element>Velg fylke eller kommune</Element>}>
                {alleFylkerOgKommuner.map(({ fylke, kommuner }) => (
                    <Fragment key={fylke}>
                        <Checkbox
                            className="søk__checkbox"
                            label={fylke}
                            value={fylke}
                            checked={valgteFylker.has(fylke)}
                            onChange={onFylkeChange}
                        />
                        {valgteFylker.has(fylke) && kommuner.length > 0 && (
                            <fieldset>
                                <legend className="kun-skjermlesere">
                                    Velg kommuner i {fylke}
                                </legend>
                                {kommuner.map((kommune) => (
                                    <Checkbox
                                        className="søk__checkbox søk__checkbox--indentert"
                                        key={kommune}
                                        label={kommune.split('.')[1]}
                                        value={kommune}
                                        checked={valgteKommuner.has(kommune)}
                                        onChange={onKommuneChange}
                                    />
                                ))}
                            </fieldset>
                        )}
                    </Fragment>
                ))}
            </SkjemaGruppe>
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

type KommuneMedFylke = string;
type FylkeMedKommuner = {
    fylke: string;
    kommuner: Array<KommuneMedFylke>;
};

const hentKommunenavn = (kommunenavn: string, fylkesnavn: string): string => {
    if (kommunenavn === 'Våler' || kommunenavn === 'Herøy') {
        return `${kommunenavn} (${fylkesnavn})`;
    } else {
        return kommunenavn;
    }
};

const hentKommunenavnMedFylke = (kommunenavn: string, fylkesnavn: string): string => {
    return `${fylkesnavn}.${hentKommunenavn(kommunenavn, fylkesnavn)}`;
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
