import React, { FunctionComponent } from 'react';
import { Chips } from '@navikt/ds-react';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../utils/urlUtils';
import useNavigering from '../useNavigering';

export enum Søkefelt {
    Arbeidsgiver = 'arbeidsgiver',
    Tittel = 'tittel',
    Annonsetekst = 'annonsetekst',
    Annonsenummer = 'annonsenummer',
}

type Props = {
    aggregeringer?: Partial<Record<Søkefelt, { doc_count: number }>>;
};

const Søkefelter: FunctionComponent<Props> = ({ aggregeringer }) => {
    const { searchParams, navigate } = useNavigering();
    const aktiveFelter = hentSøkekriterier(searchParams).felter;

    const handleSøkefeltClick = (felt: Søkefelt) => {
        const oppdaterteFelter = new Set(aktiveFelter);

        if (oppdaterteFelter.has(felt)) {
            oppdaterteFelter.delete(felt);
        } else {
            oppdaterteFelter.add(felt);
        }

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Felter,
            verdi: Array.from(oppdaterteFelter),
        });
    };

    if (hentSøkekriterier(searchParams).tekst.size === 0 || aggregeringer === undefined) {
        return null;
    }

    const felterMedTreff = Object.values(Søkefelt).filter((felt) => {
        const antallTreff = aggregeringer[felt]?.doc_count ?? 0;

        return antallTreff > 0;
    });

    return (
        <Chips>
            {felterMedTreff.map((felt) => {
                const aggregering = aggregeringer[felt];

                return (
                    <Chips.Toggle
                        key={felt}
                        selected={aktiveFelter.has(felt)}
                        checkmark={false}
                        onClick={() => {
                            handleSøkefeltClick(felt);
                        }}
                    >
                        {`${tilVisningsnavn(felt)} (${aggregering?.doc_count})`}
                    </Chips.Toggle>
                );
            })}
        </Chips>
    );
};

const tilVisningsnavn = (felt: Søkefelt) => {
    switch (felt) {
        case Søkefelt.Annonsetekst:
            return 'Innhold';
        case Søkefelt.Tittel:
            return 'Tittel';
        case Søkefelt.Arbeidsgiver:
            return 'Arbeidsgiver';
        case Søkefelt.Annonsenummer:
            return 'Annonsenummer';
    }
};

export default Søkefelter;
