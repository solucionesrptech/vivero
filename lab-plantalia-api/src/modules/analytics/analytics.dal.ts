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
  /** Solo líneas de productos activos (p. ej. destacados por ventas). */
  onlyActiveProducts?: boolean;
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

    /**
     * Agregación en memoria (equivalente a groupBy + top N por cantidad).
     * Evita fallos de runtime con `groupBy` + filtro por relación en Prisma 7 + adapter pg
     * en algunos hosts (p. ej. 500 sin mensaje claro en logs).
     */
    const itemWhere: Prisma.OrderItemWhereInput = {
      order: orderWhere,
      ...(filter.onlyActiveProducts
        ? { product: { isActive: true } }
        : {}),
    };

    const lines = await this.prisma.orderItem.findMany({
      where: itemWhere,
      select: {
        productId: true,
        quantity: true,
        lineSubtotal: true,
      },
    });

    const sumsByProduct = new Map<
      string,
      { totalQuantitySold: number; totalRevenue: number }
    >();
    for (const row of lines) {
      const cur = sumsByProduct.get(row.productId) ?? {
        totalQuantitySold: 0,
        totalRevenue: 0,
      };
      cur.totalQuantitySold += row.quantity;
      cur.totalRevenue += row.lineSubtotal;
      sumsByProduct.set(row.productId, cur);
    }

    const ranked = [...sumsByProduct.entries()].sort(
      (a, b) => b[1].totalQuantitySold - a[1].totalQuantitySold,
    );
    const top = ranked.slice(0, limit);

    if (top.length === 0) {
      return [];
    }

    const ids = top.map(([productId]) => productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
    const nameById = new Map(products.map((p) => [p.id, p.name]));

    return top.map(([productId, sums]) => ({
      productId,
      productName: nameById.get(productId) ?? 'Producto',
      totalQuantitySold: sums.totalQuantitySold,
      totalRevenue: sums.totalRevenue,
    }));
  }
}
