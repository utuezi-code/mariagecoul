"use client";

import { site } from "@/content/site";
import { usePlaces } from "@/lib/places-client";
import { SIDES } from "@/lib/sides";

const P = site.rsvp.places;
const label = (n: number) => (n <= 0 ? P.full : `${n > 1 ? P.many : P.one}`);

/** Nombre qui « bascule » quand il change (clé = valeur → l'animation rejoue). */
function Count({ n, className }: { n: number; className: string }) {
  return (
    <span key={n} className={`places-tick inline-block tabular-nums ${className}`}>
      {n}
    </span>
  );
}

/**
 * Places restantes. Invité arrivé par /m ou /mme : le compteur de son côté.
 * Lien général : les deux compteurs. Masqué si la base est injoignable.
 */
export function PlacesLeft({ variant }: { variant: "hero" | "rsvp" }) {
  const { status, side, remaining } = usePlaces();
  if (status !== "ready" || !remaining) return null;

  const sides = side ? [side] : [...SIDES];

  if (variant === "hero") {
    return (
      <p className="mt-6 flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1 text-graphite" aria-live="polite">
        {sides.map((s) => (
          <span key={s} className="flex items-baseline gap-2">
            {!side && <span className="eyebrow !text-[0.6rem] text-mist-deep">{P.sides[s]}</span>}
            {remaining[s] > 0 && <Count n={remaining[s]} className="font-display text-2xl text-gold-ink" />}
            <span className="text-sm">{label(remaining[s])}</span>
          </span>
        ))}
      </p>
    );
  }

  return (
    <div className={`mx-auto mt-10 grid max-w-md gap-4 ${sides.length > 1 ? "grid-cols-2" : ""}`} aria-live="polite">
      {sides.map((s) => (
        <div key={s} className="border border-gold/40 bg-white px-4 py-6 text-center">
          {!side && <p className="eyebrow !text-[0.6rem] text-mist-deep">{P.sides[s]}</p>}
          {remaining[s] > 0 ? (
            <Count n={remaining[s]} className="font-display text-6xl font-light leading-none text-gold-gradient" />
          ) : (
            <span className="font-display text-4xl italic text-gold-ink">{P.full}</span>
          )}
          {remaining[s] > 0 && <p className="eyebrow mt-3 !text-[0.65rem] text-gold-ink">{label(remaining[s])}</p>}
        </div>
      ))}
    </div>
  );
}
