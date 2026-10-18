import { Cake, Camera, DoorOpen, Flower2, Images, Music, UtensilsCrossed, type LucideProps } from "lucide-react";
import type { ProgrammeIcon } from "@/content/site";

/** Mosquée au trait (dôme + minaret + croissant), même style que lucide. */
export function MosqueIcon({ className, strokeWidth = 1.25 }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3.5c0 1.2-1 1.6-1 2.5" />
      <path d="M6 13c0-3.3 2.7-5.5 6-7 3.3 1.5 6 3.7 6 7" />
      <path d="M5 21v-8h14v8" />
      <path d="M10 21v-3a2 2 0 0 1 4 0v3" />
      <path d="M2 21V10l1-2 1 2v11" />
      <path d="M20 21V10l1-2 1 2v11" />
      <path d="M1.5 21h21" />
    </svg>
  );
}

const MAP = {
  mosque: MosqueIcon,
  camera: Camera,
  door: DoorOpen,
  utensils: UtensilsCrossed,
  cake: Cake,
  flower: Flower2,
  images: Images,
  music: Music,
} satisfies Record<ProgrammeIcon, React.ComponentType<LucideProps>>;

export function StepIcon({ name, className }: { name: ProgrammeIcon; className?: string }) {
  const Icon = MAP[name];
  return <Icon className={className} strokeWidth={1.25} aria-hidden="true" />;
}
