/**
 * Snapshot mínimo para avisar a la tienda por SMS.
 * No está acoplado al origen del evento (checkout hoy, pago confirmado mañana).
 */
export type ClosedOrderNotifyLine = {
  productName: string;
  quantity: number;
};

export type ClosedOrderNotifyPayload = {
  publicCode: string;
  total: number;
  deliveryType: 'DELIVERY' | 'PICKUP';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  lines: ClosedOrderNotifyLine[];
};
