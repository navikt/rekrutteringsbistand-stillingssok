export type GruppeMedTags = {
    hovedtag: Hovedtag;
    subtags: Subtag[];
};

export enum Hovedtag {
    Tilrettelegging = 'INKLUDERING',
    TiltakEllerVirkemiddel = 'TILTAK_ELLER_VIRKEMIDDEL',
    PrioritertMålgruppe = 'PRIORITERT_MÅLGRUPPE',
    StatligInkluderingsdugnad = 'STATLIG_INKLUDERINGSDUGNAD',
}

export enum Subtag {
    TilretteleggingArbeidstid = 'INKLUDERING__ARBEIDSTID',
    TilretteleggingFysisk = 'INKLUDERING__FYSISK',
    TilretteleggingArbeidshverdagen = 'INKLUDERING__ARBEIDSMILJØ',
    TilretteleggingGrunnleggende = 'INKLUDERING__GRUNNLEGGENDE',

    VirkemiddelLønnstilskudd = 'TILTAK_ELLER_VIRKEMIDDEL__LØNNSTILSKUDD',
    VirkemiddelMentortilskudd = 'TILTAK_ELLER_VIRKEMIDDEL__MENTORTILSKUDD',
    VirkemiddelLærlingplass = 'TILTAK_ELLER_VIRKEMIDDEL__LÆRLINGPLASS',

    MålgruppeErUngeUnder30 = 'PRIORITERT_MÅLGRUPPE__UNGE_UNDER_30',
    MålgruppeErSeniorerOver50 = 'PRIORITERT_MÅLGRUPPE__SENIORER_OVER_45',
    MålgruppeKommerFraLandUtenforEØS = 'PRIORITERT_MÅLGRUPPE__KOMMER_FRA_LAND_UTENFOR_EØS',
    MålgruppeHullICVen = 'PRIORITERT_MÅLGRUPPE__HULL_I_CV_EN',
    MålgruppeLiteEllerIngenUtdanning = 'PRIORITERT_MÅLGRUPPE__LITE_ELLER_INGEN_UTDANNING',
    MålgruppeLiteEllerIngenArbeidserfaring = 'PRIORITERT_MÅLGRUPPE__LITE_ELLER_INGEN_ARBEIDSERFARING',
}

export const hierarkiAvTagsForFilter: Array<GruppeMedTags> = [
    {
        hovedtag: Hovedtag.Tilrettelegging,
        subtags: [
            Subtag.TilretteleggingArbeidstid,
            Subtag.TilretteleggingArbeidshverdagen,
            Subtag.TilretteleggingFysisk,
            Subtag.TilretteleggingGrunnleggende,
        ],
    },

    {
        hovedtag: Hovedtag.TiltakEllerVirkemiddel,
        subtags: [
            Subtag.VirkemiddelLønnstilskudd,
            Subtag.VirkemiddelMentortilskudd,
            Subtag.VirkemiddelLærlingplass,
        ],
    },

    {
        hovedtag: Hovedtag.PrioritertMålgruppe,
        subtags: [
            Subtag.MålgruppeErUngeUnder30,
            Subtag.MålgruppeErSeniorerOver50,
            Subtag.MålgruppeKommerFraLandUtenforEØS,
            Subtag.MålgruppeHullICVen,
            Subtag.MålgruppeLiteEllerIngenUtdanning,
            Subtag.MålgruppeLiteEllerIngenArbeidserfaring,
        ],
    },

    {
        hovedtag: Hovedtag.StatligInkluderingsdugnad,
        subtags: [],
    },
];

export const visningsnavnForFilter = {
    [Hovedtag.Tilrettelegging]: 'Tilretteleggingsmuligheter',

    [Subtag.TilretteleggingArbeidstid]: 'Arbeidstid',
    [Subtag.TilretteleggingFysisk]: 'Fysisk tilrettelegging',
    [Subtag.TilretteleggingArbeidshverdagen]: 'Arbeidshverdagen',
    [Subtag.TilretteleggingGrunnleggende]: 'Utfordringer med norsk',

    [Hovedtag.TiltakEllerVirkemiddel]: 'Bruk av virkemidler',
    [Subtag.VirkemiddelLønnstilskudd]: 'Lønnstilskudd',
    [Subtag.VirkemiddelMentortilskudd]: 'Mentortilskudd',
    [Subtag.VirkemiddelLærlingplass]: 'Lærlingplass',

    [Hovedtag.PrioritertMålgruppe]: 'Prioriterte målgrupper',
    [Subtag.MålgruppeErUngeUnder30]: 'Unge under 30 år',
    [Subtag.MålgruppeErSeniorerOver50]: 'Seniorer 50+',
    [Subtag.MålgruppeKommerFraLandUtenforEØS]: 'Borgere fra land utenfor EØS',
    [Subtag.MålgruppeHullICVen]: 'Hull i CV-en',
    [Subtag.MålgruppeLiteEllerIngenUtdanning]: 'Lite eller ingen utdanning',
    [Subtag.MålgruppeLiteEllerIngenArbeidserfaring]: 'Lite eller ingen arbeidserfaring',

    [Hovedtag.StatligInkluderingsdugnad]: 'Statlig inkluderingsdugnad',
};

export const hentHovedtags = (): string[] => {
    return Object.values(Hovedtag);
};
