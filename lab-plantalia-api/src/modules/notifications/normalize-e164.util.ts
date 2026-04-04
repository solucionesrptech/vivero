/**
 * Normaliza número chileno típico a E.164 para Twilio (+56…).
 */
export function normalizeStoreSmsE164(raw: string): string | null {
  const d = raw.replace(/\D/g, '');
  if (d.length < 9) return null;
  if (d.startsWith('56')) return `+${d}`;
  if (d.length === 9 && d.startsWith('9')) return `+56${d}`;
  return `+${d}`;
}
