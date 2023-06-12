import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Stillingssøk from './Stillingssøk';
import { StandardsøkProvider } from './standardsøk/StandardsøkContext';

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
