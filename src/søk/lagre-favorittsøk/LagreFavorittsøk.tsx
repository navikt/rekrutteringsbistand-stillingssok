import React, { FunctionComponent, useEffect, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { useLocation } from 'react-router-dom';

const LagreFavorittsøk: FunctionComponent = () => {
    const { search } = useLocation();
    const [favorittsøk, setFavorittsøk] = useState<string | null>(
        localStorage.getItem(favorittsøkLocalstorageKey)
    );
    const [favorittsøkErAktivt, setFavorittsøkErAktivt] = useState<boolean>(favorittsøk === search);

    useEffect(() => {
        setFavorittsøkErAktivt(favorittsøk === search);
    }, [search, favorittsøk]);

    useEffect(() => {
        const listener = () => {
            setFavorittsøk(localStorage.getItem(favorittsøkLocalstorageKey));
            console.log('setter favorittsøk', localStorage.getItem(favorittsøkLocalstorageKey));
        };
        window.addEventListener('storage', listener);
        return () => {
            window.removeEventListener('storage', listener);
        };
    });

    const onLagreSomFavorittsøkClick = () => {
        localStorage.setItem(favorittsøkLocalstorageKey, search);
    };

    return favorittsøkErAktivt ? (
        <div>bruker favorittsøk</div>
    ) : (
        <Knapp onClick={onLagreSomFavorittsøkClick}>Lagre som favorittsøk</Knapp>
    );
};

export const favorittsøkLocalstorageKey = 'favorittsok';

export default LagreFavorittsøk;
