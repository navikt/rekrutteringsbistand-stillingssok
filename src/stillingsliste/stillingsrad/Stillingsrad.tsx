import React, { FunctionComponent } from 'react';
import { Location, Privacy, Rekrutteringsbistandstilling } from '../../Stilling';
import { Link } from 'react-router-dom';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { List } from '@navikt/ds-icons';
import { konverterTilPresenterbarDato } from './datoUtils';
import {
    lagUrlTilKandidatliste,
    lagUrlTilStilling,
    skalViseLenkeTilKandidatliste,
} from '../../utils/stillingsUtils';
import formaterMedStoreOgSmåBokstaver from '../../utils/stringUtils';
import './Stillingsrad.less';

const hentArbeidssted = (locations: Location[]): string | null => {
    const filtrerteLocations: string[] = [];
    locations.forEach((location) => {
        if (location.municipal) {
            filtrerteLocations.push(location.municipal);
        } else if (location.county) {
            filtrerteLocations.push(location.county);
        }
    });

    return filtrerteLocations.join(', ');
};

type Props = {
    rekrutteringsbistandstilling: Rekrutteringsbistandstilling;
};

const Stillingsrad: FunctionComponent<Props> = ({ rekrutteringsbistandstilling }) => {
    const stilling = rekrutteringsbistandstilling.stilling;

    const antallStillinger = stilling.properties.positioncount;
    const antallStillingerSuffix = antallStillinger === 1 ? ` stilling` : ` stillinger`;

    const arbeidsgiversNavn = formaterMedStoreOgSmåBokstaver(stilling.employer?.name);

    return (
        <li className="stillingsrad">
            <div className="stillingsrad__info">
                <Undertekst className="stillingsrad__opprettet">
                    {konverterTilPresenterbarDato(stilling.published)}
                </Undertekst>
                {arbeidsgiversNavn && <Normaltekst>{arbeidsgiversNavn}</Normaltekst>}
                <div className="stillingsrad__tittel">
                    <Link
                        className="stillingsrad__lenke-til-stilling lenke"
                        to={lagUrlTilStilling(stilling)}
                    >
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
                    <EtikettInfo mini className="stillingsrad__etikett--intern">
                        Intern
                    </EtikettInfo>
                ) : (
                    <EtikettInfo mini className="stillingsrad__etikett--arbeidsplassen">
                        Arbeidsplassen
                    </EtikettInfo>
                )}
            </div>
            <div className="stillingsrad__kandidatlisteknapp">
                {skalViseLenkeTilKandidatliste(rekrutteringsbistandstilling) && (
                    <Link to={lagUrlTilKandidatliste(stilling)} title="Se kandidatliste">
                        <List className="lenke" />
                    </Link>
                )}
                <div />
            </div>
        </li>
    );
};

export default Stillingsrad;
