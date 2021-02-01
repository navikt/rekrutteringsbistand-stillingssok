import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { useHistory } from 'react-router-dom';
import { byggUrlMedParam, QueryParam } from './søkefelt/urlUtils';
import { SøkProps } from './Søk';

export enum Publisert {
    Intern = 'intern',
    Arbeidsplassen = 'arbeidsplassen',
    Alle = 'alle',
}

const HvorErAnnonsenPublisert: FunctionComponent<SøkProps> = ({ søkBasertPåUrl }) => {
    const history = useHistory();

    const [interntINav, setInterntINav] = useState<boolean>(false);
    const [påArbeidsplassen, setPåArbeidsplassen] = useState<boolean>(false);

    useEffect(() => {
        let publisert;
        const publisertHvorSomHelst = interntINav === påArbeidsplassen;
        if (publisertHvorSomHelst) {
            publisert = null;
        } else if (interntINav) {
            publisert = Publisert.Intern;
        } else {
            publisert = Publisert.Arbeidsplassen;
        }

        const url = byggUrlMedParam(QueryParam.Publisert, publisert);
        history.replace({ search: url.search });
    }, [interntINav, påArbeidsplassen, history]);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        søkBasertPåUrl();

        if (event.target.value === Publisert.Intern) {
            setInterntINav(event.target.checked);
        } else if (event.target.value === Publisert.Arbeidsplassen) {
            setPåArbeidsplassen(event.target.checked);
        }
    };

    return (
        <SkjemaGruppe legend="Hvor er annonsen publisert?">
            <Checkbox
                label="Internt i NAV"
                value={Publisert.Intern}
                checked={interntINav}
                onChange={onChange}
            />
            <Checkbox
                label="På Arbeidsplassen"
                value={Publisert.Arbeidsplassen}
                checked={påArbeidsplassen}
                onChange={onChange}
            />
        </SkjemaGruppe>
    );
};

export default HvorErAnnonsenPublisert;
