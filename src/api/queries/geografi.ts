const geografi = (alleFylker: Set<string>, kommuner: Set<string>) => {
    const fylker = beholdFylkerUtenValgteKommuner(alleFylker, kommuner);
    if (fylker.size === 0 && kommuner.size === 0) return [];

    const shouldFylker =
        fylker.size === 0
            ? []
            : [
                  {
                      terms: {
                          'stilling.locations.county.keyword': Array.from(fylker).map((fylke) =>
                              fylke.toUpperCase()
                          ),
                      },
                  },
              ];

    const shouldKommuner =
        kommuner.size === 0
            ? []
            : [
                  {
                      terms: {
                          'stilling.locations.municipal.keyword': Array.from(
                              kommuner
                          ).map((kommune) => kommune.split('.')[1].toUpperCase()),
                      },
                  },
              ];

    return [
        {
            nested: {
                path: 'stilling.locations',
                query: {
                    bool: {
                        should: [...shouldFylker, ...shouldKommuner],
                    },
                },
            },
        },
    ];
};

const beholdFylkerUtenValgteKommuner = (fylker: Set<string>, kommuner: Set<string>) => {
    const kommuneArray = Array.from(kommuner);
    const fylkerForKommuner = kommuneArray.map((kommune) => kommune.split('.')[0]);

    return new Set(Array.from(fylker).filter((fylke) => !fylkerForKommuner.includes(fylke)));
};

export default geografi;
