import React, { FunctionComponent, useEffect, useState } from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import ReactPaginate from 'react-paginate';

import { maksAntallTreffPerSøk } from '../api/queries/queries';
import { oppdaterUrlMedParam, hentSøkekriterier, QueryParam } from '../utils/urlUtils';
import { useHistory } from 'react-router-dom';
import { Enhetstype, useEnhetstype } from '../utils/skjermUtils';
import './Paginering.less';

type Props = {
    totaltAntallTreff: number;
};

const Paginering: FunctionComponent<Props> = ({ totaltAntallTreff }) => {
    const history = useHistory();
    const { search } = history.location;
    const [side, setSide] = useState<number>(hentSøkekriterier(search).side);
    const [skalScrolleTilToppen, setSkalScrolleTilToppen] = useState<boolean>(false);
    const enhetstype = useEnhetstype();

    useEffect(() => {
        const sidetall = hentSøkekriterier(search).side;
        setSide(sidetall);
    }, [search]);

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
            history,
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
        <ReactPaginate
            forcePage={side - 1}
            pageCount={antallSider}
            pageRangeDisplayed={
                enhetstype === Enhetstype.Mobil ? 1 : enhetstype === Enhetstype.Tablet ? 3 : 5
            }
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => onPageChange(selected + 1)}
            containerClassName="paginering typo-element"
            pageClassName="paginering__side"
            breakClassName="paginering__side"
            breakLinkClassName="paginering__side-lenke paginering__side-lenke--break"
            activeClassName="paginering__side--aktiv"
            pageLinkClassName="paginering__side-lenke"
            activeLinkClassName="paginering__side-lenke--aktiv"
            nextLabel={<HoyreChevron />}
            previousLabel={<VenstreChevron />}
            nextLinkClassName="paginering__side-lenke"
            previousLinkClassName="paginering__side-lenke"
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
