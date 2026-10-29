import { readFile } from "node:fs/promises";
import { join } from "node:path";

const dir = join(process.cwd(), "assets/fonts");

export async function ogFonts() {
  const [light, lightItalic, medium, inter] = await Promise.all([
    readFile(join(dir, "cormorant-garamond-latin-300-normal.woff")),
    readFile(join(dir, "cormorant-garamond-latin-300-italic.woff")),
    readFile(join(dir, "cormorant-garamond-latin-500-normal.woff")),
    readFile(join(dir, "inter-latin-500-normal.woff")),
  ]);
  return [
    { name: "Cormorant", data: light, weight: 300 as const, style: "normal" as const },
    { name: "Cormorant", data: lightItalic, weight: 300 as const, style: "italic" as const },
    { name: "Cormorant", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Inter", data: inter, weight: 500 as const, style: "normal" as const },
  ];
}

function octagon(cx: number, cy: number, r: number) {
  return (
    "M" +
    Array.from({ length: 8 }, (_, i) => {
      const a = ((22.5 + i * 45) * Math.PI) / 180;
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
    }).join(" L") +
    " Z"
  );
}

export const GOLD = "linear-gradient(100deg, #7A5F24 0%, #B8913F 35%, #9A7A32 60%, #7A5F24 100%)";

/** Monogramme pour next/og (texte HTML + octogone SVG). */
export function OgMonogram({ size }: { size: number }) {
  const s = size / 240;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 240 240" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9A7A32" />
            <stop offset="0.4" stopColor="#C9A24B" />
            <stop offset="0.7" stopColor="#9A7A32" />
            <stop offset="1" stopColor="#9A7A32" />
          </linearGradient>
        </defs>
        <path d={octagon(120, 120, 112)} fill="none" stroke="url(#g)" strokeWidth={size < 100 ? 6 : 1.4} />
        {size >= 100 && <path d={octagon(120, 120, 103)} fill="none" stroke="url(#g)" strokeWidth={0.7} opacity={0.7} />}
      </svg>
      <div style={{ display: "flex", alignItems: "flex-start", marginTop: 8 * s }}>
        <span
          style={{
            fontFamily: "Cormorant",
            fontWeight: size < 100 ? 500 : 300,
            fontSize: (size < 100 ? 80 : 68) * s,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            backgroundImage: GOLD,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          C&amp;S
        </span>
        {size >= 100 && (
          <span style={{ fontFamily: "Cormorant", fontStyle: "italic", fontWeight: 300, fontSize: 34 * s, lineHeight: 1, color: "#9A7A32", marginTop: -6 * s }}>
            .A²
          </span>
        )}
      </div>
    </div>
  );
}
