"use client";

import Image from "next/image";
import { useId, type ReactNode } from "react";
import type { SiteImage } from "@/content/site";

/** Arche d'ogive (arc brisé) — viewBox 100 × 150. */
const ARCH = "M1 150 L1 58 C1 30 24 12 50 1 C76 12 99 30 99 58 L99 150";
const ARCH_INNER = "M5 150 L5 60 C5 35 26 18 50 8 C74 18 95 35 95 60 L95 150";
/** Même forme normalisée 0..1 pour le masque des photos */
const ARCH_CLIP = "M0.01 1 L0.01 0.387 C0.01 0.2 0.24 0.08 0.5 0.007 C0.76 0.08 0.99 0.2 0.99 0.387 L0.99 1 Z";

/**
 * Cadre en arche dessiné en filet or. Si `image` est fournie, la photo apparaît dans l'arche
 * avec un dégradé sombre pour la lisibilité. Sinon : arche vide + halo, aucun placeholder.
 */
export function OgiveArch({
  image,
  children,
  className = "",
  draw = true,
  priority = false,
  overlay = true,
}: {
  image?: SiteImage | null;
  children?: ReactNode;
  className?: string;
  draw?: boolean;
  priority?: boolean;
  overlay?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const clipId = `ogive-${uid}`;
  const maskId = `ogive-mask-${uid}`;

  return (
    <div className={`relative ${className}`}>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path d={ARCH_CLIP} />
        </clipPath>
      </svg>

      {image ? (
        <div className="absolute inset-0" style={{ clipPath: `url(#${clipId})` }}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(min-width: 768px) 560px, 92vw"
            className="object-cover object-top"
            placeholder={image.blurDataURL ? "blur" : "empty"}
            blurDataURL={image.blurDataURL}
          />
          {/* haut intact (visages), fondu ivoire en bas pour la lisibilité du texte */}
          {overlay && (
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(250,248,243,0)_0%,rgba(250,248,243,0)_22%,rgba(250,248,243,0.6)_42%,rgba(250,248,243,0.94)_58%,#faf8f3_100%)]" />
          )}
        </div>
      ) : null}

      <svg
        viewBox="0 0 100 150"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        fill="none"
      >
        {/* « tracé » : un masque monte du bas vers la pointe de l'arche */}
        {draw && (
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="-2" y="-2" width="104" height="154">
              <rect x="-2" y="-2" width="104" height="154" fill="white" className="arch-sweep" />
            </mask>
          </defs>
        )}
        <g mask={draw ? `url(#${maskId})` : undefined}>
          <path d={ARCH} stroke="#C9A24B" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d={ARCH_INNER} stroke="#C9A24B" strokeOpacity="0.45" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>

      <div className="relative">{children}</div>
    </div>
  );
}
