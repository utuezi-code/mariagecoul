"use client";

import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { site, type SiteImage } from "@/content/site";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Gallery({ images }: { images: SiteImage[] }) {
  const g = site.gallery;
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setIndex(null), []);
  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, go]);

  return (
    <section id="galerie" className="grain relative overflow-hidden bg-ink px-5 py-24 md:py-32">
      <GeometricPattern id="pattern-gallery" opacity={0.05} />
      <div className="relative z-[2] mx-auto max-w-6xl">
        <SectionTitle title={g.title} />
        <div className="mt-14 columns-2 gap-3 md:columns-3 md:gap-5">
          {images.map((img, i) => (
            <Reveal key={img.src} delay={(i % 3) * 0.08} className="mb-3 break-inside-avoid md:mb-5">
              <button type="button" onClick={() => setIndex(i)} className="group block w-full overflow-hidden" aria-label={img.alt}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  placeholder={img.blurDataURL ? "blur" : "empty"}
                  blurDataURL={img.blurDataURL}
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox rendue dans <body> : au-dessus du menu, hors du contexte d'empilement de la section */}
      {mounted &&
        createPortal(
      <AnimatePresence>
        {index !== null && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={images[index].alt}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <m.div key={index} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image src={images[index].src} alt={images[index].alt} fill sizes="100vw" className="object-contain" />
            </m.div>
            <button type="button" onClick={close} className="absolute right-4 top-4 p-3 text-ivory" aria-label={g.close} autoFocus>
              <X className="h-6 w-6" strokeWidth={1.25} />
            </button>
            {images.length > 1 && (
              <>
                <button type="button" onClick={(e) => (e.stopPropagation(), go(-1))} className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-ivory" aria-label={g.previous}>
                  <ChevronLeft className="h-8 w-8" strokeWidth={1.25} />
                </button>
                <button type="button" onClick={(e) => (e.stopPropagation(), go(1))} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-ivory" aria-label={g.next}>
                  <ChevronRight className="h-8 w-8" strokeWidth={1.25} />
                </button>
              </>
            )}
          </m.div>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
