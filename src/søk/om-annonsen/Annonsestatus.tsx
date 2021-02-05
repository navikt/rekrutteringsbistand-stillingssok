import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { QueryParam } from '../søkefelt/urlUtils';
import { SøkProps } from '../Søk';

export enum Status {
    Publisert = 'publisert',
    Stoppet = 'stoppet',
    Utløpt = 'utløpt',
}

const Annonsestatus: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    // TODO default
    const [publisert, setPublisert] = useState<boolean>(false);
    const [stoppet, setStoppet] = useState<boolean>(false);
    const [utløpt, setUtløpt] = useState<boolean>(false);

    const onAnnonsestatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        if (event.target.value === Status.Publisert) {
            setPublisert(checked);
            oppdaterSøk(QueryParam.Statuser, Status.Publisert);
        } else if (event.target.value === Status.Stoppet) {
            setStoppet(checked);
            oppdaterSøk(QueryParam.Statuser, Status.Stoppet);
        } else if (event.target.value === Status.Utløpt) {
            setUtløpt(checked);
            oppdaterSøk(QueryParam.Statuser, Status.Utløpt);
        } else if (!(publisert || stoppet || utløpt) || (publisert && stoppet && utløpt)) {
            oppdaterSøk(QueryParam.Statuser, null);
        }
    };

    return (
        <SkjemaGruppe legend={<Element>Hvor er annonsen publisert?</Element>}>
            <Checkbox
                className="søk__checkbox"
                label="Publisert"
                value={Status.Publisert}
                checked={publisert}
                onChange={onAnnonsestatusChange}
            />
            <Checkbox
                className="søk__checkbox"
                label="Stoppet"
                value={Status.Stoppet}
                checked={stoppet}
                onChange={onAnnonsestatusChange}
            />
            <Checkbox
                className="søk__checkbox"
                label="Utløpt"
                value={Status.Utløpt}
                checked={utløpt}
                onChange={onAnnonsestatusChange}
            />
        </SkjemaGruppe>
    );
};

export default Annonsestatus;
