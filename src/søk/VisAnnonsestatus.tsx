import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { useHistory } from 'react-router-dom';
import { hentSøkekriterier, QueryParam } from './søkefelt/urlUtils';
import { SøkProps } from './Søk';

export enum Annonsestatus {
    Publisert = 'publisert',
    Stoppet = 'stoppet',
    Utløpt = 'utløpt',
}

const matcherAnnonsestatusIUrl = (annonsestatuser: Set<Annonsestatus>, searchParams: string) =>
    hentSøkekriterier(searchParams).annonsestatuser === annonsestatuser;

const VisAnnonsestatus: FunctionComponent<SøkProps> = ({ oppdaterSøk }) => {
    const history = useHistory();
    const search = history.location.search;

    const [publisert, setPublisert] = useState<boolean>(
        matcherAnnonsestatusIUrl(Annonsestatus.Publisert, search)
    );

    const [stoppet, setStoppet] = useState<boolean>(
        matcherAnnonsestatusIUrl(Annonsestatus.Stoppet, search)
    );

    const [utløpt, setUtløpt] = useState<boolean>(
        matcherAnnonsestatusIUrl(Annonsestatus.Utløpt, search)
    );

    const onAnnonsestatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        if (event.target.value === Annonsestatus.Publisert) {
            setPublisert(checked);
            oppdaterSøk(QueryParam.Annonsestatuser, Annonsestatus.Publisert);
        } else if (event.target.value === Annonsestatus.Stoppet) {
            setStoppet(checked);
            oppdaterSøk(QueryParam.Annonsestatuser, Annonsestatus.Stoppet);
        } else if (event.target.value === Annonsestatus.Utløpt) {
            setUtløpt(checked);
            oppdaterSøk(QueryParam.Annonsestatuser, Annonsestatus.Utløpt);
        } else if (!(publisert || stoppet || utløpt) || (publisert && stoppet && utløpt)) {
            oppdaterSøk(QueryParam.Annonsestatuser, null);
        }
    };

    return (
        <SkjemaGruppe legend={<Element>Hvor er annonsen publisert?</Element>}>
            <Checkbox
                label="Publisert"
                value={Annonsestatus.Publisert}
                checked={publisert}
                onChange={onAnnonsestatusChange}
            />
            <Checkbox
                label="Stoppet"
                value={Annonsestatus.Stoppet}
                checked={stoppet}
                onChange={onAnnonsestatusChange}
            />
            <Checkbox
                label="Utløpt"
                value={Annonsestatus.Utløpt}
                checked={utløpt}
                onChange={onAnnonsestatusChange}
            />
        </SkjemaGruppe>
    );
};

export default VisAnnonsestatus;
