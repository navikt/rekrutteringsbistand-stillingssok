import React, { FunctionComponent, useEffect, useState } from 'react';
import { Heading } from '@navikt/ds-react';
import { Link, Route, Routes } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import App from '../App';
import css from './Utviklingsapp.module.css';
import CustomRouter from './CustomRouter';

const history = createBrowserHistory();

const Utviklingsapp: FunctionComponent = () => {
    const [navKontor, setNavKontor] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setNavKontor('0239');
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    });

    return (
        <CustomRouter history={history}>
            <header className={css.utviklingsapp}>
                <Heading size="medium" level="1">
                    Utviklingsapp for rekrutteringsbistand-stillingssok
                </Heading>
                <Link
                    className="navds-link"
                    to={{
                        pathname: '/stillingssok',
                        search: '?standardsok',
                    }}
                >
                    Stillingssøk
                </Link>
            </header>
            <App />
            <Routes>
                <Route path="/stillinger/*" element={<>Side for stilling</>} />
            </Routes>
        </CustomRouter>
    );
};

export default Utviklingsapp;
