import React, { FunctionComponent, useEffect, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { useLocation } from 'react-router-dom';

const LagreFavorittsøk: FunctionComponent = () => {
    const { search } = useLocation();
    const [favorittsøkErAktivt, setFavorittsøkErAktivt] = useState<boolean>(
        erFavorittsøkAktivt(search)
    );

    useEffect(() => {
        setFavorittsøkErAktivt(erFavorittsøkAktivt(search));
    }, [search]);

    const onLagreSomFavorittsøkClick = () => {
        localStorage.setItem(favorittsøkLocalstorageKey, search);
        setFavorittsøkErAktivt(erFavorittsøkAktivt(search));
    };

    return favorittsøkErAktivt ? (
        <div>bruker favorittsøk</div>
    ) : (
        <Knapp onClick={onLagreSomFavorittsøkClick}>Lagre som favorittsøk</Knapp>
    );
};

export const favorittsøkLocalstorageKey = 'favorittsok';

const erFavorittsøkAktivt = (search: string) => {
    const favorittsøk = localStorage.getItem(favorittsøkLocalstorageKey);
    return favorittsøk === search;
};

export default LagreFavorittsøk;
