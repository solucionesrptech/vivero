/**
 * Política de envío V1 (solo textos de presentación; no afecta totales ni checkout).
 */
export const SHIPPING_CARRIER_NAME = "Blue Express";

export const SHIPPING_FREIGHT_NOTE =
  "El costo del envío se paga al momento de la entrega (contra entrega).";

export const SHIPPING_CHECKOUT_TOTAL_NOTE =
  "El total no incluye el costo del envío a domicilio.";

/** Párrafo único para bloques de ayuda cuando el usuario elige envío a domicilio. */
export const SHIPPING_POLICY_DELIVERY_PARAGRAPH = [
  `Los envíos a domicilio se despachan por ${SHIPPING_CARRIER_NAME}.`,
  SHIPPING_FREIGHT_NOTE,
  SHIPPING_CHECKOUT_TOTAL_NOTE,
].join(" ");
