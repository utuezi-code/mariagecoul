"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Side } from "@/lib/sides";

type PlacesState = {
  status: "loading" | "ready" | "error";
  /** côté de l'invité (lien /m ou /mme), null pour le lien général */
  side: Side | null;
  remaining: Record<Side, number> | null;
};

const initial: PlacesState = { status: "loading", side: null, remaining: null };
let state = initial;
const listeners = new Set<() => void>();
let started = false;

function emit(next: PlacesState) {
  state = next;
  listeners.forEach((l) => l());
}

/** Recharge les places (au chargement, toutes les 30 s, et juste après une réponse). */
export async function refreshPlaces() {
  try {
    const res = await fetch("/api/places", { cache: "no-store" });
    const data = (await res.json()) as { side: Side | null; remaining: Record<Side, number> | null };
    if (!res.ok || !data.remaining) throw new Error();
    emit({ status: "ready", side: data.side, remaining: data.remaining });
  } catch {
    emit({ ...state, status: state.remaining ? "ready" : "error" });
  }
}

export function usePlaces(): PlacesState {
  const s = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state,
    () => initial,
  );
  useEffect(() => {
    if (started) return;
    started = true;
    refreshPlaces();
    setInterval(() => document.visibilityState === "visible" && refreshPlaces(), 30_000);
  }, []);
  return s;
}
