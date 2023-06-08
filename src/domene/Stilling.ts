import { Hovedtag, Subtag } from '../søk/inkludering/tags';

export type Rekrutteringsbistandstilling = {
    stilling: Stilling;
    stillingsinfo: Stillingsinfo | null;
};

export type Stilling = {
    title: string;
    uuid: string;
    annonsenr: string | null;
    status: string;
    privacy: Privacy | string;
    published: string | null;
    expires: string | null;
    created: string;
    updated: string;
    employer: Employer | null;
    categories: StyrkCategory[];
    source: Kilde | string;
    medium: string;
    businessName: string | null;
    locations: Location[];
    reference: string;
    administration: Administration | null;
    properties: Properties & Record<string, any>;
};

export enum Privacy {
    Intern = 'INTERNAL_NOT_SHOWN',
    Arbeidsplassen = 'SHOW_ALL',
}

export enum Kilde {
    Intern = 'DIR',
}

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
    tags: Array<Hovedtag | Subtag>;
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

export default Stilling;
