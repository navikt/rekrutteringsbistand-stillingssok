import React, { FunctionComponent } from 'react';
import { Tab } from '@reach/tabs';
import { Fane } from './Søkefaner';

type Props = {
    fane: Fane;
    antallTreff?: number;
};

const Søkefane: FunctionComponent<Props> = ({ fane, antallTreff }) => {
    return (
        <Tab className="søkefaner__fane" key={fane}>
            {visningsnavn(fane)} {antallTreff !== undefined ? `(${antallTreff})` : ''}
        </Tab>
    );
};

const visningsnavn = (fane: Fane): string => {
    switch (fane) {
        case Fane.Alle:
            return 'Alle';
        case Fane.Arbeidsgiver:
            return 'Arbeidsgiver';
        case Fane.Annonsetittel:
            return 'Annonsetittel';
        case Fane.Annonsetekst:
            return 'Annonsetekst';
    }
};

export default Søkefane;
