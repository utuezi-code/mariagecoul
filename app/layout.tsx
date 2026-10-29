import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/content/site";
import { Providers } from "@/components/ui/Providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

// Amiri réduite aux seuls glyphes de « بسم الله الرحمن الرحيم » (17 Ko au lieu de 108 Ko).
// Si le texte arabe change, régénérer ce fichier : voir README, section « Police arabe ».
const amiri = localFont({
  src: "../assets/fonts/amiri-bismillah.woff2",
  weight: "400",
  variable: "--font-amiri",
  display: "swap",
});

// URL absolue pour l'image de partage : domaine de production en priorité (les URL de preview Vercel sont protégées).
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (host ? `https://${host}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.meta.title,
  description: site.meta.description,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: site.meta.title,
    description: site.meta.description,
    ...(site.media.ogImage ? { images: [{ url: site.media.ogImage.src, width: 1200, height: 630, alt: site.meta.title }] } : {}),
  },
  twitter: { card: "summary_large_image", title: site.meta.title, description: site.meta.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${inter.variable} ${amiri.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
