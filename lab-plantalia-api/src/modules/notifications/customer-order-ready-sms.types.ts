import type { OrderStatus } from '@prisma/client';

/** Snapshot para SMS al cliente cuando el pedido pasa a listo (admin). */
export type CustomerOrderReadySmsPayload = {
  publicCode: string;
  customerName: string;
  customerPhone: string;
  total: number;
  lines: { productName: string; quantity: number }[];
  finalStatus: Extract<
    OrderStatus,
    'READY_FOR_PICKUP' | 'READY_FOR_DELIVERY'
  >;
};
