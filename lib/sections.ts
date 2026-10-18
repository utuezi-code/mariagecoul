import { site } from "@/content/site";

/** Sections optionnelles : affichées seulement si le flag est activé ET le contenu présent. */
export const optional = {
  story: site.story.enabled && site.story.paragraphs.length > 0 && site.media.story !== null,
  gallery: site.gallery.enabled && site.media.gallery.length > 0,
  gifts: site.gifts.enabled && site.gifts.items.length > 0,
  faq: site.faq.enabled && site.faq.items.length > 0,
};
