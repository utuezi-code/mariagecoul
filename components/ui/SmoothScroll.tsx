"use client";

import type Lenis from "lenis";
import { useEffect } from "react";

/** Smooth scroll subtil + défilement doux vers les ancres. Désactivé si prefers-reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let raf = 0;
    let cancelled = false;
    // Chargé après l'affichage pour ne pas retarder l'interactivité
    const start = () =>
      import("lenis").then(({ default: L }) => {
        if (cancelled || reduced) return;
        lenis = new L({ lerp: 0.12, wheelMultiplier: 0.9 });
        const loop = (t: number) => {
          lenis!.raf(t);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      });
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 1200);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : document.body;
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(id ? el : 0, { offset: id ? -64 : 0, duration: 1.4 });
      else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      history.replaceState(null, "", id ? `#${id}` : location.pathname + location.search);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle);
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}
