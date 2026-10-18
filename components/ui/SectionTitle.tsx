import { fr } from "@/lib/typo";
import { RevealLines } from "./Reveal";

export function SectionTitle({ title, tone = "dark", className = "" }: { title: string; tone?: "dark" | "light"; className?: string }) {
  return (
    <RevealLines
      as="h2"
      lines={[fr(title)]}
      className={`text-balance text-center font-display text-[2.6rem] font-light leading-[1.05] tracking-[-0.01em] md:text-6xl ${className}`}
      lineClassName={tone === "dark" ? "text-gold-gradient" : "text-ink"}
    />
  );
}
