import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { hentStandardsøk, oppdaterStandardsøk as oppdaterStandardsøkMedApi } from './api/api';
import { erIkkeProd } from './utils/featureToggleUtils';

type StandardsøkNettressurs =
    | {
          harHentetStandardsøk: false;
      }
    | {
          harHentetStandardsøk: true;
          standardsøk: string | null;
          lagrerSomStandardsøk: boolean;
      };

const StandardsøkContext = createContext<{
    standardsøk: StandardsøkNettressurs;
    oppdaterStandardsøk: (standardsøk: string) => void;
}>({
    standardsøk: {
        harHentetStandardsøk: false,
    },
    oppdaterStandardsøk: () => {},
});

export const StandardsøkProvider: FunctionComponent = (props) => {
    const [standardsøk, setStandardsøk] = useState<StandardsøkNettressurs>({
        harHentetStandardsøk: false,
    });

    useEffect(() => {
        const hent = async () => {
            const standardsøk = await hentStandardsøk();
            setStandardsøk({
                harHentetStandardsøk: true,
                standardsøk: standardsøk.søk,
                lagrerSomStandardsøk: false,
            });
        };

        if (erIkkeProd) {
            hent();
        }
    }, []);

    const oppdaterStandardsøk = async (nyttStandardsøk: string) => {
        console.log('OPPDATERER');
        setStandardsøk({
            harHentetStandardsøk: true,
            standardsøk: standardsøk.harHentetStandardsøk ? standardsøk.standardsøk : null,
            lagrerSomStandardsøk: true,
        });

        // TODO: PUT standardsøk til backend
        const standardsøkRespons = await oppdaterStandardsøkMedApi(nyttStandardsøk);

        setStandardsøk({
            harHentetStandardsøk: true,
            standardsøk: standardsøkRespons.søk,
            lagrerSomStandardsøk: false,
        });
    };

    const context = {
        standardsøk,
        oppdaterStandardsøk,
    };

    return (
        <StandardsøkContext.Provider value={context}>{props.children}</StandardsøkContext.Provider>
    );
};

const useStandardsøk = () => useContext(StandardsøkContext);

export default useStandardsøk;
