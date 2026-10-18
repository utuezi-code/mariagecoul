import { resolveSiteState } from "@/lib/date";
import { HomePage } from "@/components/HomePage";

// Page statique servie par le CDN, régénérée chaque minute : l'état (avant / jour J / après,
// RSVP ouvert ou clos) suit la date réelle d'Abidjan sans rendu serveur à chaque visite.
export const revalidate = 60;

export default function Page() {
  return <HomePage state={resolveSiteState(undefined)} />;
}
