import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { useHistory, useLocation } from 'react-router-dom';
import { byggUrlMedParam, hentSøkekriterier, QueryParam } from '../søkefelt/urlUtils';
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
    const { search } = useLocation();

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
        let url;

        if (interntINav === påArbeidsplassen) {
            url = byggUrlMedParam(QueryParam.Publisert, null);
        } else if (interntINav) {
            url = byggUrlMedParam(QueryParam.Publisert, Publisert.Intern);
        } else {
            url = byggUrlMedParam(QueryParam.Publisert, Publisert.Arbeidsplassen);
        }

        history.replace({ search: url.search });
    };

    return (
        <SkjemaGruppe legend={<Element>Hvor er annonsen publisert?</Element>}>
            <Checkbox
                className="søk__checkbox"
                label="Internt i NAV"
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
