import { ChevronDown } from "lucide-react";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

/** Accordéon natif (<details>) : accessible, sans JavaScript. */
export function Faq() {
  const { faq } = site;
  return (
    <section id="faq" className="bg-ivory px-5 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionTitle title={faq.title} tone="light" />
        <div className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
          {faq.items.map((item, i) => (
            <Reveal key={item.question} delay={i * 0.05}>
              <details className="group py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-xl text-ink md:text-2xl [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-gold-ink transition-transform duration-500 group-open:rotate-180" strokeWidth={1.25} aria-hidden="true" />
                </summary>
                <p className="pb-5 leading-relaxed text-graphite">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
