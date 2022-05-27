import { Label } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigeringsstate } from '../../utils/urlUtils';
import css from './SlettKriterier.module.css';

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
            className={classNames(css.slettKriterier, 'navds-link')}
        >
            <Label>Slett alle kriterier</Label>
        </Link>
    );
};

export default SlettKriterier;
