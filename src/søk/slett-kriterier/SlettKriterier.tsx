import { Label } from '@navikt/ds-react';
import React, { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigeringsstate } from '../../utils/urlUtils';
import './SlettKriterier.less';

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
            className="slett-kriterier navds-link"
        >
            <Label>Slett alle kriterier</Label>
        </Link>
    );
};

export default SlettKriterier;
