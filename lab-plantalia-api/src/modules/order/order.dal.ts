import { Injectable } from '@nestjs/common';
import type { DeliveryType, OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type OrderListLine = {
  productName: string;
  quantity: number;
};

export type OrderListRow = {
  id: string;
  publicCode: string;
  createdAt: Date;
  status: OrderStatus;
  total: number;
  deliveryType: DeliveryType;
  customerName: string;
  customerPhone: string;
  items: OrderListLine[];
};

export type OrderDetailRow = {
  id: string;
  publicCode: string;
  createdAt: Date;
  status: OrderStatus;
  total: number;
  deliveryType: DeliveryType;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    lineSubtotal: number;
  }[];
};

@Injectable()
export class OrderDal {
  constructor(private readonly prisma: PrismaService) {}

  async findByPublicCodeAndPhoneNormalized(
    publicCode: string,
    phoneNormalized: string,
  ): Promise<OrderDetailRow | null> {
    const code = publicCode.trim();
    const row = await this.prisma.order.findFirst({
      where: {
        publicCode: code,
        customerPhone: phoneNormalized,
      },
      include: {
        items: {
          include: { product: { select: { name: true } } },
          orderBy: { id: 'asc' },
        },
      },
    });
    if (!row) return null;
    return this.mapDetail(row);
  }

  private mapDetail(row: {
    id: string;
    publicCode: string;
    createdAt: Date;
    status: OrderStatus;
    total: number;
    deliveryType: DeliveryType;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string | null;
    items: {
      quantity: number;
      unitPrice: number;
      lineSubtotal: number;
      product: { name: string };
    }[];
  }): OrderDetailRow {
    return {
      id: row.id,
      publicCode: row.publicCode,
      createdAt: row.createdAt,
      status: row.status,
      total: row.total,
      deliveryType: row.deliveryType,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      deliveryAddress: row.deliveryAddress,
      items: row.items.map((i) => ({
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineSubtotal: i.lineSubtotal,
      })),
    };
  }

  async listOrders(): Promise<OrderListRow[]> {
    const rows = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: { select: { name: true } } },
          orderBy: { id: 'asc' },
        },
      },
    });
    return rows.map((row) => ({
      id: row.id,
      publicCode: row.publicCode,
      createdAt: row.createdAt,
      status: row.status,
      total: row.total,
      deliveryType: row.deliveryType,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      items: row.items.map((i) => ({
        productName: i.product.name,
        quantity: i.quantity,
      })),
    }));
  }

  async findOrderById(id: string): Promise<OrderDetailRow | null> {
    const row = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { select: { name: true } } },
          orderBy: { id: 'asc' },
        },
      },
    });
    if (!row) return null;
    return this.mapDetail(row);
  }

  async findOrderStatusAndDelivery(
    id: string,
  ): Promise<{ status: OrderStatus; deliveryType: DeliveryType } | null> {
    const row = await this.prisma.order.findUnique({
      where: { id },
      select: { status: true, deliveryType: true },
    });
    return row;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDetailRow> {
    await this.prisma.order.update({
      where: { id },
      data: { status },
    });
    const next = await this.findOrderById(id);
    if (!next) {
      throw new Error('Order missing after update');
    }
    return next;
  }
}
