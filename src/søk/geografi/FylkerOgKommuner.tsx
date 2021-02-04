import React, { ChangeEvent, Fragment, FunctionComponent, useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import { SøkProps } from '../Søk';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { hentSøkekriterier, QueryParam } from '../søkefelt/urlUtils';
import { useLocation } from 'react-router-dom';
import fylkerOgKommuner from './fylkerOgKommuner.json';
import { sorterAlfabetiskPåNorsk } from '../../utils/stringUtils';

const FylkerOgKommuner: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    const { search } = useLocation();

    const [valgteFylker, setValgteFylker] = useState<Set<string>>(hentSøkekriterier(search).fylker);
    const [valgteKommuner, setValgteKommuner] = useState<Set<string>>(
        hentSøkekriterier(search).kommuner
    );

    const onFylkeChange = (event: ChangeEvent<HTMLInputElement>) => {
        // TODO: Hvis man deaktiverer fylke skal fylket og alle dens kommuner fjernes fra URL

        const fylke = event.target.value;
        const fylker = new Set<string>(valgteFylker.values());

        if (event.target.checked) {
            fylker.add(fylke);
        } else {
            fylker.delete(fylke);
        }

        setValgteFylker(fylker);
        oppdaterSøk(QueryParam.Fylker, fylker.size !== 0 ? Array.from(fylker) : null);
    };

    const onKommuneChange = (event: ChangeEvent<HTMLInputElement>) => {
        const kommuneMedFylke = event.target.value;
        const kommuner = new Set<string>(valgteKommuner.values());

        if (event.target.checked) {
            kommuner.add(kommuneMedFylke);
        } else {
            kommuner.delete(kommuneMedFylke);
        }

        setValgteKommuner(kommuner);
        oppdaterSøk(QueryParam.Kommuner, Array.from(kommuner));
    };

    return (
        <Ekspanderbartpanel apen={enhetstype === Enhetstype.Desktop} tittel="Geografi">
            <SkjemaGruppe legend={<Element>Velg område</Element>}>
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
    const navn = kommunenavn === 'Våler' ? `${kommunenavn} (${fylkesnavn})` : kommunenavn;
    return navn;
};

const hentKommunenavnMedFylke = (kommunenavn: string, fylkesnavn: string): string => {
    return `${fylkesnavn}.${hentKommunenavn(kommunenavn, fylkesnavn)}`;
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
