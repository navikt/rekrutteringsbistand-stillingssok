import React, { FunctionComponent, useEffect, useState } from 'react';
import { Pagination } from '@navikt/ds-react';

import { maksAntallTreffPerSøk } from '../api/queries/queries';
import { oppdaterUrlMedParam, hentSøkekriterier, QueryParam } from '../utils/urlUtils';
import { Enhetstype, useEnhetstype } from '../utils/skjermUtils';
import useNavigering from '../useNavigering';
import css from './Paginering.module.css';

type Props = {
    totaltAntallTreff: number;
};

const Paginering: FunctionComponent<Props> = ({ totaltAntallTreff }) => {
    const { searchParams, navigate } = useNavigering();

    const [side, setSide] = useState<number>(hentSøkekriterier(searchParams).side);
    const [skalScrolleTilToppen, setSkalScrolleTilToppen] = useState<boolean>(false);
    const enhetstype = useEnhetstype();

    useEffect(() => {
        const sidetall = hentSøkekriterier(searchParams).side;
        setSide(sidetall);
    }, [searchParams]);

    useEffect(() => {
        if (skalScrolleTilToppen) {
            window.scrollTo({
                top: 0,
            });
        }
    }, [side, skalScrolleTilToppen]);

    const onPageChange = (valgtSide: number) => {
        setSkalScrolleTilToppen(true);
        setSide(valgtSide);

        oppdaterUrlMedParam({
            navigate,
            searchParams,
            parameter: QueryParam.Side,
            verdi: valgtSide === 1 ? null : valgtSide,
            state: {
                harByttetSide: true,
            },
        });
    };

    const antallSider = regnUtAntallSider(totaltAntallTreff, maksAntallTreffPerSøk);

    if (antallSider <= 1) {
        return null;
    }

    return (
        <Pagination
            className={css.paginering}
            page={side}
            size={enhetstype === Enhetstype.Desktop ? 'medium' : 'small'}
            siblingCount={enhetstype === Enhetstype.Desktop ? 2 : 1}
            count={antallSider}
            onPageChange={(page) => onPageChange(page)}
        />
    );
};

const regnUtAntallSider = (totaltAntallTreff: number, maksAntallTreffPerSøk: number) => {
    const antallSider = Math.ceil(totaltAntallTreff / maksAntallTreffPerSøk);
    const maksAntallTreffStøttetAvES = 10000;
    const maksAntallSider = maksAntallTreffStøttetAvES / 40 - 1;

    return Math.min(antallSider, maksAntallSider);
};

export default Paginering;
