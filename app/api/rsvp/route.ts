import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSiteState } from "@/lib/date";
import { rateLimit } from "@/lib/rate-limit";
import { rsvpSchema } from "@/lib/rsvp";
import { normalizePhone, remainingPlaces } from "@/lib/places";
import { site } from "@/content/site";
import { SIDE_COOKIE, parseSide } from "@/lib/sides";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!resolveSiteState(undefined).rsvpOpen) {
    return NextResponse.json({ ok: false, reason: "closed" }, { status: 403 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip)) return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!errors[k]) errors[k] = issue.message;
    }
    // Honeypot rempli : on répond comme un succès pour ne pas renseigner le robot.
    if (errors.website) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const d = parsed.data;
  // Côté : lien /m ou /mme en priorité, sinon le choix fait dans le formulaire
  const side = parseSide((await cookies()).get(SIDE_COOKIE)?.value) ?? d.side ?? null;
  const attending = d.attending === "oui";
  const e = site.rsvp.form.errors;
  if (attending && !side) return NextResponse.json({ ok: false, errors: { side: e.side } }, { status: 400 });
  try {
    if (attending && side) {
      const left = (await remainingPlaces(normalizePhone(d.phone)))[side];
      if (d.guests > left) {
        const msg = left <= 0 ? e.full : e.notEnough.replace("{n}", String(left));
        return NextResponse.json({ ok: false, errors: { guests: msg }, remaining: left }, { status: 409 });
      }
    }
    await prisma.rsvp.create({
      data: {
        name: d.name,
        phone: d.phone,
        attending,
        guests: attending ? d.guests : 0,
        events: attending ? (d.events ?? null) : null,
        message: d.message || null,
        side,
      },
    });
  } catch (err) {
    console.error("RSVP: échec d'enregistrement", err);
    return NextResponse.json({ ok: false, reason: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
