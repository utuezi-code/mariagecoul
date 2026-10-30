import { site } from "@/content/site";
import { prisma } from "@/lib/prisma";
import { SIDES, parseSide, type Side } from "@/lib/sides";

export type Places = Record<Side, number>;

/** Numéro comparable : chiffres seuls, indicatif 225 ajouté aux numéros locaux à 10 chiffres. */
export function normalizePhone(phone: string): string {
  const d = phone.replace(/[^0-9]/g, "").replace(/^00/, "");
  return d.length === 10 && d.startsWith("0") ? `225${d}` : d;
}

/**
 * Places restantes par côté. Seule la dernière réponse de chaque numéro compte (une personne qui
 * répond deux fois ne prend pas deux fois des places ; passer à « Non » les libère).
 * `excludePhone` : ignore la réponse précédente de ce numéro (pour vérifier une nouvelle réponse).
 */
export async function remainingPlaces(excludePhone?: string): Promise<Places> {
  const rows = await prisma.rsvp.findMany({
    select: { phone: true, attending: true, guests: true, side: true },
    orderBy: { createdAt: "desc" },
  });
  const seen = new Set<string>();
  const taken: Places = { m: 0, mme: 0 };
  for (const r of rows) {
    const key = normalizePhone(r.phone);
    if (seen.has(key)) continue;
    seen.add(key);
    if (key === excludePhone) continue;
    const side = parseSide(r.side);
    if (r.attending && side) taken[side] += r.guests;
  }
  const cap = site.rsvp.places.capacity;
  return Object.fromEntries(SIDES.map((s) => [s, Math.max(0, cap[s] - taken[s])])) as Places;
}
