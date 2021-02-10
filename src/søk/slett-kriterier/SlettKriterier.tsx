import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import './SlettKriterier.less';

const SlettKriterier: FunctionComponent = () => (
    <Link to="/stillingssok" className="slett-kriterier lenke">
        <Element>Slett kriterier</Element>
    </Link>
);

export default SlettKriterier;
