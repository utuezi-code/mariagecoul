import { ImageResponse } from "next/og";
import { OgMonogram, ogFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0B0B" }}>
        <OgMonogram size={150} />
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
