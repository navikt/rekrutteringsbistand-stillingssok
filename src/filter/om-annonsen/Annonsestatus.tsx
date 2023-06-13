import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../../utils/urlUtils';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import useNavigering from '../../useNavigering';

export enum Status {
    Publisert = 'publisert',
    Stoppet = 'stoppet',
    Utløpt = 'utløpt',
}

const Annonsestatus: FunctionComponent = () => {
    const { searchParams, navigate } = useNavigering();

    const [valgteStatuser, setValgteStatuser] = useState<Set<Status>>(
        hentSøkekriterier(searchParams).statuser
    );

    useEffect(() => {
        setValgteStatuser(hentSøkekriterier(searchParams).statuser);
    }, [searchParams]);

    const onAnnonsestatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        const status = event.target.value as Status;
        const statuser = new Set<Status>(valgteStatuser);

        if (event.target.checked) {
            statuser.add(status);
        } else {
            statuser.delete(status);
        }

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Statuser,
            verdi: Array.from(statuser),
        });
    };

    return (
        <CheckboxGroup legend="Status" value={Array.from(valgteStatuser)}>
            {Object.values(Status).map((statusValue) => (
                <Checkbox key={statusValue} value={statusValue} onChange={onAnnonsestatusChange}>
                    {statusTilVisningsnavn(statusValue)}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
};

export const statusTilVisningsnavn = (status: Status) => {
    switch (status) {
        case Status.Publisert:
            return 'Publisert';
        case Status.Stoppet:
            return 'Stoppet';
        case Status.Utløpt:
            return 'Utløpt';
    }
};

export default Annonsestatus;
