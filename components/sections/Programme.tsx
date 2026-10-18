"use client";

import { m, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { hhmmToMinutes, type Phase } from "@/lib/date";
import { fr } from "@/lib/typo";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { StepIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Verse } from "@/components/ui/Verse";

const STEPS = site.programme.steps;

/** Index de l'étape en cours (heure d'Abidjan = UTC), ou -1 avant la première. */
function currentStepIndex(now: Date) {
  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  let idx = -1;
  STEPS.forEach((s, i) => {
    if (hhmmToMinutes(s.at) <= minutes) idx = i;
  });
  return idx;
}

export function Programme({ phase }: { phase: Phase }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [current, setCurrent] = useState(-1);

  useEffect(() => {
    if (phase !== "jourj") return;
    const update = () => setCurrent(currentStepIndex(new Date()));
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, [phase]);

  return (
    <section id="programme" className="grain relative overflow-hidden bg-ink px-5 py-24 text-ivory md:py-32">
      <GeometricPattern id="pattern-programme" opacity={0.06} />
      <div className="relative z-[2] mx-auto max-w-5xl">
        <Verse verse={site.programme.verse} tone="dark" />

        <SectionTitle title={site.programme.title} className="mt-20 md:mt-24" />

        <ol ref={listRef} className="relative mt-16 md:mt-20">
          {/* ligne de fond + ligne dorée qui se trace au scroll */}
          <span aria-hidden="true" className="absolute bottom-0 left-[1.375rem] top-0 w-px bg-gold/15 md:left-1/2" />
          <m.span
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute bottom-0 left-[1.375rem] top-0 w-px origin-top bg-gradient-to-b from-gold-light via-gold to-gold-deep md:left-1/2"
          />

          {STEPS.map((step, i) => {
            const isCurrent = i === current;
            const right = i % 2 === 1;
            return (
              <li key={step.at} className="relative grid grid-cols-[2.75rem_1fr] items-center gap-5 py-6 md:grid-cols-[1fr_4rem_1fr] md:gap-0 md:py-8">
                {/* noeud */}
                <span className="relative z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border bg-ink transition-colors duration-700 ${
                      isCurrent ? "animate-halo border-gold text-ink !bg-gold" : "border-gold/50 text-gold"
                    }`}
                  >
                    <StepIcon name={step.icon} className="h-5 w-5" />
                  </span>
                </span>

                <Reveal
                  y={16}
                  className={`col-start-2 row-start-1 ${right ? "md:col-start-3 md:pl-10 md:text-left" : "md:col-start-1 md:pr-10 md:text-right"}`}
                >
                  <p className={`font-display text-3xl font-light md:text-4xl ${isCurrent ? "text-gold-light" : "text-gold"}`}>
                    <time dateTime={`${site.identity.weddingDay}T${step.at}`}>{step.time}</time>
                  </p>
                  <p className="mt-1 text-[0.95rem] leading-snug text-ivory/85 md:text-base">{step.label}</p>
                  {isCurrent && <p className="eyebrow mt-2 !text-[0.6rem] text-gold-light">{site.programme.nowLabel}</p>}
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal className="mt-16 text-center md:mt-20">
          <p className="mx-auto max-w-[32ch] font-display text-2xl font-light italic leading-snug text-gold-gradient md:text-3xl">
            {fr(site.programme.closing)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
