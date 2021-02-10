type GruppeMedTags = {
    hovedtag: Hovedtag;
    subtags: Tag[];
};

enum Hovedtag {
    Tilrettelegging = 'INKLUDERING',
    TiltakEllerVirkemiddel = 'TILTAK_ELLER_VIRKEMIDDEL',
    PrioritertMålgruppe = 'PRIORITERT_MÅLGRUPPE',
    StatligInkluderingsdugnad = 'STATLIG_INKLUDERINGSDUGNAD',
}

export enum Tag {
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
            Tag.TilretteleggingArbeidstid,
            Tag.TilretteleggingArbeidshverdagen,
            Tag.TilretteleggingFysisk,
            Tag.TilretteleggingGrunnleggende,
        ],
    },

    {
        hovedtag: Hovedtag.TiltakEllerVirkemiddel,
        subtags: [
            Tag.VirkemiddelLønnstilskudd,
            Tag.VirkemiddelMentortilskudd,
            Tag.VirkemiddelLærlingplass,
        ],
    },

    {
        hovedtag: Hovedtag.PrioritertMålgruppe,
        subtags: [
            Tag.MålgruppeErUngeUnder30,
            Tag.MålgruppeErSeniorerOver50,
            Tag.MålgruppeKommerFraLandUtenforEØS,
            Tag.MålgruppeHullICVen,
            Tag.MålgruppeLiteEllerIngenUtdanning,
            Tag.MålgruppeLiteEllerIngenArbeidserfaring,
        ],
    },

    {
        hovedtag: Hovedtag.StatligInkluderingsdugnad,
        subtags: [],
    },
];

export const visningsnavnForFilter = {
    [Hovedtag.Tilrettelegging]: 'Tilretteleggingsmuligheter',

    [Tag.TilretteleggingArbeidstid]: 'Arbeidstid',
    [Tag.TilretteleggingFysisk]: 'Fysisk tilrettelegging',
    [Tag.TilretteleggingArbeidshverdagen]: 'Arbeidshverdagen',
    [Tag.TilretteleggingGrunnleggende]: 'Utfordringer med norsk',

    [Hovedtag.TiltakEllerVirkemiddel]: 'Bruk av virkemidler',
    [Tag.VirkemiddelLønnstilskudd]: 'Lønnstilskudd',
    [Tag.VirkemiddelMentortilskudd]: 'Mentortilskudd',
    [Tag.VirkemiddelLærlingplass]: 'Lærlingplass',

    [Hovedtag.PrioritertMålgruppe]: 'Prioriterte målgrupper',
    [Tag.MålgruppeErUngeUnder30]: 'Unge under 30 år',
    [Tag.MålgruppeErSeniorerOver50]: 'Seniorer 50+',
    [Tag.MålgruppeKommerFraLandUtenforEØS]: 'Borgere fra land utenfor EØS',
    [Tag.MålgruppeHullICVen]: 'Hull i CV-en',
    [Tag.MålgruppeLiteEllerIngenUtdanning]: 'Lite eller ingen utdanning',
    [Tag.MålgruppeLiteEllerIngenArbeidserfaring]: 'Lite eller ingen arbeidserfaring',

    [Hovedtag.StatligInkluderingsdugnad]: 'Statlig inkluderingsdugnad',
};
