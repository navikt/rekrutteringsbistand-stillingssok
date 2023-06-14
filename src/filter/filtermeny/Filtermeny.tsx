import React from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';

import { QueryParam } from '../../utils/urlUtils';
import ValgteKrierier from '../valgte-kriterier/ValgteKriterier';
import LagreStandardsøk from '../standardsøk/LagreStandardsøk';
import css from './Filtermeny.module.css';

type Props = {
    fnr?: string;
};

const Filtermeny = ({ fnr }: Props) => {
    const [searchParams] = useSearchParams();

    const keys = Array.from(searchParams.keys());
    const harIngenFiltre = keys.length === 0;
    const harKunSortering = keys.length === 1 && searchParams.has(QueryParam.Sortering);

    if (harIngenFiltre || harKunSortering) {
        return <div className={css.wrapper} />;
    }

    return (
        <div className={classNames(css.wrapper, css.filtermeny)}>
            <ValgteKrierier />
            {!fnr && <LagreStandardsøk />}
        </div>
    );
};

export default Filtermeny;
