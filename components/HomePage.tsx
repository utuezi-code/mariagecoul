import { site } from "@/content/site";
import type { SiteState } from "@/lib/date";
import { optionalSections, type Media } from "@/lib/sections";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { Navbar, type NavLink } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { DressCode } from "@/components/sections/DressCode";
import { Programme } from "@/components/sections/Programme";
import { Rsvp } from "@/components/sections/Rsvp";
import { Story } from "@/components/sections/Story";
import { Gallery } from "@/components/sections/Gallery";
import { Gifts } from "@/components/sections/Gifts";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

/**
 * Page unique. Rendue en statique (app/page.tsx) ou en aperçu forcé (app/apercu/[state]).
 * `media` vaut site.media ; seul l'aperçu de démonstration en passe un autre.
 */
export function HomePage({ state, media = site.media, demo = false }: { state: SiteState; media?: Media; demo?: boolean }) {
  const { phase, rsvpOpen } = state;
  const optional = optionalSections(media, { forceGallery: demo });
  const after = phase === "apres";
  const showRsvp = !after;
  // Après le mariage, la galerie est mise en avant juste après le hero.
  const galleryFirst = after && optional.gallery;

  const n = site.nav;
  const links: NavLink[] = [
    { href: "#accueil", label: n.home },
    ...(galleryFirst ? [{ href: "#galerie", label: n.gallery }] : []),
    ...(optional.story ? [{ href: "#histoire", label: n.story }] : []),
    { href: "#ceremonie", label: n.ceremony },
    { href: "#programme", label: n.programme },
    ...(optional.gallery && !galleryFirst ? [{ href: "#galerie", label: n.gallery }] : []),
    ...(showRsvp ? [{ href: "#rsvp", label: n.rsvp }] : []),
    ...(optional.gifts ? [{ href: "#cadeaux", label: n.gifts }] : []),
    ...(optional.faq ? [{ href: "#faq", label: n.faq }] : []),
  ];

  return (
    <>
      <SmoothScroll />
      <RevealObserver />
      <Navbar links={links} />
      <main>
        <Hero phase={phase} rsvpOpen={rsvpOpen} image={media.hero} />
        {galleryFirst && <Gallery images={media.gallery} />}
        {optional.story && <Story image={media.story} />}
        <Invitation />
        <DressCode />
        <Programme phase={phase} />
        {optional.gallery && !galleryFirst && <Gallery images={media.gallery} />}
        {showRsvp && <Rsvp open={rsvpOpen} />}
        {optional.gifts && <Gifts />}
        {optional.faq && <Faq />}
      </main>
      <Footer />
    </>
  );
}
