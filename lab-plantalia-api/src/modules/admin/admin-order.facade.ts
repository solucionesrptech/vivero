import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { StoreSmsNotifierService } from '../notifications/store-sms-notifier.service';
import { AdminOrderBll } from './admin-order.bll';
import { orderAllowedNextStatuses } from './admin-order.transitions';
import type { AdminOrderDetailDto } from './dto/admin-order-detail.dto';
import type { AdminOrderListRowDto } from './dto/admin-order-list-row.dto';

@Injectable()
export class AdminOrderFacade {
  constructor(
    private readonly bll: AdminOrderBll,
    private readonly storeSmsNotifier: StoreSmsNotifierService,
  ) {}

  async list(): Promise<AdminOrderListRowDto[]> {
    const rows = await this.bll.list();
    return rows.map((r) => ({
      id: r.id,
      publicCode: r.publicCode,
      createdAt: r.createdAt.toISOString(),
      status: r.status,
      total: r.total,
      deliveryType: r.deliveryType,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      items: r.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
      })),
    }));
  }

  async getById(id: string): Promise<AdminOrderDetailDto> {
    const row = await this.bll.getById(id);
    const allowedNextStatuses = orderAllowedNextStatuses(
      row.status,
      row.deliveryType,
    );
    return {
      id: row.id,
      publicCode: row.publicCode,
      createdAt: row.createdAt.toISOString(),
      status: row.status,
      total: row.total,
      deliveryType: row.deliveryType,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      deliveryAddress: row.deliveryAddress,
      items: row.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineSubtotal: i.lineSubtotal,
      })),
      allowedNextStatuses,
    };
  }

  async patchStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<AdminOrderDetailDto> {
    const { order: row, sendCustomerReadySms } = await this.bll.advanceStatus(
      orderId,
      status,
    );
    if (sendCustomerReadySms) {
      const finalStatus =
        row.status === OrderStatus.READY_FOR_DELIVERY
          ? OrderStatus.READY_FOR_DELIVERY
          : OrderStatus.READY_FOR_PICKUP;
      void this.storeSmsNotifier.notifyCustomerOrderReady({
        publicCode: row.publicCode,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        total: row.total,
        lines: row.items.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
        })),
        finalStatus,
      });
    }
    const allowedNextStatuses = orderAllowedNextStatuses(
      row.status,
      row.deliveryType,
    );
    return {
      id: row.id,
      publicCode: row.publicCode,
      createdAt: row.createdAt.toISOString(),
      status: row.status,
      total: row.total,
      deliveryType: row.deliveryType,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      deliveryAddress: row.deliveryAddress,
      items: row.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineSubtotal: i.lineSubtotal,
      })),
      allowedNextStatuses,
    };
  }
}
