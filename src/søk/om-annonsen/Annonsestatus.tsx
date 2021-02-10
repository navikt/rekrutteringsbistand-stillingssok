import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { byggUrlMedParam, hentSøkekriterier, QueryParam } from '../søkefelt/urlUtils';
import { useHistory, useLocation } from 'react-router-dom';

export enum Status {
    Publisert = 'publisert',
    Stoppet = 'stoppet',
    Utløpt = 'utløpt',
}

const Annonsestatus: FunctionComponent = () => {
    const history = useHistory();
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

        const { search } = byggUrlMedParam(QueryParam.Statuser, Array.from(statuser));
        history.replace({ search });
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
