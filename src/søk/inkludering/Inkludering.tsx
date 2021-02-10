import React, { FunctionComponent, ChangeEvent, useState, useEffect } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import { Enhetstype, hentEnhetstype } from '../../utils/skjermUtils';
import { hentSøkekriterier, oppdaterUrlMedParam, QueryParam } from '../søkefelt/urlUtils';
import { useHistory, useLocation } from 'react-router-dom';

const Inkludering: FunctionComponent = () => {
    const history = useHistory();
    const { search } = useLocation();

    const [harInkluderingsmulighet, setHarInkluderingsmulighet] = useState<boolean>(
        hentSøkekriterier(search).inkludering
    );

    useEffect(() => {
        setHarInkluderingsmulighet(hentSøkekriterier(search).inkludering);
    }, [search]);

    const onInkluderingChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;

        setHarInkluderingsmulighet(checked);

        oppdaterUrlMedParam({
            history,
            parameter: QueryParam.Inkludering,
            verdi: checked,
        });
    };

    return (
        <Ekspanderbartpanel
            apen={enhetstype === Enhetstype.Desktop}
            tittel="Inkludering"
            className="søk__ekspanderbart-panel"
        >
            <Checkbox
                className="søk__checkbox"
                label="Har inkluderingsmuligheter"
                checked={harInkluderingsmulighet}
                onChange={onInkluderingChange}
            />
        </Ekspanderbartpanel>
    );
};

const enhetstype = hentEnhetstype();

export default Inkludering;
