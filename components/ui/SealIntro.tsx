"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/content/site";
import { fr } from "@/lib/typo";
import { Monogram } from "./Monogram";

/** Durée totale (doit correspondre à la chronologie de globals.css, section « Intro »). */
const TOTAL_MS = 4400;

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
 * Ouverture du site : un parchemin roulé, scellé à la cire. Le sceau se brise, le parchemin se
 * déroule et présente les mariés, puis s'efface sur le site. Animation 100 % CSS (elle joue dès
 * le premier affichage) ; le JavaScript gère seulement « Passer », le blocage du défilement et
 * le retrait du calque. Désactivée si prefers-reduced-motion.
 */
export function SealIntro() {
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const start = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    start.current = performance.now();
    const root = document.documentElement;
    root.classList.add("intro-lock");
    const t = setTimeout(() => setDone(true), TOTAL_MS);
    return () => {
      clearTimeout(t);
      root.classList.remove("intro-lock");
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.classList.remove("intro-lock");
  }, [done]);

  const skip = () => {
    if (leaving) return;
    // Le hero démarre ses animations juste après le fondu, au lieu d'attendre la fin prévue
    const elapsed = (performance.now() - start.current) / 1000;
    document.querySelectorAll<HTMLElement>("[data-intro-delay]").forEach((el) => {
      el.style.setProperty("--intro", `${(elapsed + 0.35).toFixed(2)}s`);
    });
    setLeaving(true);
    setTimeout(() => setDone(true), 450);
  };

  if (done) return null;

  const { identity, hero, intro } = site;

  return (
    <div className={`intro ${leaving ? "intro-leaving" : ""}`} onClick={skip}>
      <div className="intro-stage" aria-hidden="true">
        {/* feuille de parchemin, révélée depuis le centre */}
        <div className="intro-paper">
          <div className="intro-content">
            <Monogram className="mx-auto h-16 w-16 md:h-20 md:w-20" />
            <p className="eyebrow mt-5 text-gold-ink">{fr(hero.eyebrow)}</p>
            <p className="mt-2 font-display text-xl font-light italic text-graphite md:text-2xl">{hero.title}</p>
            <p className="mt-4 font-display text-[2.6rem] font-light leading-[1.02] text-gold-gradient md:text-5xl">
              {identity.groomFirstName}
              <br />
              <span className="italic">&amp;</span> {identity.brideFirstName}
            </p>
            <div className="intro-rule" />
            <p className="font-display text-lg text-ink md:text-xl">{identity.dateLong}</p>
          </div>
        </div>

        {/* rouleaux */}
        <div className="intro-roller intro-roller-top" />
        <div className="intro-roller intro-roller-bottom" />

        {/* ruban + sceau de cire, qui se brise en deux */}
        <div className="intro-ribbon" />
        <div className="intro-seal">
          <span className="intro-seal-half intro-seal-left">
            <WaxSeal />
          </span>
          <span className="intro-seal-half intro-seal-right">
            <WaxSeal />
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => (e.stopPropagation(), skip())}
        className="eyebrow absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-3 text-gold-ink"
        aria-label={intro.skipLabel}
        style={{ "--rv-d": "0s" } as CSSProperties}
      >
        {intro.skip}
      </button>
    </div>
  );
}
