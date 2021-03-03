import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const standardsøkLocalstorageKey = 'standardsok';

const erStandardsøkAktivt = (search: string) => {
    const standardsøk = localStorage.getItem(standardsøkLocalstorageKey);
    return standardsøk === search;
};

export const useStandardsøk = () => {
    const { search } = useLocation();
    const [standardsøkErAktivt, setStandardsøkErAktivt] = useState<boolean>(
        erStandardsøkAktivt(search)
    );

    useEffect(() => {
        setStandardsøkErAktivt(erStandardsøkAktivt(search));
    }, [search, standardsøkErAktivt, setStandardsøkErAktivt, erStandardsøkAktivt]);

    function setStandardsøkTilAktivt() {
        setStandardsøkErAktivt(true);
    }

    return { standardsøkErAktivt, setStandardsøkTilAktivt };
};
