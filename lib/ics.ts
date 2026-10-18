import { site } from "@/content/site";

function stamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Plie les lignes à 75 octets (RFC 5545). */
function fold(line: string): string {
  const out: string[] = [];
  let current = "";
  for (const ch of line) {
    if (Buffer.byteLength(current + ch) > 73) {
      out.push(current);
      current = " " + ch;
    } else current += ch;
  }
  out.push(current);
  return out.join("\r\n");
}

export function buildIcs(): string {
  const now = stamp(new Date().toISOString());
  const { identity, invitation } = site;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CS-A2//Mariage//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escape(identity.displayNames)}`,
    ...invitation.venues.flatMap((v) => [
      "BEGIN:VEVENT",
      `UID:${v.id}-${identity.weddingDay}@cs-a2`,
      `DTSTAMP:${now}`,
      `DTSTART:${stamp(v.start)}`,
      `DTEND:${stamp(v.end)}`,
      `SUMMARY:${escape(`${v.title} — ${identity.displayNames}`)}`,
      `LOCATION:${escape(v.place)}`,
      `DESCRIPTION:${escape(`${invitation.labels.landmark} : ${v.landmark}\n${invitation.labels.dressCodeBadge}`)}`,
      ...(v.coordinates ? [`GEO:${v.coordinates.lat};${v.coordinates.lng}`] : []),
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
