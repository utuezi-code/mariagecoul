import { notFound } from "next/navigation";
import { resolveSiteState } from "@/lib/date";
import { HomePage } from "@/components/HomePage";
import { demoMedia } from "@/content/demo";

// Aperçus forcés : /?preview=avant|jourj|apres|clos|demo est réécrit ici par middleware.ts
// « demo » = état « avant » avec des visuels de démonstration (hero avec photo + galerie).
const STATES = ["avant", "jourj", "apres", "clos", "demo"] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return STATES.map((state) => ({ state }));
}

export default async function Preview({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  if (!STATES.includes(state as (typeof STATES)[number])) notFound();
  if (state === "demo") return <HomePage state={resolveSiteState("avant")} media={demoMedia} demo />;
  return <HomePage state={resolveSiteState(state)} />;
}
