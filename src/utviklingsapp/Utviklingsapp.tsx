import React, { FunctionComponent, useEffect, useState } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { cssScopeForApp } from '../index';
import App from '../App';
import './Utviklingsapp.less';

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
            <header>
                <Systemtittel className="utviklingsapp">
                    Utviklingsapp for rekrutteringsbistand-stillingssok
                </Systemtittel>
            </header>
            <main>
                <App navKontor={navKontor} />
            </main>
        </div>
    );
};

export default Utviklingsapp;
