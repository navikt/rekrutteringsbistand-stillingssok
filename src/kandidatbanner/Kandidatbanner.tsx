import React from 'react';
import { Heading } from '@navikt/ds-react';
import useKandidat from './useKandidat';
import css from './Kandidatbanner.module.css';
import {
    CandleIcon,
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
            to={`/kandidater/kandidat/${kandidat?.arenaKandidatnr}/cv?fraKandidatsok=true`}
        >
            {kandidat?.fornavn} {kandidat?.etternavn}
        </Link>
    );

    const stillingslenke = (
        <Link className={css.lenkeTilStilling} to={`stillingssok`}>
            Finn stilling
        </Link>
    );

    const datoparsing = (inputdato: string) => {
        if (inputdato == null) return null;

        var fødselsdag = new Date(inputdato);
        var iDag = new Date();

        var månedNavn = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mai',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Des',
        ];

        const fødselsdagDag = fødselsdag.getUTCDate();
        const fødselsdagMåned = fødselsdag.getUTCMonth();
        const fødselsdagÅr = fødselsdag.getUTCFullYear();

        const iDagDag = iDag.getUTCDate();
        const iDagMåned = iDag.getUTCMonth();
        const iDagÅr = iDag.getUTCFullYear();

        const harIkkeFylltÅrIÅr =
            iDagMåned < fødselsdagMåned ||
            (iDagMåned === fødselsdagMåned && iDagDag < fødselsdagDag);

        const alder = iDagÅr - fødselsdagÅr - (harIkkeFylltÅrIÅr ? -1 : 0);

        return `Født: ${fødselsdagDag}. ${månedNavn[fødselsdagMåned]} ${fødselsdagÅr} (${alder} år)`;
    };

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
                        {kandidat?.fodselsdato && (
                            <div>
                                <CandleIcon /> {datoparsing(kandidat?.fodselsdato)}
                            </div>
                        )}
                        {(kandidat?.poststed ||
                            kandidat?.postnummer ||
                            kandidat?.adresselinje1) && (
                            <div>
                                <PinIcon /> {kandidat?.adresselinje1} {kandidat?.postnummer}{' '}
                                {kandidat?.poststed}
                            </div>
                        )}
                        {kandidat?.epostadresse && (
                            <div>
                                <EnvelopeClosedIcon />
                                {kandidat?.epostadresse}
                            </div>
                        )}
                        {kandidat?.telefon && (
                            <div>
                                <PhoneIcon />
                                {kandidat?.telefon}
                            </div>
                        )}
                        {kandidat?.veileder && (
                            <div>
                                <PersonIcon />
                                {kandidat?.veileder} (Veileder)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kandidatbanner;
