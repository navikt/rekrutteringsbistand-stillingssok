import React from 'react';
import Kandidatbanner from '../kandidatbanner/Kandidatbanner';
import useKandidat from './useKandidat';

type Props = {
    fnr: string;
};

const KontekstAvKandidat = ({ fnr }: Props) => {
    const { kandidat } = useKandidat(fnr);

    return (
        <Kandidatbanner
            kandidat={kandidat}
            brødsmulesti={[
                {
                    href: '/kandidatsok',
                    tekst: 'Kandidater',
                },
                {
                    href: `/kandidater/kandidat/${kandidat?.arenaKandidatnr}/cv?fraKandidatsok=true`,
                    tekst: `${kandidat?.fornavn} ${kandidat?.etternavn}`,
                },
                {
                    tekst: 'Finn stilling',
                },
            ]}
        />
    );
};

export default KontekstAvKandidat;
