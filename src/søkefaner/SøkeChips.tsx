import React, { FunctionComponent, useState } from 'react';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../utils/urlUtils';
import useNavigering from '../useNavigering';
import { Chips } from '@navikt/ds-react';

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
        console.log('Aktive delsøk:', aktiveDelsøk);

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

    return (
        <Chips>
            {hentSøkekriterier(searchParams).tekst.size > 0 &&
                Object.values(Delsøk).map((delsøk) => {
                    const aggregering = aggregeringer && aggregeringer[delsøk];
                    return (
                        <Chips.Toggle
                            selected={aktiveDelsøk.has(delsøk)}
                            checkmark={false}
                            key={delsøk}
                            onClick={() => {
                                changeAktivtDelsøk(delsøk);
                            }}
                        >
                            {`${delsøk} (${aggregering?.doc_count})`}
                        </Chips.Toggle>
                    );
                })}
        </Chips>
    );
};

export default SøkeChips;
