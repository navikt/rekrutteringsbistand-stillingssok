import React, { FunctionComponent } from 'react';
import {Location, Privacy, Rekrutteringsbistandstilling, Stillingsinfo} from '../../Stilling';
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
import { hentHovedtags } from '../../søk/inkludering/tags';

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

function fornavnEtternavn(stillingsInfo: Stillingsinfo | null) {
    if(stillingsInfo == null || stillingsInfo.eierNavn == null) return null;
    const navnDel = stillingsInfo.eierNavn.split(",");
    if(navnDel.length != 2) return stillingsInfo.eierNavn;
    return navnDel[1].trim() + " " + navnDel[0].trim();
}

const Stillingsrad: FunctionComponent<Props> = ({ rekrutteringsbistandstilling }) => {
    const stilling = rekrutteringsbistandstilling.stilling;
    const eierNavn = fornavnEtternavn(rekrutteringsbistandstilling.stillingsinfo);

    const antallStillinger = stilling.properties.positioncount;
    const antallStillingerSuffix = antallStillinger === 1 ? ` stilling` : ` stillinger`;

    const erInternStilling = stilling.privacy == Privacy.Intern;

    const arbeidsgiversNavn = formaterMedStoreOgSmåBokstaver(stilling.employer?.name);

    const registrertMedInkluderingsmulighet = stilling.properties.tags?.some((tag) =>
        hentHovedtags().includes(tag)
    );

    return (
        <li className="stillingsrad">
            <div className="stillingsrad__info">
                <div className="stillingsrad__etiketter-og-dato">
                    <div className="stillingsrad__etiketter">
                        {registrertMedInkluderingsmulighet && (
                            <EtikettInfo
                                mini
                                className="stillingsrad__etikett stillingsrad__etikett--inkludering"
                            >
                                Inkludering
                            </EtikettInfo>
                        )}
                        {stilling.source === 'DIR' && (
                            <EtikettInfo
                                mini
                                className="stillingsrad__etikett stillingsrad__etikett--intern"
                            >
                                Intern
                            </EtikettInfo>
                        )}
                        {stilling.privacy === 'SHOW_ALL' && (
                            <EtikettInfo
                                mini
                                className="stillingsrad__etikett stillingsrad__etikett--arbeidsplassen"
                            >
                                Arbeidsplassen
                            </EtikettInfo>
                        )}
                    </div>
                    <Undertekst className="stillingsrad__opprettet">
                        {konverterTilPresenterbarDato(stilling.published)}
                    </Undertekst>
                </div>
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
                    {stilling.properties.applicationdue && (
                        <span>
                            Søknadsfrist:{' '}
                            {konverterTilPresenterbarDato(stilling.properties.applicationdue)}
                        </span>
                    )}
                    {antallStillinger && (
                        <span>
                            {antallStillinger} {antallStillingerSuffix}
                        </span>
                    )}
                    {erInternStilling && eierNavn && (
                        <span>
                            Eier: {eierNavn}
                        </span>
                    )}
                </span>
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
