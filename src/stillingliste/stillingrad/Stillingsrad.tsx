import React, { FunctionComponent } from 'react';
import { Rekrutteringsbistandstilling } from '../../Stilling';
import { Link } from 'react-router-dom';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Hamburgerknapp } from 'nav-frontend-ikonknapper';
import { EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { konverterTilPresenterbarDato } from './datoUtils';
import {
    erDirektemeldtStilling,
    lagUrlTilKandidatliste,
    lagUrlTilStilling,
    skalViseLenkeTilKandidatliste,
} from '../../stillingsUtils';
import formaterMedStoreOgSmåBokstaver from './formaterMedStoreOgSmåBokstaver';
import './Stillingsrad.less';

type Props = {
    rekrutteringsbistandstilling: Rekrutteringsbistandstilling;
};

const Stillingsrad: FunctionComponent<Props> = ({ rekrutteringsbistandstilling }) => {
    const stilling = rekrutteringsbistandstilling.stilling;

    const antallStillinger = stilling.properties.positioncount;
    const antallStillingerSuffix = antallStillinger === 1 ? ` stilling` : ` stillinger`;

    return (
        <li className="stillingsrad">
            <div className="stillingsrad__info">
                <Undertekst className="stillingsrad__opprettet">
                    {konverterTilPresenterbarDato(stilling.created)}
                </Undertekst>
                <Normaltekst>{formaterMedStoreOgSmåBokstaver(stilling.employer?.name)}</Normaltekst>
                <Link className="stillingsrad__lenke lenke" to={lagUrlTilStilling(stilling)}>
                    {stilling.title}
                </Link>
                <span className="stillingsrad__stillingsinfo">
                    <span>{formaterMedStoreOgSmåBokstaver(stilling.locations[0].municipal)}</span>
                    <span>
                        Søknadsfrist:{' '}
                        {konverterTilPresenterbarDato(stilling.properties.applicationdue)}
                    </span>
                    {antallStillinger && (
                        <span>
                            {antallStillinger} {antallStillingerSuffix}
                        </span>
                    )}
                </span>
            </div>
            <div className="stillingsrad__etikett">
                {erDirektemeldtStilling(stilling) ? (
                    <EtikettSuksess mini>Intern</EtikettSuksess>
                ) : (
                    <EtikettInfo mini>Arbeidsplassen</EtikettInfo>
                )}
            </div>
            <div className="stillingsrad__kandidatlisteknapp">
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

export default Stillingsrad;
