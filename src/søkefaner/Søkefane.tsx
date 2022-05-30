import { Tabs } from '@navikt/ds-react';
import React, { FunctionComponent } from 'react';
import { Fane } from './Søkefaner';

type Props = {
    fane: Fane;
    antallTreff?: number;
};

const Søkefane: FunctionComponent<Props> = ({ fane, antallTreff }) => {
    return (
        <Tabs.Tab
            value={fane}
            label={`${visningsnavn(fane)} (${antallTreff?.toLocaleString('nb-NO') ?? 0})`}
        />
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
