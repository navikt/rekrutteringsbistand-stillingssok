import { Accordion } from '@navikt/ds-react';
import React, { FunctionComponent } from 'react';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import Annonsestatus from './Annonsestatus';
import HvorErAnnonsenPublisert from './HvorErAnnonsenPublisert';

const OmAnnonsen: FunctionComponent = () => {
    return (
        <Accordion className="søk__ekspanderbart-panel">
            <Accordion.Item defaultOpen={enhetstype === Enhetstype.Desktop}>
                <Accordion.Header>Om annonsen</Accordion.Header>
                <Accordion.Content>
                    <Annonsestatus />
                    <HvorErAnnonsenPublisert />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

const enhetstype = hentEnhetstype();

export default OmAnnonsen;
