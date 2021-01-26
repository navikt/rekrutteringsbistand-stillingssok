const urlParam = 'q';

export const hentInputFraUrl = (): string => {
    const url = new URL(window.location.href);
    return url.searchParams.get(urlParam) || '';
};

export const lagUrlMedInput = (input: string): URL => {
    const url = new URL(window.location.href);
    if (input.length === 0) {
        url.searchParams.delete(urlParam);
    } else {
        url.searchParams.set(urlParam, input);
    }
    return url;
};
