import React, { FunctionComponent } from 'react';
import { Location, Privacy, Rekrutteringsbistandstilling } from '../../Stilling';
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
import formaterMedStoreOgSmåBokstaver from './formaterMedStoreOgSmåBokstaver';
import './Stillingsrad.less';

const hentArbeidssted = (locations: Location[]): string | null => {
    return locations
        .map((location) => {
            if (location.municipal) {
                return location.municipal;
            } else if (location.county) {
                return location.county;
            } else {
                return null;
            }
        })
        .join(', ');
};

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
                    {konverterTilPresenterbarDato(stilling.published)}
                </Undertekst>
                <Normaltekst>{formaterMedStoreOgSmåBokstaver(stilling.employer?.name)}</Normaltekst>
                <div className="stillingsrad__tittel">
                    <Link className="lenke" to={lagUrlTilStilling(stilling)}>
                        {stilling.title}
                    </Link>
                </div>
                <span className="stillingsrad__stillingsinfo">
                    <span>
                        {formaterMedStoreOgSmåBokstaver(hentArbeidssted(stilling.locations)) ||
                            'Ingen arbeidssted'}
                    </span>
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
                {stilling.privacy === Privacy.Intern ? (
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
