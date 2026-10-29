import { ExternalLink, Gift } from "lucide-react";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Gifts() {
  const { gifts } = site;
  return (
    <section id="cadeaux" className="bg-white px-5 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={gifts.title} tone="light" />
        {gifts.intro && <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-graphite">{gifts.intro}</p>}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gifts.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className="flex h-full flex-col items-center border border-gold/30 bg-ivory px-6 py-10 text-center">
                <Gift className="h-7 w-7 text-gold-ink" strokeWidth={1.25} aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl text-ink">{item.title}</h3>
                {item.description && <p className="mt-3 leading-relaxed text-graphite">{item.description}</p>}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-outline mt-auto translate-y-4 text-ink hover:border-gold-ink hover:bg-gold-ink hover:text-white">
                    {item.linkLabel ?? item.title}
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden="true" />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
