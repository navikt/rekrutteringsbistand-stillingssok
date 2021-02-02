import { useEffect, useState } from 'react';

export enum Enhetstype {
    Mobil = 0,
    Tablet = 400,
    Desktop = 992,
}

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};

const beregnEnhetstype = (vindusbredde: number) => {
    if (vindusbredde < Enhetstype.Tablet) return Enhetstype.Mobil;
    else if (vindusbredde < Enhetstype.Desktop) return Enhetstype.Tablet;
    return Enhetstype.Desktop;
};

export const hentEnhetstype = (): Enhetstype => {
    const { width } = getWindowDimensions();

    return beregnEnhetstype(width);
};

export const useEnhetstype = (): Enhetstype => {
    const { width } = useWindowDimensions();

    return beregnEnhetstype(width);
};
