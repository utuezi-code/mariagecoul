import type { Venue } from "@/content/site";

export function mapsHref(v: Venue): string {
  if (v.mapsUrl) return v.mapsUrl;
  if (v.coordinates) return `https://www.google.com/maps/search/?api=1&query=${v.coordinates.lat},${v.coordinates.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.place)}`;
}

/**
 * Lien Yango (ouvre l'app avec la destination pré-remplie). Seulement si les coordonnées sont connues.
 * À tester sur Android et iOS une fois les coordonnées renseignées (voir README).
 */
export function yangoHref(v: Venue): string | null {
  if (!v.coordinates) return null;
  return `https://yango.go.link/route?end-lat=${v.coordinates.lat}&end-lon=${v.coordinates.lng}`;
}

export function whatsappHref(number: string): string {
  return `https://wa.me/${number.replace(/[^0-9]/g, "")}`;
}
