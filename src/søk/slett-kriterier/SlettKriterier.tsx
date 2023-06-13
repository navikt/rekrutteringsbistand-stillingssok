import React, { FunctionComponent } from 'react';
import { Chips } from '@navikt/ds-react';
import { useLocation, useNavigate } from 'react-router-dom';

const SlettKriterier: FunctionComponent = () => {
    const { pathname, search } = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(
            {
                pathname,
                search: '',
            },
            {
                state: {
                    harSlettetKriterier: true,
                },
            }
        );
    };

    if (search === '') {
        return null;
    }

    return <Chips.Removable onClick={handleClick}>Tøm alle filtre</Chips.Removable>;
};

export default SlettKriterier;
