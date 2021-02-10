import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { hentSøkekriterier, QueryParam } from '../søkefelt/urlUtils';
import { SøkProps } from '../Søk';
import { useLocation } from 'react-router-dom';

export enum Status {
    Publisert = 'publisert',
    Stoppet = 'stoppet',
    Utløpt = 'utløpt',
}

const Annonsestatus: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    const { search } = useLocation();
    const [valgteStatuser, setValgteStatuser] = useState<Set<Status>>(
        hentSøkekriterier(search).statuser
    );

    useEffect(() => {
        setValgteStatuser(hentSøkekriterier(search).statuser);
    }, [search]);

    const onAnnonsestatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        const status = event.target.value as Status;
        const statuser = new Set<Status>(valgteStatuser);

        if (event.target.checked) {
            statuser.add(status);
        } else {
            statuser.delete(status);
        }

        oppdaterSøk(QueryParam.Statuser, Array.from(statuser));
    };

    return (
        <SkjemaGruppe legend={<Element>Status</Element>}>
            {Object.values(Status).map((statusValue) => (
                <Checkbox
                    key={statusValue}
                    className="søk__checkbox"
                    label={statusValue[0].toUpperCase() + statusValue.substring(1)}
                    value={statusValue}
                    checked={valgteStatuser.has(statusValue)}
                    onChange={onAnnonsestatusChange}
                />
            ))}
        </SkjemaGruppe>
    );
};

export default Annonsestatus;
