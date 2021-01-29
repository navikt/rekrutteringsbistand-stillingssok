import React, { FunctionComponent, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useHistory } from 'react-router-dom';
import { maksAntallTreffPerSøk } from '../api/queries';
import { byggUrlMedParam, hentSøkekriterier, QueryParam } from '../søk/søkefelt/urlUtils';
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
            activeClassName="paginering__aktiv-side"
        />
    );
};

const regnUtAntallSider = (totaltAntallTreff: number, maksAntallTreffPerSøk: number) =>
    Math.ceil(totaltAntallTreff / maksAntallTreffPerSøk);

export default Paginering;
