"use client";

import { useId, type CSSProperties } from "react";
import { site } from "@/content/site";

type Props = {
  className?: string;
  /** "mount" : se dessine à l'affichage ; "inView" : au scroll ; "none" : statique */
  play?: "mount" | "inView" | "none";
  delay?: number;
  /** "light" pour fond clair (or plus profond) */
  tone?: "dark" | "light";
  title?: string;
};

// Octogone régulier centré (120,120)
function octagon(r: number) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = ((22.5 + i * 45) * Math.PI) / 180;
    return `${(120 + r * Math.cos(a)).toFixed(2)},${(120 + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join(" L")} Z`;
}
const OUTER = octagon(112);
const INNER = octagon(103);

/** Monogramme C&S.A² : « C&S » en Cormorant, « .A² » en exposant doré, dans un octogone. */
export function Monogram({ className = "", play = "none", delay = 0, tone = "light", title }: Props) {
  const grad = `mg-${useId().replace(/:/g, "")}`;
  const animated = play !== "none";
  const deep = tone === "light";

  return (
    <svg
      viewBox="0 0 240 240"
      className={`${play === "mount" ? "draw-mount" : ""} ${className}`}
      style={{ "--rv-d": `${delay}s` } as CSSProperties}
      {...(play === "inView" ? { "data-rv": "" } : {})}
      role="img"
      aria-label={title ?? site.identity.monogram}
    >
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9A7A32" />
          <stop offset="0.35" stopColor={deep ? "#C9A24B" : "#E6CB8A"} />
          <stop offset="0.65" stopColor={deep ? "#9A7A32" : "#C9A24B"} />
          <stop offset="1" stopColor="#9A7A32" />
        </linearGradient>
      </defs>
      <path d={OUTER} pathLength={1} className={animated ? "draw" : ""} fill="none" stroke={`url(#${grad})`} strokeWidth={1.2} />
      <path
        d={INNER}
        pathLength={1}
        className={animated ? "draw" : ""}
        style={{ "--draw-d": "0.25s" } as CSSProperties}
        fill="none"
        stroke={`url(#${grad})`}
        strokeWidth={0.6}
        opacity={0.7}
      />
      <g className={animated ? "draw-fade" : ""}>
        <text
          x="120"
          y="136"
          textAnchor="middle"
          fill={`url(#${grad})`}
          style={{ fontFamily: "var(--font-display)", fontWeight: 300, letterSpacing: "-0.02em" }}
          fontSize="66"
        >
          C&amp;S
          <tspan fontSize="34" dy="-26" fill={deep ? "#9A7A32" : "#E6CB8A"} fontStyle="italic" fontWeight={500}>
            .A²
          </tspan>
        </text>
        <path d="M120 162 l4 4 l-4 4 l-4 -4 Z" fill={`url(#${grad})`} />
        <path d="M96 166 H112 M128 166 H144" stroke={`url(#${grad})`} strokeWidth={0.6} />
      </g>
    </svg>
  );
}
