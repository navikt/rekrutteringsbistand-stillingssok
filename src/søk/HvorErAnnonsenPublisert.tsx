import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { useHistory } from 'react-router-dom';
import { byggUrlMedParam, QueryParam } from './søkefelt/urlUtils';

export enum Publisert {
    Intern = 'intern',
    Arbeidsplassen = 'arbeidsplassen',
    Alle = 'alle',
}

const HvorErAnnonsenPublisert: FunctionComponent = () => {
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

    // TODO Slå sammen til én med value
    const onInterntINavChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInterntINav(event.target.checked);
    };

    const onPåArbeidsplassenChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPåArbeidsplassen(event.target.checked);
    };

    return (
        <SkjemaGruppe legend="Hvor er annonsen publisert?">
            <Checkbox label="Internt i NAV" checked={interntINav} onChange={onInterntINavChange} />
            <Checkbox
                label="På Arbeidsplassen"
                checked={påArbeidsplassen}
                onChange={onPåArbeidsplassenChange}
            />
        </SkjemaGruppe>
    );
};

export default HvorErAnnonsenPublisert;
