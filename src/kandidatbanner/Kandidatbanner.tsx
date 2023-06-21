import React, { Fragment } from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import { Kandidatrespons } from './useKandidat';
import {
    CandleIcon,
    EnvelopeClosedIcon,
    PersonIcon,
    PhoneIcon,
    PinIcon,
} from '@navikt/aksel-icons';
import { ReactComponent as Minekandidater } from './minekandidater.svg';
import css from './Kandidatbanner.module.css';

type Brødsmule = {
    tekst: string;
    href?: string;
};

type Props = {
    kandidat?: Kandidatrespons;
    brødsmulesti: Array<Brødsmule>;
};

const Kandidatbanner = ({ kandidat, brødsmulesti }: Props) => {
    return (
        <div className={css.banner}>
            <div className={css.innerBanner}>
                <Minekandidater className={css.minekandidatericon} />
                <div className={css.personinformasjon}>
                    <div>
                        {brødsmulesti.map(({ tekst, href }, index) => {
                            const brødsmule = href ? (
                                <Link className={css.lenkeTilStilling} to={href}>
                                    {tekst}
                                </Link>
                            ) : (
                                <BodyShort as="span">{tekst}</BodyShort>
                            );

                            return (
                                <Fragment key={tekst}>
                                    {index !== 0 && <span> / </span>}
                                    {brødsmule}
                                </Fragment>
                            );
                        })}
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

    const alder = iDag.getUTCFullYear() - fødselsdag.getUTCFullYear() - (harIkkeFyltÅrIÅr ? 1 : 0);

    return `Født: ${fødselsdagString} (${alder} år)`;
};

const formaterAdresse = (input: string | null): string | null => {
    return !input ? null : input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

export default Kandidatbanner;
