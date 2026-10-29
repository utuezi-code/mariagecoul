"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";


// Bord ondulé de la cire : cercle de rayon 46 ± 3, 14 ondulations (viewBox 100×100)
const SEAL_EDGE = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 112; i++) {
    const a = (i / 112) * Math.PI * 2;
    const r = 45 + 3 * Math.sin(a * 14) + 1.2 * Math.sin(a * 5 + 1);
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
})();

function WaxSeal() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="wax" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#e6cb8a" />
          <stop offset="0.45" stopColor="#c9a24b" />
          <stop offset="1" stopColor="#7a5f24" />
        </radialGradient>
        <radialGradient id="wax-in" cx="55%" cy="60%" r="65%">
          <stop offset="0" stopColor="#b8913f" />
          <stop offset="1" stopColor="#8a6d2c" />
        </radialGradient>
      </defs>
      <path d={SEAL_EDGE} fill="url(#wax)" />
      <circle cx="50" cy="50" r="33" fill="url(#wax-in)" stroke="#e6cb8a" strokeOpacity="0.55" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="29" fill="none" stroke="#7a5f24" strokeOpacity="0.6" strokeWidth="0.6" />
      {/* empreinte du monogramme, en relief */}
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontSize="19"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        fill="#5a4519"
        stroke="#f0dca8"
        strokeOpacity="0.5"
        strokeWidth="0.3"
      >
        C&amp;S
        <tspan fontSize="10" dy="-7" fontStyle="italic">
          .A²
        </tspan>
      </text>
    </svg>
  );
}

/**
 * Ouverture du site : le site reste fermé par un parchemin roulé, scellé à la cire. L'invité
 * touche le sceau : il se brise, et les deux rouleaux s'écartent vers le haut et le bas de l'écran
 * pour dévoiler le site. Les animations du hero démarrent à ce moment-là.
 * Sans JavaScript, le calque est masqué (<noscript> dans HomePage) pour ne jamais bloquer le site.
 */
export function SealIntro() {
  const [state, setState] = useState<"closed" | "opening" | "done">("closed");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("intro-lock");
    const list = timers.current;
    return () => {
      list.forEach(clearTimeout);
      root.classList.remove("intro-lock");
    };
  }, []);

  const releaseHero = () =>
    document.querySelectorAll("[data-intro-wait]").forEach((el) => el.removeAttribute("data-intro-wait"));

  const finish = () => {
    releaseHero();
    document.documentElement.classList.remove("intro-lock");
    setState("done");
  };

  const open = () => {
    if (state !== "closed") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
    setState("opening");
    timers.current.push(window.setTimeout(releaseHero, 650), window.setTimeout(finish, 1750));
  };

  if (state === "done") return null;

  const { intro } = site;

  return (
    <div className={`intro ${state === "opening" ? "is-opening" : ""}`}>
      <div className="intro-panel intro-panel-top" aria-hidden="true">
        <div className="intro-roller" />
      </div>
      <div className="intro-panel intro-panel-bottom" aria-hidden="true">
        <div className="intro-roller" />
      </div>

      <div className="intro-center">
        <div className="intro-ribbon" aria-hidden="true" />
        <button type="button" className="intro-seal" onClick={open} aria-label={intro.openLabel} autoFocus>
          <span className="intro-seal-half intro-seal-left">
            <WaxSeal />
          </span>
          <span className="intro-seal-half intro-seal-right">
            <WaxSeal />
          </span>
        </button>
        <p className="intro-hint eyebrow text-gold-ink" aria-hidden="true">
          {intro.hint}
        </p>
      </div>
    </div>
  );
}
