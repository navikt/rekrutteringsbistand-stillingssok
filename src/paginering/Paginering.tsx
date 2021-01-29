import React, { FunctionComponent, useState } from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import { useHistory } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import { byggUrlMedParam, hentSøkekriterier, QueryParam } from '../søk/søkefelt/urlUtils';
import { maksAntallTreffPerSøk } from '../api/queries';
import './Paginering.less';

type Props = {
    totaltAntallTreff: number;
};

const Paginering: FunctionComponent<Props> = ({ totaltAntallTreff }) => {
    const history = useHistory();
    const { search } = history.location;
    const [side, setSide] = useState<number>(hentSøkekriterier(search).side);

    const onPageChange = (valgtSide: number) => {
        setSide(valgtSide);

        const url = byggUrlMedParam(QueryParam.Side, valgtSide === 1 ? null : valgtSide);
        history.replace({ search: url.search });
    };

    return (
        <ReactPaginate
            forcePage={side - 1}
            pageCount={regnUtAntallSider(totaltAntallTreff, maksAntallTreffPerSøk)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => onPageChange(selected + 1)}
            containerClassName="paginering typo-element"
            pageClassName="paginering__side"
            activeClassName="paginering__side--aktiv"
            pageLinkClassName="paginering__side-lenke"
            activeLinkClassName="paginering__side-lenke--aktiv"
            nextLabel={<HoyreChevron />}
            previousLabel={<VenstreChevron />}
        />
    );
};

const regnUtAntallSider = (totaltAntallTreff: number, maksAntallTreffPerSøk: number) =>
    Math.ceil(totaltAntallTreff / maksAntallTreffPerSøk);

export default Paginering;
