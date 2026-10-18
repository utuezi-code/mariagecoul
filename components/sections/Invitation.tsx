import { CalendarPlus, Car, Clock, MapPin, Navigation, Shirt, UtensilsCrossed } from "lucide-react";
import { site, type Venue } from "@/content/site";
import { mapsHref, yangoHref } from "@/lib/links";
import { fr } from "@/lib/typo";
import { MosqueIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Verse } from "@/components/ui/Verse";

function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const l = site.invitation.labels;
  const Icon = venue.icon === "mosque" ? MosqueIcon : UtensilsCrossed;
  const yango = yangoHref(venue);

  return (
    <Reveal delay={index * 0.15} className="h-full">
      <article className="relative flex h-full flex-col items-center overflow-hidden rounded-t-[11rem] border border-gold/30 bg-white px-6 pb-8 pt-14 text-center shadow-[0_30px_60px_-40px_rgba(11,11,11,0.35)] md:px-10 md:pt-16">
        {/* arche intérieure en filet */}
        <svg aria-hidden="true" viewBox="0 0 100 60" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-3 top-3 h-40 w-[calc(100%-1.5rem)] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" fill="none">
          <path d="M0.5 60 L0.5 40 C0.5 22 22 8 50 0.6 C78 8 99.5 22 99.5 40 L99.5 60" stroke="#C9A24B" strokeOpacity="0.5" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        </svg>

        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold-ink">
          <Icon className="h-6 w-6" strokeWidth={1.25} />
        </span>

        <h3 className="mt-6 font-display text-3xl font-light text-ink md:text-[2.2rem]">{venue.title}</h3>

        <p className="mt-4 flex items-center gap-2 font-display text-2xl text-gold-ink">
          <Clock className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
          <span className="sr-only">{l.time} :</span>
          {venue.time}
        </p>

        <dl className="mt-6 w-full space-y-4 text-[0.95rem] leading-relaxed text-graphite">
          <div>
            <dt className="eyebrow !text-[0.625rem] text-mist-deep">{l.place}</dt>
            <dd className="mt-1 flex items-start justify-center gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-ink" strokeWidth={1.25} aria-hidden="true" />
              <span>{venue.place}</span>
            </dd>
          </div>
          <div>
            <dt className="eyebrow !text-[0.625rem] text-mist-deep">{l.landmark}</dt>
            <dd className="mt-1">{venue.landmark}</dd>
          </div>
        </dl>

        <p className="mt-6 inline-flex items-center gap-2 border border-ink/80 bg-ink px-4 py-2 text-ivory">
          <Shirt className="h-4 w-4 text-gold" strokeWidth={1.25} aria-hidden="true" />
          <span className="eyebrow !text-[0.625rem] !tracking-[0.25em]">{fr(l.dressCodeBadge)}</span>
        </p>

        <div className="mt-auto flex w-full flex-col gap-3 pt-8 sm:flex-row sm:justify-center">
          <a
            href={mapsHref(venue)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-ink hover:border-gold-deep hover:bg-ink hover:text-ivory"
          >
            <Navigation className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
            {l.directions}
          </a>
          {yango ? (
            <a href={yango} target="_blank" rel="noopener noreferrer" className="btn-outline text-ink hover:border-gold-deep hover:bg-ink hover:text-ivory">
              <Car className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
              {l.yango}
            </a>
          ) : (
            <p className="flex items-center justify-center gap-2 px-2 text-sm text-mist-deep">
              <Car className="h-4 w-4 shrink-0 text-gold-ink" strokeWidth={1.25} aria-hidden="true" />
              <span>
                {fr(l.yangoFallbackPrefix)} {venue.yangoSearch}
              </span>
            </p>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export function Invitation() {
  const { invitation } = site;
  return (
    <section id="ceremonie" className="relative bg-ivory px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Verse verse={invitation.verse} tone="light" />

        <div className="mt-20 md:mt-24">
          <SectionTitle title={invitation.title} tone="light" />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-graphite">{invitation.text}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-10">
          {invitation.venues.map((v, i) => (
            <VenueCard key={v.id} venue={v} index={i} />
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <a href="/api/calendar" className="btn-outline border-gold-deep text-gold-ink hover:bg-gold-deep hover:text-white">
            <CalendarPlus className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
            {invitation.labels.addToCalendar}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
