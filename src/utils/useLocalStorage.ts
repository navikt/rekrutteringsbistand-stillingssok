import { useEffect, useState } from 'react';

const hentVerdiFraLocalStorage = (key: string) => window.localStorage.getItem(key);

const useLocalStorage = (
    key: string
): { verdi: string | null; setVerdi: (verdi: string) => void; slettVerdi: () => void } => {
    const [storedValue, setStoredValue] = useState<string | null>(hentVerdiFraLocalStorage(key));

    const setValue = (value: string) => {
        window.localStorage.setItem(key, value);
        window.dispatchEvent(new Event('local-storage'));
    };

    const deleteValue = () => {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new Event('local-storage'));
    };

    useEffect(() => {
        setStoredValue(hentVerdiFraLocalStorage(key));
    }, [key]);

    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(hentVerdiFraLocalStorage(key));
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, [key]);

    return { verdi: storedValue, setVerdi: setValue, slettVerdi: deleteValue };
};
export default useLocalStorage;
