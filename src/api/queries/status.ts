import { Status } from '../../søk/om-annonsen/Annonsestatus';

export const status = (statuser: Set<Status>) => {
    const ingenFiltreValgt = statuser.size === 0;
    const alleFiltreValgt = statuser.size === Object.keys(Status).length;

    if (ingenFiltreValgt || alleFiltreValgt) {
        return alleStillinger;
    }

    let statusSpørringer: any[] = [];
    if (statuser.has(Status.Publisert)) statusSpørringer.push(publisert);
    if (statuser.has(Status.Stoppet)) statusSpørringer.push(stoppet);
    if (statuser.has(Status.Utløpt)) statusSpørringer.push(utløpt);

    return [
        {
            bool: {
                should: statusSpørringer,
            },
        },
    ];
};

const stillingenErEllerHarVærtPublisert = [
    {
        term: {
            'stilling.administration.status': 'DONE',
        },
    },
    {
        exists: {
            field: 'stilling.publishedByAdmin',
        },
    },
    {
        range: {
            'stilling.published': {
                lte: 'now/d',
            },
        },
    },
];

const alleStillinger = [
    {
        bool: {
            must_not: [
                {
                    term: {
                        'stilling.status': 'REJECTED',
                    },
                },
                {
                    term: {
                        'stilling.status': 'DELETED',
                    },
                },
            ],
            must: stillingenErEllerHarVærtPublisert,
        },
    },
];

const publisert = {
    term: {
        'stilling.status': 'ACTIVE',
    },
};

const stoppet = {
    bool: {
        must: [{ term: { 'stilling.status': 'STOPPED' } }, ...stillingenErEllerHarVærtPublisert],
    },
};

const utløpt = {
    bool: {
        must: [
            { term: { 'stilling.status': 'INACTIVE' } },
            {
                range: {
                    'stilling.expires': {
                        lt: 'now/d',
                    },
                },
            },
            ...stillingenErEllerHarVærtPublisert,
        ],
    },
};
