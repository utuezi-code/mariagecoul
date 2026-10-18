import { NextResponse, type NextRequest } from "next/server";

const PREVIEWS = new Set(["avant", "jourj", "apres", "clos"]);

/** `/?preview=jourj` → page statique `/apercu/jourj` (l'URL affichée ne change pas). */
export function middleware(req: NextRequest) {
  const preview = req.nextUrl.searchParams.get("preview");
  if (!preview || !PREVIEWS.has(preview)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/apercu/${preview}`;
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = { matcher: "/" };
