import { OrderStatus } from '@prisma/client';

/**
 * Ventas para analytics (cantidades vendidas, ingresos, destacados por ventas):
 * órdenes que ya representan una compra cerrada o en flujo operativo post-checkout.
 * Excluye PENDING y CANCELLED.
 * Al añadir estados nuevos al flujo, incluirlos aquí si deben contar como venta.
 */
export const ORDER_STATUSES_COUNTED_AS_SALES: OrderStatus[] = [
  OrderStatus.CONFIRMED,
  OrderStatus.AWAITING_PREPARATION,
  OrderStatus.READY_FOR_DELIVERY,
  OrderStatus.READY_FOR_PICKUP,
  OrderStatus.PICKED_UP,
  OrderStatus.DELIVERED,
];
