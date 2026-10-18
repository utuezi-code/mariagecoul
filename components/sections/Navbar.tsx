"use client";

import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Monogram } from "@/components/ui/Monogram";

export type NavLink = { href: string; label: string };

export function Navbar({ links }: { links: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled && !open ? "border-b border-gold/15 bg-ink/80 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8" aria-label="Navigation principale">
        <a href="#accueil" className="relative z-[60] -ml-1 p-1" aria-label={`${site.nav.home} — ${site.identity.monogram}`}>
          <Monogram className="h-10 w-10" />
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="eyebrow text-ivory/80 transition-colors hover:text-gold-light">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="relative z-[60] -mr-2 flex h-11 w-11 items-center justify-center text-ivory md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? site.nav.closeMenu : site.nav.openMenu}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X strokeWidth={1.25} className="h-6 w-6" /> : <Menu strokeWidth={1.25} className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu-mobile"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ul className="flex flex-col items-center gap-6">
              {links.map((l, i) => (
                <m.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="font-display text-5xl font-light text-ivory transition-colors hover:text-gold-light">
                    {l.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <p className="eyebrow absolute bottom-10 text-gold">{site.identity.dateShort}</p>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
