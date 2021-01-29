import React, { FunctionComponent } from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import ReactPaginate from 'react-paginate';

import { maksAntallTreffPerSøk } from '../api/queries';
import './Paginering.less';

type Props = {
    side: number;
    onSideChange: (side: number) => void;
    totaltAntallTreff: number;
};

const Paginering: FunctionComponent<Props> = ({ side, onSideChange, totaltAntallTreff }) => {
    return (
        <ReactPaginate
            forcePage={side - 1}
            pageCount={regnUtAntallSider(totaltAntallTreff, maksAntallTreffPerSøk)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => onSideChange(selected + 1)}
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
