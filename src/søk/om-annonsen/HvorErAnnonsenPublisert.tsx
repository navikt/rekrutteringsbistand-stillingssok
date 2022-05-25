import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    hentSøkekriterier,
    Navigeringsstate,
    oppdaterUrlMedParam,
    QueryParam,
} from '../../utils/urlUtils';
import '../Søk.less';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

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
        <CheckboxGroup legend="Hvor er annonsen synlig?">
            {Object.values(Publisert).map((publisertValue) => (
                <Checkbox
                    size="small"
                    key={publisertValue}
                    value={publisertValue}
                    checked={publiseringssteder.has(publisertValue)}
                    onChange={onPubliseringsstederChange}
                >
                    {labels[publisertValue]}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
};

const labels: Record<Publisert, string> = {
    [Publisert.Intern]: 'Internt i NAV (direktemeldt)',
    [Publisert.Arbeidsplassen]: 'På Arbeidsplassen',
};

export default HvorErAnnonsenPublisert;
