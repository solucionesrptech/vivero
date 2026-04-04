/**
 * Lectura y normalización mínima de variables de entorno para SMS a la tienda (Twilio).
 *
 * Habilitar SMS tienda post-checkout: ORDER_SMS_ENABLED=true
 * Habilitar SMS al cliente (pedido listo, admin): ORDER_READY_SMS_ENABLED=true
 * Destino tienda: STORE_NOTIFY_SMS_TO (E.164 vía normalizeStoreSmsE164 en el servicio)
 * Credenciales: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
 *
 * Origen del envío (exclusivo):
 * - Si TWILIO_MESSAGING_SERVICE_SID es un SID válido (prefijo MG), solo ese modo;
 *   TWILIO_FROM_NUMBER y TWILIO_FROM se ignoran.
 * - Si no hay MG válido: TWILIO_FROM_NUMBER o, en su defecto, TWILIO_FROM (alias legado).
 */

export type StoreTwilioSmsEnv = {
  orderSmsEnabled: boolean;
  /** SMS al cliente cuando el pedido pasa a listo (admin); independiente de ORDER_SMS_ENABLED. */
  orderReadyCustomerSmsEnabled: boolean;
  accountSid: string | null;
  authToken: string | null;
  storeNotifyToRaw: string | null;
  /** Solo si hay MG válido; en ese caso fromNumber es siempre null. */
  messagingServiceSid: string | null;
  /** Solo si no hay messagingServiceSid; número remitente Twilio. */
  fromNumber: string | null;
};

function trimOrNull(value: string | undefined): string | null {
  const t = value?.trim();
  return t && t.length > 0 ? t : null;
}

function isValidMessagingServiceSid(trimmed: string): boolean {
  return trimmed.startsWith('MG');
}

export function readStoreTwilioSmsEnv(): StoreTwilioSmsEnv {
  const orderSmsEnabled = process.env.ORDER_SMS_ENABLED?.trim() === 'true';
  const orderReadyCustomerSmsEnabled =
    process.env.ORDER_READY_SMS_ENABLED?.trim() === 'true';
  const accountSid = trimOrNull(process.env.TWILIO_ACCOUNT_SID);
  const authToken = trimOrNull(process.env.TWILIO_AUTH_TOKEN);
  const storeNotifyToRaw = trimOrNull(process.env.STORE_NOTIFY_SMS_TO);

  const mgRaw = trimOrNull(process.env.TWILIO_MESSAGING_SERVICE_SID);
  const messagingServiceSid =
    mgRaw && isValidMessagingServiceSid(mgRaw) ? mgRaw : null;

  const fromNumber = messagingServiceSid
    ? null
    : trimOrNull(process.env.TWILIO_FROM_NUMBER) ??
      trimOrNull(process.env.TWILIO_FROM);

  return {
    orderSmsEnabled,
    orderReadyCustomerSmsEnabled,
    accountSid,
    authToken,
    storeNotifyToRaw,
    messagingServiceSid,
    fromNumber,
  };
}
