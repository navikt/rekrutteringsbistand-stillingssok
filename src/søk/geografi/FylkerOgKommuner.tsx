import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Enhetstype, hentEnhetstype } from '../../skjermUtils';
import { SøkProps } from '../Søk';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { hentSøkekriterier, QueryParam } from '../søkefelt/urlUtils';
import { useLocation } from 'react-router-dom';
import fylkerOgKommuner from './fylkerOgKommuner.json';

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

    return (
        <Ekspanderbartpanel apen={enhetstype === Enhetstype.Desktop} tittel="Geografi">
            <SkjemaGruppe legend={<Element>Velg område</Element>}>
                {alleFylkerOgKommuner.map(({ fylke, kommuner }) => (
                    <Checkbox
                        className="søk__checkbox"
                        label={fylke}
                        value={fylke}
                        checked={valgteFylker.has(fylke)}
                        onChange={onFylkeChange}
                        key={fylke}
                    />
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

const alleFylkerOgKommuner: Array<FylkeMedKommuner> = [
    ...fylkerOgKommuner.map((fylkeMedKommuner) => ({
        fylke: fylkeMedKommuner.fylkesnavn,
        kommuner:
            fylkeMedKommuner.kommuner.length === 1
                ? []
                : fylkeMedKommuner.kommuner.map((kommune) => kommune.kommunenavnNorsk),
    })),
    {
        fylke: 'Svalbard',
        kommuner: [],
    },
].sort((fylke1, fylke2) => fylke1.fylke.localeCompare(fylke2.fylke));

export default FylkerOgKommuner;
