import { NextResponse, type NextRequest } from "next/server";
import { SIDE_COOKIE, parseSide } from "@/lib/sides";

const PREVIEWS = new Set(["avant", "jourj", "apres", "clos", "demo"]);

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // /m et /mme : même site, mais les réponses RSVP sont attribuées à M. ou à Mme
  const side = parseSide(pathname.slice(1));
  if (side) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    const res = NextResponse.rewrite(url);
    res.cookies.set(SIDE_COOKIE, side, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
    return res;
  }

  // /?preview=jourj → page statique /apercu/jourj (l'URL affichée ne change pas)
  const preview = searchParams.get("preview");
  if (!preview || !PREVIEWS.has(preview)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/apercu/${preview}`;
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/", "/m", "/mme"] };
