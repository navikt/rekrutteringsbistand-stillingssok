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

    const onFylkeChange = (event: ChangeEvent<HTMLInputElement>) => {
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

    const onKommuneChange = (event: ChangeEvent<HTMLInputElement>) => {};

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
                                        label={kommune}
                                        value={kommune}
                                        checked={false}
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

type FylkeMedKommuner = {
    fylke: string;
    kommuner: string[];
};

const hentKommunenavn = (kommunenavn: string, fylkesnavn: string): string =>
    kommunenavn === 'Våler' ? `${kommunenavn} (${fylkesnavn})` : kommunenavn;

const alleFylkerOgKommuner: Array<FylkeMedKommuner> = [
    ...fylkerOgKommuner.map(({ fylkesnavn, kommuner }) => ({
        fylke: fylkesnavn,
        kommuner:
            kommuner.length === 1
                ? []
                : kommuner
                      .map((kommune) => hentKommunenavn(kommune.kommunenavnNorsk, fylkesnavn))
                      .sort(sorterAlfabetiskPåNorsk),
    })),
    {
        fylke: 'Svalbard',
        kommuner: [],
    },
].sort((fylke1, fylke2) => sorterAlfabetiskPåNorsk(fylke1.fylke, fylke2.fylke));

export default FylkerOgKommuner;
