import React, { FunctionComponent } from 'react';
import './App.less';

export type AppProps = {
    navKontor: string | null;
};

const App: FunctionComponent<AppProps> = ({ navKontor }) => {
    return (
        <div className="app">
            rekbis-stillingssok
        </div>
    );
};

export default App;
