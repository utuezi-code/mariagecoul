"use client";

import { useEffect } from "react";

/** Un seul IntersectionObserver pour toute la page : ajoute `data-in` aux éléments `[data-rv]` visibles. */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    const scan = () => document.querySelectorAll("[data-rv]:not([data-in])").forEach((el) => io.observe(el));
    scan();
    // éléments ajoutés plus tard (formulaire RSVP, galerie…)
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
