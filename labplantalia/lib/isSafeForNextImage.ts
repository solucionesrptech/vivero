/**
 * Evita pasar a `next/image` un src vacío o un host no declarado en `next.config`.
 * Debe alinearse con `images.remotePatterns` en `next.config.ts`.
 */
export function isSafeForNextImage(trimmed: string): boolean {
  if (trimmed.startsWith("/")) {
    return true;
  }
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "https:") {
      return false;
    }
    const { hostname } = u;
    if (hostname === "images.unsplash.com") {
      return true;
    }
    if (hostname === "res.cloudinary.com" || hostname.endsWith(".cloudinary.com")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
