import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { useHistory } from 'react-router-dom';
import { hentSøkekriterier, QueryParam } from './søkefelt/urlUtils';
import { SøkProps } from './Søk';

export enum Publisert {
    Intern = 'intern',
    Arbeidsplassen = 'arbeidsplassen',
    Alle = 'alle',
}

const matcherPublisertIUrl = (publisert: Publisert, searchParams: string) =>
    hentSøkekriterier(searchParams).publisert === publisert;

const HvorErAnnonsenPublisert: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    const history = useHistory();
    const search = history.location.search;

    const [interntINav, setInterntINav] = useState<boolean>(
        matcherPublisertIUrl(Publisert.Intern, search)
    );
    const [påArbeidsplassen, setPåArbeidsplassen] = useState<boolean>(
        matcherPublisertIUrl(Publisert.Arbeidsplassen, search)
    );

    const onPublisertChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        if (event.target.value === Publisert.Intern) {
            setInterntINav(checked);
            settIUrlOgSøk(checked, påArbeidsplassen);
        } else {
            setPåArbeidsplassen(checked);
            settIUrlOgSøk(interntINav, checked);
        }
    };

    const settIUrlOgSøk = (interntINav: boolean, påArbeidsplassen: boolean) => {
        if (interntINav === påArbeidsplassen) {
            oppdaterSøk(QueryParam.Publisert, null);
        } else if (interntINav) {
            oppdaterSøk(QueryParam.Publisert, Publisert.Intern);
        } else {
            oppdaterSøk(QueryParam.Publisert, Publisert.Arbeidsplassen);
        }
    };

    return (
        <SkjemaGruppe legend={<Element>Hvor er annonsen publisert?</Element>}>
            <Checkbox
                label="Internt i NAV"
                value={Publisert.Intern}
                checked={interntINav}
                onChange={onPublisertChange}
            />
            <Checkbox
                label="På Arbeidsplassen"
                value={Publisert.Arbeidsplassen}
                checked={påArbeidsplassen}
                onChange={onPublisertChange}
            />
        </SkjemaGruppe>
    );
};

export default HvorErAnnonsenPublisert;
