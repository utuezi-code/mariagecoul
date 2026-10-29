import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { GOLD, OgMonogram, ogFonts } from "@/lib/og";

export const alt = site.meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STAR = "M40 14.5 L65.5 40 L40 65.5 L14.5 40 Z M22 22 H58 V58 H22 Z";

export default async function OgImage() {
  const { identity } = site;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FAF8F3 45%, #F4ECDB 100%)",
          color: "#3A2E1A",
          position: "relative",
        }}
      >
        {/* motif d'étoiles à 8 branches */}
        <svg width="1200" height="630" style={{ position: "absolute", top: 0, left: 0, opacity: 0.14 }}>
          {Array.from({ length: 8 }).flatMap((_, r) =>
            Array.from({ length: 15 }).map((__, c) => (
              <path key={`${r}-${c}`} d={STAR} transform={`translate(${c * 84 - 12} ${r * 84 - 20}) scale(1.05)`} fill="none" stroke="#C9A24B" strokeWidth="1" />
            )),
          )}
        </svg>
        {/* arche d'ogive */}
        <svg width="560" height="600" viewBox="0 0 100 150" preserveAspectRatio="none" style={{ position: "absolute", top: 30, left: 320 }}>
          <path d="M1 150 L1 58 C1 30 24 12 50 1 C76 12 99 30 99 58 L99 150" fill="none" stroke="#9A7A32" strokeWidth="0.35" />
        </svg>

        <OgMonogram size={150} />
        <div style={{ display: "flex", marginTop: 26, fontFamily: "Inter", fontSize: 18, letterSpacing: "0.4em", color: "#7A5F24", textTransform: "uppercase" }}>
          {site.hero.title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontFamily: "Cormorant",
            fontWeight: 300,
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            backgroundImage: GOLD,
            backgroundClip: "text",
            color: "transparent",
            padding: "0 10px 12px",
          }}
        >
          {identity.groomFirstName}
          <span style={{ fontStyle: "italic", margin: "0 22px" }}>&amp;</span>
          {identity.brideFirstName}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, #C9A24B)" }} />
          <div style={{ margin: "0 22px", fontFamily: "Cormorant", fontWeight: 500, fontSize: 38, letterSpacing: "0.12em", color: "#3A2E1A" }}>
            {identity.dateLong}
          </div>
          <div style={{ width: 80, height: 1, background: "linear-gradient(270deg, transparent, #C9A24B)" }} />
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
