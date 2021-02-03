import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Enhetstype, hentEnhetstype } from '../../skjermUtils';
import { SøkProps } from '../Søk';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { hentSøkekriterier, QueryParam } from '../søkefelt/urlUtils';
import { useLocation } from 'react-router-dom';
import fylkerOgKommuner from './fylkerOgKommuner.json';

const Geografi: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    const { search } = useLocation();
    const [valgteFylker, setValgteFylker] = useState<Set<string>>(hentSøkekriterier(search).fylker);

    const onOmrådeChange = (event: ChangeEvent<HTMLInputElement>) => {
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
            <SkjemaGruppe legend={<Element>Velg fylke</Element>}>
                {alleFylker.map((område) => (
                    <Checkbox
                        className="søk__checkbox"
                        label={område}
                        value={område}
                        checked={valgteFylker.has(område)}
                        onChange={onOmrådeChange}
                        key={område}
                    />
                ))}
            </SkjemaGruppe>
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

const alleFylker = [...fylkerOgKommuner.map((fylke) => fylke.fylkesnavn), 'Svalbard'].sort();

export default Geografi;
