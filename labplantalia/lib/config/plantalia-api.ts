/** Base URL del API Nest (sin barra final). */
export function getPlantaliaApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_PLANTALIA_API_URL ?? "http://localhost:3101";
  return raw.replace(/\/$/, "");
}
