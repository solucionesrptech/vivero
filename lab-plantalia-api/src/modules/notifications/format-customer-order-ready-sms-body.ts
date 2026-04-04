import { OrderStatus } from '@prisma/client';
import type { CustomerOrderReadySmsPayload } from './customer-order-ready-sms.types';

const SMS_BODY_MAX = 480;

function headerForStatus(
  finalStatus: CustomerOrderReadySmsPayload['finalStatus'],
): string {
  if (finalStatus === OrderStatus.READY_FOR_DELIVERY) {
    return 'Su pedido ya está listo para entrega en Vivero Plantalia.';
  }
  return 'Su pedido ya está listo para retiro en Vivero Plantalia.';
}

export function formatCustomerOrderReadySmsBody(
  p: CustomerOrderReadySmsPayload,
): string {
  const header = headerForStatus(p.finalStatus);
  const productLines = p.lines.map(
    (l) => `- ${l.productName} x${l.quantity}`,
  );
  const text = [
    header,
    '',
    `Cliente: ${p.customerName}`,
    `Pedido: ${p.publicCode}`,
    `Total: $${p.total.toLocaleString('es-CL')} CLP`,
    '',
    'Productos:',
    ...productLines,
  ].join('\n');
  if (text.length <= SMS_BODY_MAX) {
    return text;
  }
  return `${text.slice(0, SMS_BODY_MAX - 3)}...`;
}
