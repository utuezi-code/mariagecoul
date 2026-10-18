import { site, type Site } from "@/content/site";

export type Media = Site["media"];

/** Sections optionnelles : affichées seulement si le flag est activé ET le contenu présent. */
export function optionalSections(media: Media = site.media, { forceGallery = false } = {}) {
  return {
    story: site.story.enabled && site.story.paragraphs.length > 0 && media.story !== null,
    gallery: (site.gallery.enabled || forceGallery) && media.gallery.length > 0,
    gifts: site.gifts.enabled && site.gifts.items.length > 0,
    faq: site.faq.enabled && site.faq.items.length > 0,
  };
}
