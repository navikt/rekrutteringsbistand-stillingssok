import React, { FunctionComponent } from 'react';
import Søkefelt from './søkefelt/Søkefelt';
import FylkerOgKommuner from './geografi/FylkerOgKommuner';
import OmAnnonsen from './om-annonsen/OmAnnonsen';
import Inkludering from './inkludering/Inkludering';
import SlettKriterier from './slett-kriterier/SlettKriterier';
import LagreStandardsøk from './standardsøk/LagreStandardsøk';
import BrukStandardsøk from './standardsøk/BrukStandardsøk';
import css from './Søk.module.css';

type Props = {
    visStandardsøk: boolean;
};

const Søk = ({ visStandardsøk }: Props) => {
    return (
        <div className={css.søk}>
            <div className={css.lenkerOverSøk}>
                {visStandardsøk && <BrukStandardsøk />}
                <SlettKriterier />
            </div>
            {visStandardsøk && <LagreStandardsøk />}
            <Søkefelt />
            <OmAnnonsen />
            <FylkerOgKommuner />
            <Inkludering />
        </div>
    );
};

export default Søk;
