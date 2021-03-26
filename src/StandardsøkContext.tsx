import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { hentStandardsøk } from './api/api';
import { erIkkeProd } from './utils/featureToggleUtils';

type StandardsøkNettressurs =
    | {
          harHentetStandardsøk: false;
      }
    | {
          harHentetStandardsøk: true;
          standardsøk: string | null;
      };

const StandardsøkContext = createContext<{
    standardsøk: StandardsøkNettressurs;
    setStandardsøk: (standardsøk: string) => void;
}>({
    standardsøk: {
        harHentetStandardsøk: false,
    },
    setStandardsøk: () => {},
});

export const StandardsøkProvider: FunctionComponent = (props) => {
    const [standardsøkState, setStandardsøkState] = useState<StandardsøkNettressurs>({
        harHentetStandardsøk: false,
    });

    useEffect(() => {
        const hent = async () => {
            const standardsøk = await hentStandardsøk();
            setStandardsøkState({
                harHentetStandardsøk: true,
                standardsøk: standardsøk.søk,
            });
        };

        if (erIkkeProd) {
            hent();
        }
    }, []);

    const setStandardsøk = (standardsøk: string) => {
        // TODO: PUT standardsøk til backend
        setStandardsøkState({
            harHentetStandardsøk: true,
            standardsøk,
        });
    };

    const context = {
        standardsøk: standardsøkState,
        setStandardsøk,
    };

    return (
        <StandardsøkContext.Provider value={context}>{props.children}</StandardsøkContext.Provider>
    );
};

const useStandardsøk = () => useContext(StandardsøkContext);

export default useStandardsøk;
