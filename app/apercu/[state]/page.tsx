import { notFound } from "next/navigation";
import { resolveSiteState } from "@/lib/date";
import { HomePage } from "@/components/HomePage";

// Aperçus forcés : /?preview=avant|jourj|apres|clos est réécrit ici par middleware.ts
const STATES = ["avant", "jourj", "apres", "clos"] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return STATES.map((state) => ({ state }));
}

export default async function Preview({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  if (!STATES.includes(state as (typeof STATES)[number])) notFound();
  return <HomePage state={resolveSiteState(state)} />;
}
