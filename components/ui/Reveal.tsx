import type { CSSProperties, ReactNode } from "react";
import { fr } from "@/lib/typo";

/**
 * Apparitions en CSS pur (aucune hydratation) :
 * - `onMount` : animation CSS dès le premier rendu (hero) ;
 * - sinon : l'élément porte `data-rv`, et <RevealObserver /> ajoute `data-in` quand il entre à l'écran.
 * Easing [0.22, 1, 0.36, 1], 0,8 s. Tout est neutralisé par prefers-reduced-motion (globals.css).
 */

type Common = { className?: string; delay?: number; onMount?: boolean };

function attrs(onMount: boolean, base: string, className = "", style: CSSProperties = {}) {
  return {
    className: `${base} ${onMount ? "rv-mount" : ""} ${className}`.trim(),
    style,
    ...(onMount ? {} : { "data-rv": "" }),
  };
}

const vars = (delay: number, extra: Record<string, string | number> = {}) =>
  ({ "--rv-d": `${delay}s`, ...extra }) as CSSProperties;

/** Apparition douce (opacité + translation). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  onMount = false,
  as: Tag = "div",
}: Common & { children: ReactNode; y?: number; as?: "div" | "li" | "p" | "span" }) {
  return <Tag {...attrs(onMount, "rv", className, vars(delay, { "--rv-y": `${y}px` }))}>{children}</Tag>;
}

/** Texte révélé ligne par ligne (masque + translateY). */
export function RevealLines({
  lines,
  className,
  lineClassName = "",
  delay = 0,
  onMount = false,
  as: Tag = "h2",
}: Common & { lines: ReactNode[]; lineClassName?: string; as?: "h1" | "h2" | "h3" | "p" | "div" | "span" }) {
  return (
    <Tag {...attrs(onMount, "rv-lines", className, vars(delay))}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <span className={`rv-line block ${lineClassName}`} style={{ "--i": i } as CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Verset : apparition mot par mot, lente. */
export function WordReveal({ text, className, delay = 0, onMount = false }: Common & { text: string }) {
  const clean = fr(text);
  const words = clean.split(" ");
  return (
    <p {...attrs(onMount, "rv-words", className, vars(delay))}>
      <span className="sr-only">{clean}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="rv-word inline-block" style={{ "--i": i } as CSSProperties}>
              {w}
            </span>{" "}
          </span>
        ))}
      </span>
    </p>
  );
}
