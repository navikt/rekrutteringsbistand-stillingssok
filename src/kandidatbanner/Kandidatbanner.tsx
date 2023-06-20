import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import useKandidat from './useKandidat';
import css from './Kandidatbanner.module.css';
import {
    CandleIcon,
    EnvelopeClosedIcon,
    PersonIcon,
    PhoneIcon,
    PinIcon,
} from '@navikt/aksel-icons';
import { ReactComponent as Minekandidater } from './minekandidater.svg';
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

    const lagFødselsdagtekst = (inputdato?: string | null) => {
        if (!inputdato) return '-';

        const iDag = new Date();

        const fødselsdag = new Date(inputdato);

        const harIkkeFyltÅrIÅr =
            iDag.getUTCMonth() < fødselsdag.getUTCMonth() ||
            (iDag.getUTCMonth() === fødselsdag.getUTCMonth() &&
                iDag.getUTCDate() < fødselsdag.getUTCDate());

        const fødselsdagString = fødselsdag.toLocaleDateString('nb-NO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

        const alder =
            iDag.getUTCFullYear() - fødselsdag.getUTCFullYear() - (harIkkeFyltÅrIÅr ? 1 : 0);

        return `Født: ${fødselsdagString} (${alder} år)`;
    };

    const formaterAdresse = (input: string | null): string | null => {
        return !input ? null : input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    };

    return (
        <div className={css.banner}>
            <div className={css.innerBanner}>
                <Minekandidater className={css.minekandidatericon} />
                <div className={css.personinformasjon}>
                    <div>
                        {kandidaterLenke} / {kandidatLenke} / Finn stilling
                    </div>
                    <Heading size="large" as="span">
                        {kandidat?.fornavn} {kandidat?.etternavn}
                    </Heading>
                    <div className={css.detaljer}>
                        <BodyShort>
                            <CandleIcon /> {lagFødselsdagtekst(kandidat?.fodselsdato)}
                        </BodyShort>

                        {kandidat?.poststed || kandidat?.postnummer || kandidat?.adresselinje1 ? (
                            <BodyShort>
                                <PinIcon />{' '}
                                <span>{formaterAdresse(kandidat?.adresselinje1)}, </span>
                                {kandidat?.postnummer} {formaterAdresse(kandidat?.poststed)}
                            </BodyShort>
                        ) : (
                            '-'
                        )}

                        <BodyShort>
                            <EnvelopeClosedIcon />
                            {kandidat?.epostadresse?.toLowerCase() ?? '-'}
                        </BodyShort>

                        <BodyShort>
                            <PhoneIcon />
                            {kandidat?.telefon ?? '-'}
                        </BodyShort>

                        <BodyShort>
                            <PersonIcon />
                            {kandidat?.veileder
                                ? kandidat?.veileder?.toUpperCase() + ' (Veileder)'
                                : '-'}
                        </BodyShort>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kandidatbanner;
