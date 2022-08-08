import { Label } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import css from './SlettKriterier.module.css';

const SlettKriterier: FunctionComponent = () => {
    const { pathname } = useLocation();

    return (
        <Link
            to={{
                pathname,
                search: '',
            }}
            state={{
                harSlettetKriterier: true,
            }}
            className={classNames(css.slettKriterier, 'navds-link')}
        >
            <Label as="span">Slett alle kriterier</Label>
        </Link>
    );
};

export default SlettKriterier;
