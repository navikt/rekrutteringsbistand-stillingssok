import { Accordion } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Enhetstype, hentEnhetstype } from '../utils/skjermUtils';
import filterCss from './Filter.module.css';

type Props = {
    tittel: string;
    children?: ReactNode;
};

const Filtergruppe = ({ tittel, children }: Props) => {
    return (
        <Accordion className={filterCss.filtergruppe}>
            <Accordion.Item defaultOpen={enhetstype === Enhetstype.Desktop}>
                <Accordion.Header>{tittel}</Accordion.Header>
                <Accordion.Content className={filterCss.innhold}>{children}</Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

const enhetstype = hentEnhetstype();

export default Filtergruppe;
