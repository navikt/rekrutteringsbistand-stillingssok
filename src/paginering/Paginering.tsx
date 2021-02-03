import React, { FunctionComponent, useEffect, useState } from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import ReactPaginate from 'react-paginate';

import { maksAntallTreffPerSøk } from '../api/queries';
import { hentSøkekriterier, QueryParam } from '../søk/søkefelt/urlUtils';
import { useHistory } from 'react-router-dom';
import { SøkProps } from '../søk/Søk';
import { Enhetstype, useEnhetstype } from '../utils/skjermUtils';
import './Paginering.less';

type Props = SøkProps & {
    totaltAntallTreff: number;
};

const Paginering: FunctionComponent<Props> = ({ oppdaterSøk, totaltAntallTreff }) => {
    const history = useHistory();
    const { search } = history.location;
    const [side, setSide] = useState<number>(hentSøkekriterier(search).side);
    const enhetstype = useEnhetstype();

    useEffect(() => {
        const sidetall = hentSøkekriterier(search).side;
        setSide(sidetall);
    }, [search]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, [side]);

    const onPageChange = (valgtSide: number) => {
        setSide(valgtSide);
        oppdaterSøk(QueryParam.Side, valgtSide === 1 ? null : valgtSide);
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

const regnUtAntallSider = (totaltAntallTreff: number, maksAntallTreffPerSøk: number) =>
    Math.ceil(totaltAntallTreff / maksAntallTreffPerSøk);

export default Paginering;
