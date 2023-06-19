import React, { FunctionComponent } from 'react';
import { Chips } from '@navikt/ds-react';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../utils/urlUtils';
import useNavigering from '../useNavigering';

export enum Delsøk {
    Arbeidsgiver = 'arbeidsgiver',
    Annonsetittel = 'annonsetittel',
    Annonsetekst = 'annonsetekst',
}

type Props = {
    aggregeringer?: Partial<Record<Delsøk, { doc_count: number }>>;
};

const SøkeChips: FunctionComponent<Props> = ({ aggregeringer }) => {
    const { searchParams, navigate } = useNavigering();
    const aktiveDelsøk = hentSøkekriterier(searchParams).delsøk;

    const changeAktivtDelsøk = (delsøk: Delsøk) => {
        const nyeDelsøk = new Set(aktiveDelsøk);

        if (nyeDelsøk.has(delsøk)) {
            nyeDelsøk.delete(delsøk);
        } else {
            nyeDelsøk.add(delsøk);
        }

        oppdaterUrlMedParam({
            searchParams,
            navigate,
            parameter: QueryParam.Delsøk,
            verdi: Array.from(nyeDelsøk),
        });
    };

    if (hentSøkekriterier(searchParams).tekst.size === 0 || aggregeringer === undefined) {
        return null;
    }

    const felterMedTreff = Object.values(Delsøk).filter((felt) => {
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
                        selected={aktiveDelsøk.has(felt)}
                        checkmark={false}
                        onClick={() => {
                            changeAktivtDelsøk(felt);
                        }}
                    >
                        {`${felt} (${aggregering?.doc_count})`}
                    </Chips.Toggle>
                );
            })}
        </Chips>
    );
};

export default SøkeChips;
