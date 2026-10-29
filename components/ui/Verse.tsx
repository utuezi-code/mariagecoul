import type { Verse as VerseT } from "@/content/site";
import { fr } from "@/lib/typo";
import { GoldDivider } from "./GoldDivider";
import { Reveal, WordReveal } from "./Reveal";

/** Bloc verset : référence en petites capitales, texte révélé mot par mot. */
export function Verse({ verse, tone = "dark", className = "" }: { verse: VerseT; tone?: "dark" | "light"; className?: string }) {
  const dark = tone === "dark";
  return (
    <figure className={`mx-auto max-w-[40ch] text-center ${className}`}>
      <WordReveal
        text={verse.text}
        className={`font-display text-xl font-light italic leading-relaxed md:text-2xl ${"text-graphite"}`}
      />
      <Reveal delay={0.4}>
        <GoldDivider tone={tone} className="my-5" />
        <figcaption>
          <span className={`eyebrow block ${"text-gold-ink"}`}>{verse.reference}</span>
          <span className={`mt-2 block font-display text-base italic ${"text-mist-deep"}`}>
            {fr(verse.title)}
          </span>
        </figcaption>
      </Reveal>
    </figure>
  );
}
