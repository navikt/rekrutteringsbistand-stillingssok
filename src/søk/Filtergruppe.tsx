import { Accordion } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Enhetstype, hentEnhetstype } from '../utils/skjermUtils';
import søkCss from './Søk.module.css';

type Props = {
    tittel: string;
    children?: ReactNode;
};

const Filtergruppe = ({ tittel, children }: Props) => {
    return (
        <Accordion className={søkCss.filtergruppe}>
            <Accordion.Item defaultOpen={enhetstype === Enhetstype.Desktop}>
                <Accordion.Header>{tittel}</Accordion.Header>
                <Accordion.Content>{children}</Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

const enhetstype = hentEnhetstype();

export default Filtergruppe;
