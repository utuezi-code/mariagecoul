import { site, type SiteImage } from "@/content/site";
import type { Phase } from "@/lib/date";
import { fr } from "@/lib/typo";
import { Countdown } from "@/components/ui/Countdown";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { Monogram } from "@/components/ui/Monogram";
import { OgiveArch } from "@/components/ui/OgiveArch";
import { Reveal, RevealLines } from "@/components/ui/Reveal";

export function Hero({ phase, rsvpOpen, image }: { phase: Phase; rsvpOpen: boolean; image: SiteImage | null }) {
  const { hero, identity } = site;
  const after = phase === "apres";

  return (
    <section id="accueil" className="grain relative overflow-hidden bg-ink text-ivory">
      <GeometricPattern id="pattern-hero" opacity={0.07} />
      <div aria-hidden="true" className="halo pointer-events-none absolute left-1/2 top-[52%] h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2" />
      {/* vignette */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,11,11,0.85)_100%)]" />

      <div className="relative z-[2] mx-auto flex max-w-3xl flex-col items-center px-5 pb-20 pt-24 text-center md:pb-28 md:pt-32">
        {/* Bismillah */}
        <Reveal onMount delay={0.1} y={12}>
          <p lang="ar" dir="rtl" className="font-arabic text-[1.9rem] leading-[1.6] text-gold-gradient md:text-4xl">
            {hero.bismillahArabic}
          </p>
          <p className="eyebrow mt-2 text-gold/80">{hero.bismillahTranslit}</p>
        </Reveal>

        {/* Verset Ar-Rum */}
        <figure className="mt-8 max-w-[40ch] md:mt-10">
          {/* Hero : apparition d'un seul bloc (le mot par mot est réservé aux versets au scroll) */}
          <Reveal as="p" onMount delay={0.2} y={10} className="font-display text-lg font-light italic leading-relaxed text-ivory/85 md:text-xl">
            {fr(hero.verse.text)}
          </Reveal>
          <Reveal onMount delay={0.6} y={8}>
            <figcaption className="mt-3">
              <span className="eyebrow text-gold">{hero.verse.reference}</span>
              <span className="mt-1 block font-display text-sm italic text-ivory/55">{fr(hero.verse.title)}</span>
            </figcaption>
          </Reveal>
        </figure>

        {/* Arche + noms */}
        <OgiveArch image={image} priority className="mt-10 w-full max-w-[22rem] md:mt-14 md:max-w-[38rem]">
          <div className="flex flex-col items-center px-6 pb-12 pt-10 md:px-10 md:pb-16 md:pt-14">
            <Monogram play="mount" delay={0.2} className="h-20 w-20 md:h-24 md:w-24" />

            {after ? (
              <RevealLines
                as="h1"
                onMount
                delay={1.2}
                lines={[fr(hero.afterTitle)]}
                className="mt-8 font-display text-4xl font-light leading-tight md:text-5xl"
                lineClassName="text-gold-gradient"
              />
            ) : (
              <>
                <Reveal onMount delay={1.0} y={10}>
                  <p className="eyebrow mt-7 text-gold">{fr(hero.eyebrow)}</p>
                  <p className="mt-3 font-display text-2xl font-light italic text-ivory/90 md:text-3xl">{hero.title}</p>
                </Reveal>
                <h1 className="mt-6 font-display font-light leading-[0.95] tracking-[-0.02em]">
                  <span className="sr-only">
                    {identity.groom} &amp; {identity.bride}
                  </span>
                  <span aria-hidden="true">
                    <RevealLines
                      as="span"
                      className="block"
                      onMount
                      delay={1.25}
                      lineClassName="text-gold-gradient"
                      lines={[
                        <span key="g" className="whitespace-nowrap text-[3.6rem] md:text-[5.5rem]">
                          {identity.groomFirstName}
                        </span>,
                      ]}
                    />
                    <Reveal as="span" className="block" onMount delay={1.45} y={6}>
                      <span className="eyebrow block text-ivory/60">{identity.groom}</span>
                    </Reveal>
                    <RevealLines
                      as="span"
                      onMount
                      delay={1.55}
                      className="mt-4 block"
                      lineClassName="text-gold-gradient"
                      lines={[
                        <span key="b" className="whitespace-nowrap text-[3.6rem] md:text-[5.5rem]">
                          <span className="italic">&amp;</span> {identity.brideFirstName}
                        </span>,
                      ]}
                    />
                    <Reveal as="span" className="block" onMount delay={1.75} y={6}>
                      <span className="eyebrow block text-ivory/60">{identity.bride}</span>
                    </Reveal>
                  </span>
                </h1>
              </>
            )}

            <Reveal onMount delay={after ? 1.5 : 1.95} y={8}>
              <p className="mt-8 font-display text-xl text-ivory md:text-2xl">{identity.dateLong}</p>
            </Reveal>
          </div>
        </OgiveArch>

        {!after && (
          <Reveal onMount delay={2.1} className="mt-12 md:mt-14">
            <Countdown forceToday={phase === "jourj"} />
          </Reveal>
        )}

        {rsvpOpen && (
          <Reveal onMount delay={2.25} className="mt-12">
            <a href="#rsvp" className="btn-gold">
              {hero.cta}
            </a>
          </Reveal>
        )}

        {!after && (
          <Reveal onMount delay={2.4}>
            <p className="mt-8 text-xs tracking-wide text-ivory/60">{hero.privacyNote}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
