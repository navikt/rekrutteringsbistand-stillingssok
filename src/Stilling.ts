export type Rekrutteringsbistandstilling = {
    stilling: Stilling;
    stillingsinfo: Stillingsinfo | null;
};

export type Stilling = {
    title: string;
    uuid: string;
    status: string;
    privacy: string;
    published: string | null;
    expires: string | null;
    created: string;
    updated: string;
    employer: Employer | null;
    categories: StyrkCategory[];
    source: string;
    medium: string;
    businessName: string | null;
    locations: Location[];
    reference: string;
    administration: Administration | null;
    properties: Properties & Record<string, any>;
};

export type Stillingsinfo = {
    eierNavident: string | null;
    eierNavn: string | null;
    notat: string | null;
    stillingsid: string;
    stillingsinfoid: string;
};

export type Employer = {
    name: string;
    publicName: string;
    orgnr: string | null;
    parentOrgnr: string | null;
    orgform: string;
};

export type StyrkCategory = {
    styrkCode: string;
    name: string;
};

export type Location = {
    address: string | null;
    postalCode: string | null;
    county: string | null;
    municipal: string | null;
    latitue: string | null;
    longitude: string | null;
};

export type Administration = {
    status: string;
    remarks: string[];
    comments: string;
    reportee: string;
    navIdent: string;
};

export type Properties = Partial<{
    adtext: string;
    author: string;
    employer: string;
    jobtitle: string;
    location: string;
    starttime: string;
    applicationdue: Søknadsfrist | string;
    extent: Omfang;
    engagementtype: Ansettelsesform;
    positioncount: number;
    tags: Tag[];
}>;

export enum Søknadsfrist {
    Snarest = 'Snarest',
}

export enum Ansettelsesform {
    Ingen = '',
    Fast = 'Fast',
    Vikariat = 'Vikariat',
    Engasjement = 'Engasjement',
    Prosjekt = 'Prosjekt',
    Sesong = 'Sesong',
    Feriejobb = 'Feriejobb',
    Trainee = 'Trainee',
    Lærling = 'Lærling',
    Åremål = 'Åremål',
    Selvstendig = 'Selvstendig næringsdrivende',
    Annet = 'Annet',
}

export enum Omfang {
    Heltid = 'Heltid',
    Deltid = 'Deltid',
}

export enum Tag {
    Tilrettelegging = 'INKLUDERING',
    TilretteleggingArbeidstid = 'INKLUDERING__ARBEIDSTID',
    TilretteleggingFysisk = 'INKLUDERING__FYSISK',
    TilretteleggingArbeidshverdagen = 'INKLUDERING__ARBEIDSMILJØ',
    TilretteleggingGrunnleggende = 'INKLUDERING__GRUNNLEGGENDE',

    TiltakEllerVirkemiddel = 'TILTAK_ELLER_VIRKEMIDDEL',
    VirkemiddelLønnstilskudd = 'TILTAK_ELLER_VIRKEMIDDEL__LØNNSTILSKUDD',
    VirkemiddelMentortilskudd = 'TILTAK_ELLER_VIRKEMIDDEL__MENTORTILSKUDD',
    VirkemiddelLærlingplass = 'TILTAK_ELLER_VIRKEMIDDEL__LÆRLINGPLASS',

    PrioritertMålgruppe = 'PRIORITERT_MÅLGRUPPE',
    MålgruppeErUngeUnder30 = 'PRIORITERT_MÅLGRUPPE__UNGE_UNDER_30',
    MålgruppeErSeniorerOver50 = 'PRIORITERT_MÅLGRUPPE__SENIORER_OVER_45',
    MålgruppeKommerFraLandUtenforEØS = 'PRIORITERT_MÅLGRUPPE__KOMMER_FRA_LAND_UTENFOR_EØS',
    MålgruppeHullICVen = 'PRIORITERT_MÅLGRUPPE__HULL_I_CV_EN',
    MålgruppeLiteEllerIngenUtdanning = 'PRIORITERT_MÅLGRUPPE__LITE_ELLER_INGEN_UTDANNING',
    MålgruppeLiteEllerIngenArbeidserfaring = 'PRIORITERT_MÅLGRUPPE__LITE_ELLER_INGEN_ARBEIDSERFARING',

    StatligInkluderingsdugnad = 'STATLIG_INKLUDERINGSDUGNAD',
}

export default Stilling;
