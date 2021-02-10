import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import './SlettKriterier.less';

type Props = {
    slettKriterier: () => void;
};

const SlettKriterier: FunctionComponent<Props> = ({ slettKriterier }) => {
    return (
        <Link onClick={slettKriterier} to="/stillingssok" className="slett-kriterier lenke">
            <Element>Slett kriterier</Element>
        </Link>
    );
};

export default SlettKriterier;
