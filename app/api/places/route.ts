import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { remainingPlaces } from "@/lib/places";
import { SIDE_COOKIE, parseSide } from "@/lib/sides";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Places restantes + côté de l'invité (lu dans le cookie posé par /m ou /mme). */
export async function GET() {
  const side = parseSide((await cookies()).get(SIDE_COOKIE)?.value);
  try {
    const remaining = await remainingPlaces();
    return NextResponse.json({ side, remaining }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Places : lecture impossible", err);
    return NextResponse.json({ side, remaining: null }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
