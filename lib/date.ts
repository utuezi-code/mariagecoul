import { site } from "@/content/site";

export type Phase = "avant" | "jourj" | "apres";
export type PreviewParam = Phase | "clos";

const PREVIEWS: PreviewParam[] = ["avant", "jourj", "apres", "clos"];

/** Abidjan est en UTC+0 toute l'année : la date locale est la date UTC. */
export function abidjanDay(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export function phaseAt(now: Date): Phase {
  const day = abidjanDay(now);
  if (day < site.identity.weddingDay) return "avant";
  if (day === site.identity.weddingDay) return "jourj";
  return "apres";
}

export function rsvpDeadline(): Date {
  const raw = process.env.RSVP_DEADLINE || site.rsvp.deadlineDefault;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date(site.rsvp.deadlineDefault) : d;
}

export type SiteState = {
  phase: Phase;
  rsvpOpen: boolean;
  preview: PreviewParam | null;
};

/**
 * État du site selon la date réelle, ou forcé par `?preview=avant|jourj|apres|clos`.
 * `clos` = avant le mariage, mais après la date limite des confirmations.
 */
export function resolveSiteState(previewRaw: string | undefined, now = new Date()): SiteState {
  const preview = PREVIEWS.includes(previewRaw as PreviewParam) ? (previewRaw as PreviewParam) : null;

  if (preview === "avant") return { phase: "avant", rsvpOpen: true, preview };
  if (preview === "clos") return { phase: "avant", rsvpOpen: false, preview };
  if (preview === "jourj") return { phase: "jourj", rsvpOpen: false, preview };
  if (preview === "apres") return { phase: "apres", rsvpOpen: false, preview };

  const phase = phaseAt(now);
  return { phase, rsvpOpen: phase === "avant" && now < rsvpDeadline(), preview: null };
}

/** "16:30" -> minutes depuis minuit */
export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
