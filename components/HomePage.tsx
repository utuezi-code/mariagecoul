import { site } from "@/content/site";
import type { SiteState } from "@/lib/date";
import { optional } from "@/lib/sections";
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

/** Page unique. Rendue en statique (app/page.tsx) ou en aperçu forcé (app/apercu/[state]). */
export function HomePage({ state }: { state: SiteState }) {
  const { phase, rsvpOpen } = state;
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
        <Hero phase={phase} rsvpOpen={rsvpOpen} />
        {galleryFirst && <Gallery />}
        {optional.story && <Story />}
        <Invitation />
        <DressCode />
        <Programme phase={phase} />
        {optional.gallery && !galleryFirst && <Gallery />}
        {showRsvp && <Rsvp open={rsvpOpen} />}
        {optional.gifts && <Gifts />}
        {optional.faq && <Faq />}
      </main>
      <Footer />
    </>
  );
}
