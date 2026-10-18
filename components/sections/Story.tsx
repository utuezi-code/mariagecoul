import { site, type SiteImage } from "@/content/site";
import { OgiveArch } from "@/components/ui/OgiveArch";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Story({ image }: { image: SiteImage | null }) {
  const { story } = site;
  return (
    <section id="histoire" className="bg-ivory px-5 py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl items-center gap-14 md:grid-cols-2 md:gap-20">
        <Reveal>
          <OgiveArch image={image} draw={false} overlay={false} className="mx-auto aspect-[2/3] w-full max-w-sm" />
        </Reveal>
        <div>
          <SectionTitle title={story.title} tone="light" className="md:!text-left" />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-graphite">
            {story.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1} as="p">
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
