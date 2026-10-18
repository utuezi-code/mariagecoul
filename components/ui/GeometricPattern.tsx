/** Motif islamique : étoile à 8 branches en entrelacs, filet or 0,5 px, très discret. */
export function GeometricPattern({
  id,
  className = "",
  opacity = 0.08,
  size = 88,
}: {
  id: string;
  className?: string;
  opacity?: number;
  size?: number;
}) {
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} style={{ opacity }}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" viewBox="0 0 80 80">
          <g fill="none" stroke="#C9A24B" strokeWidth="0.5" vectorEffect="non-scaling-stroke">
            {/* étoile à 8 branches = carré + carré pivoté */}
            <path d="M22 22 H58 V58 H22 Z" />
            <path d="M40 14.5 L65.5 40 L40 65.5 L14.5 40 Z" />
            <circle cx="40" cy="40" r="8" />
            {/* liaisons vers les tuiles voisines */}
            <path d="M40 0 V14.5 M40 65.5 V80 M0 40 H14.5 M65.5 40 H80" />
            <path d="M0 0 L22 22 M80 0 L58 22 M0 80 L22 58 M80 80 L58 58" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
