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

    const lagFødselsdagtekst = (inputdato: string) => {
        if (inputdato == null) return '-';
        var fødselsdag = new Date(inputdato);

        var iDag = new Date();

        const harIkkeFylltÅrIÅr =
            iDag.getUTCMonth() < fødselsdag.getUTCMonth() ||
            (iDag.getUTCMonth() === fødselsdag.getUTCMonth() &&
                iDag.getUTCDate() < fødselsdag.getUTCDate());

        const fødselsdagString = fødselsdag.toLocaleDateString('nb-NO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

        const alder =
            iDag.getUTCFullYear() - fødselsdag.getUTCFullYear() - (harIkkeFylltÅrIÅr ? 1 : 0);

        return `Født: ${fødselsdagString} (${alder} år)`;
    };

    const formaterAdresse = (input: string | null): string | null => {
        return !input ? null : input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
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
                        {
                            <div>
                                <CandleIcon /> {lagFødselsdagtekst(kandidat?.fodselsdato)}
                            </div>
                        }
                        {(kandidat?.poststed ||
                            kandidat?.postnummer ||
                            kandidat?.adresselinje1) && (
                            <div>
                                <PinIcon /> {formaterAdresse(kandidat?.adresselinje1)}{' '}
                                {kandidat?.postnummer} {formaterAdresse(kandidat?.poststed)}
                            </div>
                        )}
                        {
                            <div>
                                <EnvelopeClosedIcon />
                                {kandidat?.epostadresse
                                    ? kandidat?.epostadresse.toLowerCase()
                                    : '-'}
                            </div>
                        }
                        {
                            <div>
                                <PhoneIcon />
                                {kandidat?.telefon ? kandidat?.telefon : '-'}
                            </div>
                        }
                        {
                            <div>
                                <PersonIcon />
                                {kandidat?.veileder
                                    ? kandidat?.veileder?.toUpperCase() + '(Veileder)'
                                    : '-'}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kandidatbanner;
