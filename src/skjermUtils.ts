import { useEffect, useState } from 'react';

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

export const useEnhetstype = (): Enhetstype => {
    const { width } = useWindowDimensions();

    if (width < Enhetstype.Tablet) return Enhetstype.Mobil;
    else if (width < Enhetstype.Desktop) return Enhetstype.Tablet;
    return Enhetstype.Desktop;
};

export enum Enhetstype {
    Mobil = 0,
    Tablet = 400,
    Desktop = 768,
}
