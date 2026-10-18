/** Typographie française : espaces insécables devant ! ? : ; » et après «. */
export function fr(text: string): string {
  return text.replace(/ ([!?:;»])/g, " $1").replace(/« /g, "« ");
}
