import { site } from "@/content/site";
import { fr } from "@/lib/typo";
import { Reveal } from "@/components/ui/Reveal";

/** Silhouette de boubou / kaftan au trait or. */
function OutfitIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none" stroke="#9A7A32" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M48 12 Q60 22 72 12" />
      <path d="M48 12 L22 24 L4 66 L20 72 L32 46 L30 132 H90 L88 46 L100 72 L116 66 L98 24 L72 12" />
      <path d="M60 22 V58" />
      <path d="M54 30 h12 M54 38 h12 M54 46 h12" strokeOpacity="0.6" />
      <path d="M42 132 V90 M78 132 V90" strokeOpacity="0.35" />
      <path d="M60 58 l3 3 l-3 3 l-3 -3 Z" fill="#C9A24B" stroke="none" />
    </svg>
  );
}

export function DressCode() {
  const { dressCode } = site;
  return (
    <section aria-label={fr(dressCode.label)} className="border-y border-gold/20 bg-white px-5 py-16 md:py-20">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center md:flex-row md:justify-center md:gap-12 md:text-left">
        <OutfitIllustration className="h-24 w-20 shrink-0 md:h-28 md:w-24" />
        <div>
          <p className="eyebrow text-gold-ink">{fr(dressCode.label)}</p>
          <p className="mt-3 font-display text-5xl font-light italic text-ink md:text-6xl">{dressCode.value}</p>
        </div>
      </Reveal>
    </section>
  );
}
