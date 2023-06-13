import React from 'react';
import { Heading } from '@navikt/ds-react';
import useKandidat from './useKandidat';
import css from './Kandidatbanner.module.css';
import {
    ChangingRoomIcon,
    EnvelopeClosedIcon,
    PersonIcon,
    PhoneIcon,
    PinIcon,
} from '@navikt/aksel-icons';
import { Link } from 'react-router-dom';

type Props = {
    fnr: string;
};

const Kandidatbanner = ({ fnr }: Props) => {
    const { kandidat } = useKandidat(fnr);

    const kandidaterLenke = (
        <Link className={css.lenkeTilStilling} to={`/kandidatsok`}>
            Kandidater
        </Link>
    );

    const kandidatLenke = (
        <Link
            className={css.lenkeTilStilling}
            to={`/kandidater/kandidat/${kandidat?.arenaKandidatnr}/cv`}
        >
            {kandidat?.fornavn} {kandidat?.etternavn}
        </Link>
    );

    const stillingslenke = (
        <Link className={css.lenkeTilStilling} to={`stillingssok`}>
            Finn stilling
        </Link>
    );

    return (
        <div className={css.banner}>
            <div className={css.innerBanner}>
                <PersonIcon fontSize="3rem" />
                <div className={css.personinformasjon}>
                    <div>
                        {kandidaterLenke} / {kandidatLenke} / {stillingslenke}
                    </div>
                    <Heading size="medium" as="span">
                        {kandidat?.fornavn} {kandidat?.etternavn}
                    </Heading>
                    <div className={css.detaljer}>
                        <div>
                            <ChangingRoomIcon /> {kandidat?.fodselsdato}
                        </div>
                        <div>
                            <PinIcon /> {kandidat?.adresselinje1} {kandidat?.postnummer}{' '}
                            {kandidat?.poststed}
                        </div>
                        <div>
                            <EnvelopeClosedIcon />
                            {kandidat?.epostadresse}
                        </div>
                        <div>
                            <PhoneIcon />
                            {kandidat?.telefon}
                        </div>
                        <div>
                            <PersonIcon />
                            {kandidat?.veileder} (Veileder)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kandidatbanner;
