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

export const hentHovedtags = (): string[] => {
    return Object.values(Hovedtag);
};
