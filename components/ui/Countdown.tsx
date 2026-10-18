"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const TARGET = new Date(site.identity.countdownTarget).getTime();

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** Compte à rebours vers le 29/11/2026 08 h 00 (heure d'Abidjan = UTC). */
export function Countdown({ forceToday = false }: { forceToday?: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const labels = site.hero.countdownLabels;

  if (forceToday || (now !== null && now >= TARGET)) {
    return <p className="font-display text-3xl italic text-gold-gradient md:text-4xl">{site.hero.todayLabel}</p>;
  }

  const p = now === null ? null : parts(TARGET - now);
  const items: [keyof typeof labels, number | undefined][] = [
    ["days", p?.days],
    ["hours", p?.hours],
    ["minutes", p?.minutes],
    ["seconds", p?.seconds],
  ];

  return (
    <div role="timer" aria-live="off" className="flex items-stretch justify-center">
      {items.map(([key, value], i) => (
        <div key={key} className="flex items-stretch">
          {i > 0 && (
            <span aria-hidden="true" className="mx-3 w-px self-stretch bg-gradient-to-b from-transparent via-gold/70 to-transparent sm:mx-6" />
          )}
          <div className="flex min-w-[3.6rem] flex-col items-center sm:min-w-[5rem]">
            <span className="font-display text-4xl font-light tabular-nums leading-none text-ivory sm:text-6xl">
              {value === undefined ? "––" : String(value).padStart(2, "0")}
            </span>
            <span className="eyebrow mt-3 !text-[0.6rem] !tracking-[0.3em] text-gold sm:!text-[0.65rem]">{labels[key]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
