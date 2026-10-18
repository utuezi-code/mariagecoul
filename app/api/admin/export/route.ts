import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { site } from "@/content/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cell(v: string | number | null | undefined): string {
  const s = v === null || v === undefined ? "" : String(v);
  // Neutralise les formules (injection CSV), sauf les numéros de téléphone (« +225… »), et échappe les guillemets
  const isPhone = /^\+?[0-9\s.\-()]+$/.test(s);
  const safe = !isPhone && /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return new Response("Non autorisé", { status: 401 });

  const rows = await prisma.rsvp.findMany({ orderBy: { createdAt: "desc" } });
  const ev = site.rsvp.form.eventsOptions as Record<string, string>;
  const header = ["Nom", "Téléphone", "Présence", "Personnes", "Cérémonie(s)", "Message", "Date (Abidjan)"];
  const lines = rows.map((r) =>
    [
      r.name,
      r.phone,
      r.attending ? "Oui" : "Non",
      r.guests,
      r.events ? (ev[r.events] ?? r.events) : "",
      r.message ?? "",
      r.createdAt.toISOString().replace("T", " ").slice(0, 16),
    ]
      .map(cell)
      .join(";"),
  );
  // BOM UTF-8 + séparateur « ; » pour une ouverture correcte dans Excel (paramètres français)
  const csv = "﻿" + [header.map(cell).join(";"), ...lines].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvp-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
