import { Accordion } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Enhetstype, hentEnhetstype } from '../utils/skjermUtils';

type Props = {
    tittel: string;
    children?: ReactNode;
};

const Filtergruppe = ({ tittel, children }: Props) => {
    return (
        <Accordion className="søk__filtergruppe">
            <Accordion.Item defaultOpen={enhetstype === Enhetstype.Desktop}>
                <Accordion.Header className="søk__filtergruppe-tittel">{tittel}</Accordion.Header>
                <Accordion.Content>{children}</Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

const enhetstype = hentEnhetstype();

export default Filtergruppe;
