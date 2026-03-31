/**
 * Evita pasar a `next/image` un src vacío o un host no declarado en `next.config`.
 */
export function isSafeForNextImage(trimmed: string): boolean {
  if (trimmed.startsWith("/")) {
    return true;
  }
  try {
    const u = new URL(trimmed);
    return u.protocol === "https:" && u.hostname === "images.unsplash.com";
  } catch {
    return false;
  }
}
