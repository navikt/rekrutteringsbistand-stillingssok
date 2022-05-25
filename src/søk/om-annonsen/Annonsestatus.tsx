import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../../utils/urlUtils';
import { useHistory, useLocation } from 'react-router-dom';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

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

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Statuser,
            verdi: Array.from(statuser),
        });
    };

    return (
        <CheckboxGroup legend="Status" className="søk__avstand">
            {Object.values(Status).map((statusValue) => (
                <Checkbox
                    size="small"
                    key={statusValue}
                    value={statusValue}
                    checked={valgteStatuser.has(statusValue)}
                    onChange={onAnnonsestatusChange}
                >
                    {statusValue[0].toUpperCase() + statusValue.substring(1)}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
};

export default Annonsestatus;
