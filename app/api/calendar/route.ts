import { buildIcs } from "@/lib/ics";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mariage-cs-a2.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
