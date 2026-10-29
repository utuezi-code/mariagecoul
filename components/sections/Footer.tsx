import { site } from "@/content/site";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { Monogram } from "@/components/ui/Monogram";

export function Footer() {
  const { footer } = site;
  return (
    <footer className="grain relative overflow-hidden border-t border-gold/25 bg-champagne px-5 pb-14 pt-20 text-center text-ink md:pt-28">
      <GeometricPattern id="pattern-footer" opacity={0.1} />
      <div className="relative z-[2] flex flex-col items-center">
        <Monogram play="inView" className="h-24 w-24 md:h-28 md:w-28" title={footer.monogram} />
        <p className="mt-8 font-display text-3xl font-light text-ink md:text-4xl">{footer.names}</p>
        <p className="mt-3 font-display text-2xl tracking-[0.2em] text-gold-gradient">{footer.date}</p>
        <GoldDivider tone="light" className="my-8" />
        <p className="font-display text-lg italic text-graphite">{footer.blessing}</p>
      </div>
    </footer>
  );
}
