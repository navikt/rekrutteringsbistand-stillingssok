import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { useHistory, useLocation } from 'react-router-dom';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../../utils/urlUtils';
import '../Søk.less';

export enum Publisert {
    Intern = 'intern',
    Arbeidsplassen = 'arbeidsplassen',
}

const HvorErAnnonsenPublisert: FunctionComponent = () => {
    const history = useHistory();
    const { search } = useLocation<Navigeringsstate>();
    const [publiseringssteder, setPubliseringssteder] = useState<Set<Publisert>>(
        hentSøkekriterier(search).publisert
    );

    useEffect(() => {
        setPubliseringssteder(hentSøkekriterier(search).publisert);
    }, [search]);

    const onPubliseringsstederChange = (event: ChangeEvent<HTMLInputElement>) => {
        const publiseringssted = event.target.value as Publisert;
        const nyePubliseringssteder = new Set<Publisert>(publiseringssteder);

        if (event.target.checked) {
            nyePubliseringssteder.add(publiseringssted);
        } else {
            nyePubliseringssteder.delete(publiseringssted);
        }

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Publisert,
            verdi: Array.from(nyePubliseringssteder),
        });
    };

    return (
        <SkjemaGruppe legend={<Element>Hvor er annonsen synlig?</Element>}>
            {Object.values(Publisert).map((publisertValue) => (
                <Checkbox
                    key={publisertValue}
                    className="søk__checkbox"
                    label={labels[publisertValue]}
                    value={publisertValue}
                    checked={publiseringssteder.has(publisertValue)}
                    onChange={onPubliseringsstederChange}
                />
            ))}
        </SkjemaGruppe>
    );
};

const labels: Record<Publisert, string> = {
    [Publisert.Intern]: 'Internt i NAV (direktemeldt)',
    [Publisert.Arbeidsplassen]: 'På Arbeidsplassen',
};

export default HvorErAnnonsenPublisert;
