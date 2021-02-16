import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { useHistory, useLocation } from 'react-router-dom';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../søkefelt/urlUtils';
import '../Søk.less';

export enum Publisert {
    Intern = 'intern',
    Arbeidsplassen = 'arbeidsplassen',
    Alle = 'alle',
}

const matcherPublisertIUrl = (publisert: Publisert, searchParams: string) =>
    hentSøkekriterier(searchParams).publisert === publisert;

const HvorErAnnonsenPublisert: FunctionComponent = () => {
    const history = useHistory();
    const { search, state } = useLocation<Navigeringsstate>();

    const [interntINav, setInterntINav] = useState<boolean>(
        matcherPublisertIUrl(Publisert.Intern, search)
    );
    const [påArbeidsplassen, setPåArbeidsplassen] = useState<boolean>(
        matcherPublisertIUrl(Publisert.Arbeidsplassen, search)
    );

    useEffect(() => {
        if (state?.harSlettetKriterier) {
            setInterntINav(false);
            setPåArbeidsplassen(false);
        }
    }, [search, state, interntINav, påArbeidsplassen]);

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
        let verdi =
            interntINav === påArbeidsplassen
                ? null
                : interntINav
                ? Publisert.Intern
                : Publisert.Arbeidsplassen;

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Publisert,
            verdi,
        });
    };

    return (
        <SkjemaGruppe legend={<Element>Hvor er annonsen synlig?</Element>}>
            <Checkbox
                className="søk__checkbox"
                label="Internt i NAV (direktemeldt)"
                value={Publisert.Intern}
                checked={interntINav}
                onChange={onPublisertChange}
            />
            <Checkbox
                className="søk__checkbox"
                label="På Arbeidsplassen"
                value={Publisert.Arbeidsplassen}
                checked={påArbeidsplassen}
                onChange={onPublisertChange}
            />
        </SkjemaGruppe>
    );
};

export default HvorErAnnonsenPublisert;
