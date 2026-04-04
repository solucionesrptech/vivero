import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrderDal, type OrderDetailRow, type OrderListRow } from '../order/order.dal';
import { AdminOrderDomainError } from './admin-order.domain-error';
import { orderAllowedNextStatuses } from './admin-order.transitions';

export type AdvanceOrderStatusResult = {
  order: OrderDetailRow;
  /** True solo si el pedido pasó de preparación a listo (SMS al cliente en Facade). */
  sendCustomerReadySms: boolean;
};

@Injectable()
export class AdminOrderBll {
  constructor(private readonly orderDal: OrderDal) {}

  list(): Promise<OrderListRow[]> {
    return this.orderDal.listOrders();
  }

  async getById(id: string): Promise<OrderDetailRow> {
    const row = await this.orderDal.findOrderById(id);
    if (!row) {
      throw new AdminOrderDomainError('ORDER_NOT_FOUND', 'Pedido no encontrado');
    }
    return row;
  }

  async advanceStatus(
    orderId: string,
    targetStatus: OrderStatus,
  ): Promise<AdvanceOrderStatusResult> {
    const meta = await this.orderDal.findOrderStatusAndDelivery(orderId);
    if (!meta) {
      throw new AdminOrderDomainError('ORDER_NOT_FOUND', 'Pedido no encontrado');
    }
    const allowed = orderAllowedNextStatuses(meta.status, meta.deliveryType);
    if (!allowed.includes(targetStatus)) {
      throw new AdminOrderDomainError(
        'INVALID_STATUS_TRANSITION',
        'Transición de estado no permitida para este pedido.',
      );
    }
    const sendCustomerReadySms =
      meta.status === OrderStatus.AWAITING_PREPARATION &&
      (targetStatus === OrderStatus.READY_FOR_PICKUP ||
        targetStatus === OrderStatus.READY_FOR_DELIVERY);
    const order = await this.orderDal.updateStatus(orderId, targetStatus);
    return { order, sendCustomerReadySms };
  }
}
