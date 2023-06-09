import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import useKandidat from './useKandidat';
import css from './Kandidatbanner.module.css';

type Props = {
    fnr: string;
};

const Kandidatbanner = ({ fnr }: Props) => {
    const { kandidat } = useKandidat(fnr);

    return (
        <div className={css.banner}>
            <div className={css.innerBanner}>
                <h2>
                    <BodyShort>Finn stillinger til kandidat:</BodyShort>
                    <Heading size="medium" as="span">
                        {kandidat?.fornavn} {kandidat?.etternavn}
                    </Heading>
                </h2>
            </div>
        </div>
    );
};

export default Kandidatbanner;
