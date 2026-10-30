/**
 * Côté de l'invité, déduit du lien reçu : /m (envoyé par M.) ou /mme (envoyé par Mme).
 * middleware.ts dépose le cookie, l'API RSVP l'enregistre avec la réponse.
 */
export const SIDES = ["m", "mme"] as const;
export type Side = (typeof SIDES)[number];

export const SIDE_COOKIE = "invite_de";

export function parseSide(value: string | null | undefined): Side | null {
  return SIDES.includes(value as Side) ? (value as Side) : null;
}
