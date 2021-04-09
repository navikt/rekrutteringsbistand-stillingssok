const beholdHovedtagsUtenValgteSubtags = (hovedtags: Set<string>, subtags: Set<string>) => {
    const subtagArray = Array.from(subtags);
    const hovedtagsForSubtags = subtagArray.map((subtag) => subtag.split('__')[0]);

    const hovedtagsSomIkkeHarValgteSubtags = Array.from(hovedtags).filter(
        (hovedtag) => !hovedtagsForSubtags.includes(hovedtag)
    );

    return new Set(hovedtagsSomIkkeHarValgteSubtags);
};

const inkludering = (alleHovedtags: Set<string>, subtags: Set<string>) => {
    const hovedtags = beholdHovedtagsUtenValgteSubtags(alleHovedtags, subtags);
    if (hovedtags.size === 0 && subtags.size === 0) return [];

    const samletliste = [...Array.from(hovedtags), ...Array.from(subtags)];

    return [
        {
            terms: {
                'stilling.properties.tags': samletliste,
            },
        },
    ];
};

export default inkludering;
