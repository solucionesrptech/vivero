/**
 * Base URL del API Nest (sin barra final).
 *
 * En Vercel el *valor* debe ser la URL real (ej. https://tu-api.onrender.com),
 * no el texto "NEXT_PUBLIC_PLANTALIA_API_URL".
 */

function isValidApiBaseUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  // Evita que alguien pegue el nombre de la variable como valor (petición relativa al dominio del front).
  if (/^NEXT_PUBLIC_/i.test(v)) return false;
  return /^https?:\/\//i.test(v);
}

export function getPlantaliaApiBaseUrl(): string {
  const preferred = process.env.NEXT_PUBLIC_PLANTALIA_API_URL?.trim() ?? "";
  const legacy = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
  const candidate = preferred || legacy;

  if (isValidApiBaseUrl(candidate)) {
    return candidate.replace(/\/$/, "");
  }

  if (candidate.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_PLANTALIA_API_URL (o NEXT_PUBLIC_API_URL) debe ser una URL absoluta con http:// o https://, " +
        "por ejemplo https://tu-servicio.onrender.com — no uses el nombre de la variable como valor.",
    );
  }

  return "http://localhost:3101";
}
