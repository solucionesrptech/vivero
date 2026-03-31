import { Injectable } from '@nestjs/common';
import type { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { TopProductSoldRow } from './analytics.types';

export type TopProductsDalFilter = {
  orderStatuses: OrderStatus[];
  /** V2: acotar por fecha de la orden (inclusive). */
  dateFrom?: Date;
  /** V2: acotar por fecha de la orden (inclusive). */
  dateTo?: Date;
};

@Injectable()
export class AnalyticsDal {
  constructor(private readonly prisma: PrismaService) {}

  async findTopProductsByQuantitySold(
    limit: number,
    filter: TopProductsDalFilter,
  ): Promise<TopProductSoldRow[]> {
    const orderWhere: Prisma.OrderWhereInput = {
      status: { in: filter.orderStatuses },
    };
    if (filter.dateFrom != null || filter.dateTo != null) {
      orderWhere.createdAt = {};
      if (filter.dateFrom != null) {
        orderWhere.createdAt.gte = filter.dateFrom;
      }
      if (filter.dateTo != null) {
        orderWhere.createdAt.lte = filter.dateTo;
      }
    }

    const grouped = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: orderWhere },
      _sum: { quantity: true, lineSubtotal: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    if (grouped.length === 0) {
      return [];
    }

    const ids = grouped.map((g) => g.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
    const nameById = new Map(products.map((p) => [p.id, p.name]));

    return grouped.map((g) => ({
      productId: g.productId,
      productName: nameById.get(g.productId) ?? 'Producto',
      totalQuantitySold: g._sum.quantity ?? 0,
      totalRevenue: g._sum.lineSubtotal ?? 0,
    }));
  }
}
