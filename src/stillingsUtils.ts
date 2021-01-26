import Stilling, { Rekrutteringsbistandstilling } from './Stilling';

export const erDirektemeldtStilling = (stilling: Stilling) => stilling.source === 'DIR';

export const skalViseLenkeTilKandidatliste = (
    rekrutteringsbistandStilling: Rekrutteringsbistandstilling
) =>
    erDirektemeldtStilling(rekrutteringsbistandStilling.stilling) ||
    rekrutteringsbistandStilling.stillingsinfo !== null;

export const lagUrlTilStilling = (stilling: Stilling) => `/stillinger/stilling/${stilling.uuid}`;

export const lagUrlTilKandidatliste = (stilling: Stilling) =>
    `/kandidater/lister/stilling/${stilling.uuid}/detaljer`;
