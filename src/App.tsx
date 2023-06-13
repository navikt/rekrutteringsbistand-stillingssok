import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { StandardsøkProvider } from './standardsøk/StandardsøkContext';
import Stillingssøk from './Stillingssøk';

const App = () => {
    return (
        <Routes>
            <Route path="/stillingssok/:fnr" element={<Stillingssøk />} />
            <Route
                path="/stillingssok/*"
                element={
                    <StandardsøkProvider>
                        <Stillingssøk />
                    </StandardsøkProvider>
                }
            />
        </Routes>
    );
};

export default App;
