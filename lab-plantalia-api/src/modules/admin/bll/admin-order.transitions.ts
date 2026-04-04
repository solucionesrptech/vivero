import { DeliveryType, OrderStatus } from '@prisma/client';

export function orderAllowedNextStatuses(
  current: OrderStatus,
  delivery: DeliveryType,
): OrderStatus[] {
  switch (current) {
    case OrderStatus.CONFIRMED:
      return [OrderStatus.AWAITING_PREPARATION];
    case OrderStatus.AWAITING_PREPARATION:
      return delivery === DeliveryType.DELIVERY
        ? [OrderStatus.READY_FOR_DELIVERY]
        : [OrderStatus.READY_FOR_PICKUP];
    case OrderStatus.READY_FOR_PICKUP:
      return [OrderStatus.PICKED_UP];
    case OrderStatus.READY_FOR_DELIVERY:
      return [OrderStatus.DELIVERED];
    default:
      return [];
  }
}
