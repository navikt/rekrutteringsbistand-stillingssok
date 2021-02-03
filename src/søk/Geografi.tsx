import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Enhetstype, hentEnhetstype } from '../skjermUtils';
import { SøkProps } from './Søk';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';

const Geografi: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    const [valgteOmråder, setValgteOmråder] = useState<Set<string>>(new Set());

    const onOmrådeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const område = event.target.value;
        const områder = new Set<string>(valgteOmråder.values());

        if (event.target.checked) {
            områder.add(område);
        } else {
            områder.delete(område);
        }

        // TODO: Legg i URL
        setValgteOmråder(områder);
    };

    return (
        <Ekspanderbartpanel apen={enhetstype === Enhetstype.Desktop} tittel="Geografi" className="">
            <SkjemaGruppe legend={<Element>Fylke</Element>}>
                {områder.map((område) => (
                    <Checkbox
                        label={område}
                        value={område}
                        onChange={onOmrådeChange}
                        key={område}
                    />
                ))}
            </SkjemaGruppe>
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

const områder = [
    'Agder',
    'Innlandet',
    'Møre og Romsdal',
    'Nordland',
    'Oslo',
    'Rogaland',
    'Svalbard',
    'Troms og Finnmark',
    'Trøndelag',
    'Vestfold og Telemark',
    'Vestland',
    'Viken',
    'Utland',
];

export default Geografi;
