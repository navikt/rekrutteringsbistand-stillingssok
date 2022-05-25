import React, { FunctionComponent, useEffect, useState } from 'react';
import { Heading } from '@navikt/ds-react';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { cssScopeForApp } from '../index';
import App from '../App';
import './Utviklingsapp.less';

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
        <div className={cssScopeForApp}>
            <Router history={history}>
                <header className="utviklingsapp">
                    <Heading size="medium" level="1">
                        Utviklingsapp for rekrutteringsbistand-stillingssok
                    </Heading>
                    <Link
                        className="lenke"
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
        </div>
    );
};

export default Utviklingsapp;
