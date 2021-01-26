import React, { FunctionComponent } from 'react';
import { Rekrutteringsbistandstilling } from '../../Stilling';
import { Link } from 'react-router-dom';
import './StillingRad.less';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Hamburgerknapp } from 'nav-frontend-ikonknapper';
import { EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { konverterTilPresenterbarDato } from './datoUtils';

type Props = {
    rekrutteringsbistandstilling: Rekrutteringsbistandstilling;
};

const StillingRad: FunctionComponent<Props> = ({ rekrutteringsbistandstilling }) => {
    const stilling = rekrutteringsbistandstilling.stilling;
    const stillingsinfo = rekrutteringsbistandstilling.stillingsinfo;

    return (
        <li className="stillingrad">
            <div className="stillingrad__info">
                <Undertekst className="stillingrad__opprettet">
                    {konverterTilPresenterbarDato(stilling.created)}
                </Undertekst>
                <Normaltekst>{stilling.employer?.name}</Normaltekst>
                <Link
                    className="stillingrad__lenke lenke"
                    to={`/stillinger/stilling/${stilling.uuid}`}
                >
                    {stilling.title}
                </Link>
                <span>
                    {stilling.locations[0].municipal} | Søknadsfrist:{' '}
                    {stilling.properties.applicationdue}
                </span>
            </div>
            <div className="stillingrad__etikett-og-knapp">
                <span>
                    {stilling.source === 'DIR' ? (
                        <EtikettSuksess mini>Intern</EtikettSuksess>
                    ) : (
                        <EtikettInfo mini>Arbeidsplassen</EtikettInfo>
                    )}
                </span>
                {stilling.source === 'DIR' ||
                    (stillingsinfo && (
                        <Link to={`/kandidater/lister/stilling/${stilling.uuid}/detaljer`}>
                            <Hamburgerknapp />
                        </Link>
                    ))}
                <div />
            </div>
        </li>
    );
};

export default StillingRad;
