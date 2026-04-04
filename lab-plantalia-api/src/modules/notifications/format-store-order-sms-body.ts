import type { ClosedOrderNotifyPayload } from './closed-order-notify.types';

const SMS_BODY_MAX = 420;

const SMS_HEADER_PREFIX = 'Gracias por su compra en Vivero Plantalia';

/** Alineado con política V1 tienda (envío a domicilio). */
const SMS_DELIVERY_CARRIER_NOTE = 'Blue Express; flete al entregar';

/**
 * Texto del SMS para la tienda. Acotado en longitud para limitar segmentos/costo.
 * Nombre del cliente y total omitidos temporalmente para acortar el mensaje.
 */
export function formatStoreOrderSmsBody(p: ClosedOrderNotifyPayload): string {
  const tipo = p.deliveryType === 'DELIVERY' ? 'Delivery' : 'Retiro tienda';
  const parts: string[] = [
    `Plantalia pedido ${p.publicCode}`,
    `Entrega: ${tipo}`,
  ];
  if (p.deliveryType === 'DELIVERY' && p.deliveryAddress?.trim()) {
    parts.push(`Dir: ${p.deliveryAddress.trim()}`);
  }
  if (p.deliveryType === 'DELIVERY') {
    parts.push(SMS_DELIVERY_CARRIER_NOTE);
  }
  parts.push('Ítems:');
  for (let i = 0; i < Math.min(2, p.lines.length); i++) {
    const l = p.lines[i];
    parts.push(`• ${l.productName} ×${l.quantity}`);
  }
  if (p.lines.length > 2) {
    parts.push(`+${p.lines.length - 2} más`);
  }
  let body = parts.join('\n');
  if (body.length > SMS_BODY_MAX) {
    body = `${body.slice(0, SMS_BODY_MAX - 3)}...`;
  }
  return `${SMS_HEADER_PREFIX}${body}`;
}
