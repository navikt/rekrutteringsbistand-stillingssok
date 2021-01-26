export const hentInputFraUrl = (): string => {
    const url = new URL(window.location.href);
    return url.searchParams.get('q') || '';
};

export const lagUrlMedInput = (input: string): URL => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', input);
    return url;
};
