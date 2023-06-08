import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Stillingssøk from './Stillingssøk';
import { StandardsøkProvider } from './standardsøk/StandardsøkContext';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/:fnr" element={<Stillingssøk />} />
            <Route path="/" element={<Stillingssøk />} />
        </Routes>
    );
};

const App = (props: any) => (
    <StandardsøkProvider>
        <AppRoutes {...props} />
    </StandardsøkProvider>
);

export default App;
