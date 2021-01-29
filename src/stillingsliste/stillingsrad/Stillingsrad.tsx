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
    let arbeidssted = null;

    if (locations.length > 0) {
        const location = locations[0];

        if (location.municipal) {
            arbeidssted = location.municipal;
        } else if (location.county) {
            arbeidssted = location.county;
        }

        if (locations.length > 1) {
            arbeidssted += '...';
        }
    }
    return arbeidssted;
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
                    {konverterTilPresenterbarDato(stilling.created)}
                </Undertekst>
                <Normaltekst>{formaterMedStoreOgSmåBokstaver(stilling.employer?.name)}</Normaltekst>
                <Link className="stillingsrad__tittel lenke" to={lagUrlTilStilling(stilling)}>
                    {stilling.title}
                </Link>
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
