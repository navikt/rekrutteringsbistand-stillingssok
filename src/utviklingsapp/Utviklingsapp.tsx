import React, { FunctionComponent, useEffect, useState } from 'react';
import { Heading } from '@navikt/ds-react';
import { Link, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import App from '../App';
import Router from '../Router';
import css from './Utviklingsapp.module.css';

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
        <Router history={history}>
            <header className={css.utviklingsapp}>
                <Heading size="medium" level="1">
                    Utviklingsapp for rekrutteringsbistand-stillingssok
                </Heading>
                <Link
                    className="navds-link"
                    to={{
                        search: '?standardsok',
                    }}
                >
                    Stillingssøk
                </Link>
            </header>
            <Switch>
                <Route path="/stillinger/stilling">Side for stilling</Route>
                <Route>
                    <main>
                        <App navKontor={navKontor} history={history} />
                    </main>
                </Route>
            </Switch>
        </Router>
    );
};

export default Utviklingsapp;
