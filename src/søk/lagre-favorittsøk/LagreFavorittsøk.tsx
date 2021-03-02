import React, { FunctionComponent } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { useLocation } from 'react-router-dom';

const LagreFavorittsøk: FunctionComponent = () => {
    const { search } = useLocation();

    const onLagreSomFavorittsøkClick = () => {
        localStorage.setItem(favorittsøkLocalstorageKey, search);
    };

    return <Knapp onClick={onLagreSomFavorittsøkClick}>Lagre som favorittsøk</Knapp>;
};

export const favorittsøkLocalstorageKey = 'favorittsok';

export default LagreFavorittsøk;
