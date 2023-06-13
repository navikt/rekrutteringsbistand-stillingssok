import React, { FunctionComponent } from 'react';
import { Chips } from '@navikt/ds-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QueryParam } from '../../utils/urlUtils';

const SlettKriterier: FunctionComponent = () => {
    const { pathname, search } = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        const parametere = new URLSearchParams(search);
        for (const key of parametere.keys()) {
            if (key !== QueryParam.Sortering) {
                parametere.delete(key);
            }
        }

        navigate(
            {
                pathname,
                search: parametere.toString(),
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
