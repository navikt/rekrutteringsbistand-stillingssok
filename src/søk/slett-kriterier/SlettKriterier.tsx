import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import { Link, useLocation } from 'react-router-dom';
import './SlettKriterier.less';
import { Navigeringsstate } from '../../utils/urlUtils';

const SlettKriterier: FunctionComponent = () => {
    const { pathname } = useLocation<Navigeringsstate>();

    return (
        <Link
            to={{
                pathname,
                search: '',
                state: {
                    harSlettetKriterier: true,
                },
            }}
            className="slett-kriterier lenke"
        >
            <Element>Slett alle kriterier</Element>
        </Link>
    );
};

export default SlettKriterier;
