import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { hentStandardsøk, oppdaterStandardsøk as oppdaterStandardsøkMedApi } from './api/api';

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
    oppdaterStandardsøk: (standardsøk: string) => Promise<void>;
}>({
    standardsøk: {
        harHentetStandardsøk: false,
    },
    oppdaterStandardsøk: () => Promise.resolve(),
});

export const StandardsøkProvider: FunctionComponent = (props) => {
    const [standardsøk, setStandardsøk] = useState<StandardsøkNettressurs>({
        harHentetStandardsøk: false,
    });

    useEffect(() => {
        const hent = async () => {
            try {
                const standardsøk = await hentStandardsøk();

                setStandardsøk({
                    harHentetStandardsøk: true,
                    standardsøk: standardsøk.søk,
                    lagrerSomStandardsøk: false,
                });
            } catch (e) {
                setStandardsøk({
                    harHentetStandardsøk: true,
                    standardsøk: null,
                    lagrerSomStandardsøk: false,
                });
            }
        };

        hent();
    }, []);

    const oppdaterStandardsøk = async (nyttStandardsøk: string): Promise<void> => {
        const stateUnderOppdatering = {
            harHentetStandardsøk: false,
            standardsøk: standardsøk.harHentetStandardsøk ? standardsøk.standardsøk : null,
            lagrerSomStandardsøk: true,
        };

        setStandardsøk(stateUnderOppdatering);
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
