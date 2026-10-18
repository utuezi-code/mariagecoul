/** Filet or — étoile à 8 branches — filet or */
export function GoldDivider({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const c = tone === "light" ? "#9A7A32" : "#C9A24B";
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-12 md:w-20" style={{ background: `linear-gradient(90deg, transparent, ${c})` }} />
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke={c} strokeWidth="1">
        <path d="M10 1 L12.5 7.5 L19 10 L12.5 12.5 L10 19 L7.5 12.5 L1 10 L7.5 7.5 Z" />
        <path d="M4 4 L10 6.5 L16 4 L13.5 10 L16 16 L10 13.5 L4 16 L6.5 10 Z" opacity="0.6" />
      </svg>
      <span className="h-px w-12 md:w-20" style={{ background: `linear-gradient(270deg, transparent, ${c})` }} />
    </div>
  );
}
