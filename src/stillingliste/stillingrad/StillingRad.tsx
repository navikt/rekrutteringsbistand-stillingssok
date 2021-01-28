import React, { FunctionComponent } from 'react';
import { Rekrutteringsbistandstilling } from '../../Stilling';
import { Link } from 'react-router-dom';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Hamburgerknapp } from 'nav-frontend-ikonknapper';
import { EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { konverterTilPresenterbarDato } from './datoUtils';
import {
    lagUrlTilKandidatliste,
    lagUrlTilStilling,
    skalViseLenkeTilKandidatliste,
} from '../../stillingsUtils';
import './StillingRad.less';
import formatterMedStoreOgSmåBokstaver from './formaterMedStoreOgSmåBokstaver';

type Props = {
    rekrutteringsbistandstilling: Rekrutteringsbistandstilling;
};

const StillingRad: FunctionComponent<Props> = ({ rekrutteringsbistandstilling }) => {
    const stilling = rekrutteringsbistandstilling.stilling;

    return (
        <li className="stillingrad">
            <div className="stillingrad__info">
                <Undertekst className="stillingrad__opprettet">
                    {konverterTilPresenterbarDato(stilling.created)}
                </Undertekst>
                <Normaltekst>
                    {formatterMedStoreOgSmåBokstaver(stilling.employer?.name)}
                </Normaltekst>
                <Link className="stillingrad__lenke lenke" to={lagUrlTilStilling(stilling)}>
                    {stilling.title}
                </Link>
                <span>
                    {stilling.locations[0].municipal} | Søknadsfrist:{' '}
                    {konverterTilPresenterbarDato(stilling.properties.applicationdue)}
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
                {skalViseLenkeTilKandidatliste(rekrutteringsbistandstilling) && (
                    <Link to={lagUrlTilKandidatliste(stilling)} title="Se kandidatliste">
                        <Hamburgerknapp />
                    </Link>
                )}
                <div />
            </div>
        </li>
    );
};

export default StillingRad;
