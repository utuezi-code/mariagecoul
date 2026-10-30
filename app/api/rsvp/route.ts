import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSiteState } from "@/lib/date";
import { rateLimit } from "@/lib/rate-limit";
import { rsvpSchema } from "@/lib/rsvp";
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
  const side = parseSide((await cookies()).get(SIDE_COOKIE)?.value);
  const attending = d.attending === "oui";
  try {
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
